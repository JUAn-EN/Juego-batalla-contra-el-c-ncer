// ============================================
// RUTAS DE AUTENTICACIÓN
// ============================================

const express = require('express');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { generateToken, authenticateToken, verifyToken } = require('../config/auth');

const router = express.Router();

// Rate limiting para rutas de autenticación
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // máximo 5 intentos por IP cada 15 minutos
    message: {
        error: 'Demasiados intentos de autenticación',
        message: 'Por favor, intenta nuevamente en 15 minutos'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Validaciones para registro
const registerValidation = [
    body('username')
        .isLength({ min: 3, max: 30 })
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('El username debe tener 3-30 caracteres y solo letras, números y _'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email inválido'),
    body('password')
        .isLength({ min: 6 })
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número'),
    body('full_name')
        .isLength({ min: 2, max: 100 })
        .trim()
        .withMessage('El nombre debe tener entre 2 y 100 caracteres')
];

// Validaciones para login
const loginValidation = [
    body('login')
        .notEmpty()
        .withMessage('Email o username requerido'),
    body('password')
        .notEmpty()
        .withMessage('Contraseña requerida')
];

// ============================================
// REGISTRO DE USUARIO
// ============================================
router.post('/register', authLimiter, registerValidation, async (req, res) => {
    try {
        // Verificar validaciones
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Datos inválidos',
                message: 'Por favor, verifica los datos ingresados',
                details: errors.array()
            });
        }

        const { username, email, password, full_name } = req.body;

        // Crear usuario
        const user = await User.create({
            username,
            email,
            password,
            full_name
        });

        // Generar tokens
        const accessToken = generateToken(user.id, user.username);
        const refreshToken = generateToken(user.id, user.username);

        // Actualizar último login
        await user.updateLastLogin();

        res.status(201).json({
            message: '¡Usuario registrado exitosamente!',
            user: user.toJSON(),
            tokens: {
                access: accessToken,
                refresh: refreshToken
            },
            expiresIn: '7 días'
        });

    } catch (error) {
        console.error('Error en registro:', error);
        
        if (error.message.includes('ya existe')) {
            return res.status(409).json({
                error: 'Usuario existente',
                message: error.message
            });
        }

        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudo completar el registro'
        });
    }
});

// ============================================
// INICIO DE SESIÓN
// ============================================
router.post('/login', authLimiter, loginValidation, async (req, res) => {
    try {
        // Verificar validaciones
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Datos inválidos',
                message: 'Por favor, verifica los datos ingresados',
                details: errors.array()
            });
        }

        const { login, password } = req.body;

        // Buscar usuario por email o username
        let user = null;
        if (login.includes('@')) {
            user = await User.findByEmail(login);
        } else {
            user = await User.findByUsername(login);
        }

        if (!user) {
            return res.status(401).json({
                error: 'Credenciales inválidas',
                message: 'Usuario o contraseña incorrectos'
            });
        }

        // Verificar contraseña
        const isValidPassword = await user.verifyPassword(password);
        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Credenciales inválidas',
                message: 'Usuario o contraseña incorrectos'
            });
        }

        // Generar tokens
        const accessToken = generateToken(user.id, user.username);
        const refreshToken = generateToken(user.id, user.username);

        // Actualizar último login
        await user.updateLastLogin();

        res.json({
            message: '¡Inicio de sesión exitoso!',
            user: user.toJSON(),
            tokens: {
                access: accessToken,
                refresh: refreshToken
            },
            expiresIn: '7 días'
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudo completar el inicio de sesión'
        });
    }
});

// ============================================
// RENOVAR TOKEN
// ============================================
router.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                error: 'Token de refresco requerido',
                message: 'Debes proporcionar un token de refresco válido'
            });
        }

        // Verificar token de refresco
        const decoded = verifyToken(refreshToken);
        
        if (decoded.type !== 'refresh') {
            return res.status(401).json({
                error: 'Tipo de token inválido',
                message: 'Se requiere un token de refresco válido'
            });
        }

        // Buscar usuario
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                error: 'Usuario no encontrado',
                message: 'El usuario asociado al token no existe'
            });
        }

        // Generar nuevo token de acceso
        const accessToken = generateToken(user.id, user.username);

        res.json({
            message: 'Token renovado exitosamente',
            tokens: {
                access: accessToken
            },
            expiresIn: '7 días'
        });

    } catch (error) {
        console.error('Error al renovar token:', error);
        res.status(403).json({
            error: 'Token inválido',
            message: 'El token de refresco es inválido o ha expirado'
        });
    }
});

// ============================================
// VERIFICAR TOKEN
// ============================================
router.get('/verify', authenticateToken, async (req, res) => {
    try {
        // Buscar usuario actualizado
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).json({
                error: 'Usuario no encontrado',
                message: 'El usuario asociado al token no existe'
            });
        }

        res.json({
            valid: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                avatar_url: user.avatar_url,
                created_at: user.created_at,
                updated_at: user.updated_at,
                last_login: user.last_login,
                is_active: user.is_active,
                total_score: user.total_score,
                games_played: user.games_played,
                levels_completed: user.levels_completed
            },
            message: 'Token válido'
        });

    } catch (error) {
        console.error('Error al verificar token:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudo verificar el token'
        });
    }
});

// ============================================
// CERRAR SESIÓN
// ============================================
router.post('/logout', authenticateToken, async (req, res) => {
    try {
        // En una implementación más robusta, aquí podrías invalidar el token
        // agregándolo a una blacklist en Redis o base de datos
        
        res.json({
            message: 'Sesión cerrada exitosamente',
            success: true
        });

    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudo cerrar la sesión'
        });
    }
});

// ============================================
// OBTENER PERFIL DEL USUARIO
// ============================================
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado',
                message: 'El usuario no existe'
            });
        }

        // Obtener estadísticas adicionales
        const ranking = await user.getRanking();
        const achievements = await user.getAchievements();
        const recentScores = await user.getScores(5);

        res.json({
            user: user.toJSON(),
            stats: {
                ranking,
                achievements: achievements.length,
                recentScores
            }
        });

    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            message: 'No se pudo obtener el perfil'
        });
    }
});

// ============================================
// RUTA DE DEBUG - INFORMACIÓN DETALLADA DEL USUARIO
// ============================================
router.get('/debug', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            });
        }

        // Obtener estadísticas de juegos
        const { executeQuery } = require('../config/database');
        const gameStats = await executeQuery(
            'SELECT COUNT(*) as total_games, SUM(score) as total_game_score FROM game_scores WHERE user_id = ?',
            [req.user.id]
        );

        res.json({
            user_from_db: user.toJSON(),
            game_statistics: gameStats[0],
            debug_info: {
                user_id: req.user.id,
                timestamp: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error en debug:', error);
        res.status(500).json({
            error: 'Error en debug',
            message: error.message
        });
    }
});

module.exports = router;