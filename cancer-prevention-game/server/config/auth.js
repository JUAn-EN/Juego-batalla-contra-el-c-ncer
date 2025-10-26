// ============================================
// CONFIGURACIÓN DE AUTENTICACIÓN JWT
// ============================================

const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'vitaguard-heroes-super-secret-key-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generar token JWT
const generateToken = (userId, username) => {
    return jwt.sign(
        { 
            userId, 
            username,
            timestamp: Date.now()
        }, 
        JWT_SECRET, 
        { expiresIn: JWT_EXPIRES_IN }
    );
};

// Verificar token JWT
const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Token inválido: ' + error.message);
    }
};

// Middleware para verificar autenticación
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            error: 'Token de acceso requerido',
            message: 'Debes iniciar sesión para acceder a este recurso'
        });
    }

    try {
        const decoded = verifyToken(token);
        // Asegurar que el objeto user tenga la propiedad id
        req.user = {
            id: decoded.userId,
            userId: decoded.userId,
            username: decoded.username,
            timestamp: decoded.timestamp
        };
        next();
    } catch (error) {
        return res.status(403).json({
            error: 'Token inválido',
            message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente'
        });
    }
};

// Middleware para autenticación opcional
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        try {
            const decoded = verifyToken(token);
            // Asegurar que el objeto user tenga la propiedad id
            req.user = {
                id: decoded.userId,
                userId: decoded.userId,
                username: decoded.username,
                timestamp: decoded.timestamp
            };
        } catch (error) {
            // Token inválido pero continuamos sin usuario
            req.user = null;
        }
    } else {
        req.user = null;
    }
    
    next();
};

module.exports = {
    generateToken,
    verifyToken,
    authenticateToken,
    optionalAuth,
    JWT_SECRET
};