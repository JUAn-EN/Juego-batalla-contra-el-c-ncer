// ============================================
// MODELO DE USUARIO
// ============================================

const bcrypt = require('bcryptjs');
const { executeQuery } = require('../config/database');

class User {
    constructor(userData) {
        this.id = userData.id;
        this.username = userData.username;
        this.email = userData.email;
        this.password_hash = userData.password_hash;
        this.full_name = userData.full_name;
        this.avatar_url = userData.avatar_url;
        this.created_at = userData.created_at;
        this.updated_at = userData.updated_at;
        this.last_login = userData.last_login;
        this.is_active = userData.is_active;
        this.total_score = userData.total_score || 0;
        this.games_played = userData.games_played || 0;
        this.levels_completed = userData.levels_completed || 0;
    }
    
    // Crear nuevo usuario
    static async create({ username, email, password, full_name }) {
        try {
            // Verificar si el email ya existe
            const existingEmail = await this.findByEmail(email);
            if (existingEmail) {
                throw new Error('Ya existe una cuenta registrada con este email. ¿Quizás quieres iniciar sesión?');
            }
            
            // Verificar si el username ya existe
            const existingUsername = await this.findByUsername(username);
            if (existingUsername) {
                throw new Error('Este nombre de usuario ya está en uso. Por favor, elige otro nombre de héroe.');
            }
            
            // Hashear la contraseña
            const saltRounds = 12;
            const password_hash = await bcrypt.hash(password, saltRounds);
            
            // Insertar usuario
            const result = await executeQuery(
                `INSERT INTO users (username, email, password_hash, full_name) 
                 VALUES (?, ?, ?, ?)`,
                [username, email, password_hash, full_name]
            );
            
            // Obtener el usuario creado
            const newUser = await this.findById(result.insertId);
            return new User(newUser);
        } catch (error) {
            // Si es un error de duplicado de MySQL, dar mensaje más específico
            if (error.code === 'ER_DUP_ENTRY') {
                if (error.message.includes('email')) {
                    throw new Error('Ya existe una cuenta registrada con este email. ¿Quizás quieres iniciar sesión?');
                } else if (error.message.includes('username')) {
                    throw new Error('Este nombre de usuario ya está en uso. Por favor, elige otro nombre de héroe.');
                }
                throw new Error('Ya existe una cuenta con estos datos. Por favor, verifica tu información.');
            }
            
            // Re-lanzar el error si ya tiene un mensaje personalizado
            if (error.message.includes('Ya existe') || error.message.includes('ya está en uso')) {
                throw error;
            }
            
            throw new Error('Error al crear usuario: ' + error.message);
        }
    }
    
    // Buscar usuario por ID
    static async findById(id) {
        try {
            const results = await executeQuery(
                'SELECT * FROM users WHERE id = ? AND is_active = TRUE',
                [id]
            );
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            throw new Error('Error al buscar usuario: ' + error.message);
        }
    }
    
    // Buscar usuario por email
    static async findByEmail(email) {
        try {
            const results = await executeQuery(
                'SELECT * FROM users WHERE email = ? AND is_active = TRUE',
                [email]
            );
            return results.length > 0 ? new User(results[0]) : null;
        } catch (error) {
            throw new Error('Error al buscar usuario: ' + error.message);
        }
    }
    
    // Buscar usuario por username
    static async findByUsername(username) {
        try {
            const results = await executeQuery(
                'SELECT * FROM users WHERE username = ? AND is_active = TRUE',
                [username]
            );
            return results.length > 0 ? new User(results[0]) : null;
        } catch (error) {
            throw new Error('Error al buscar usuario: ' + error.message);
        }
    }
    
    // Buscar usuario por email o username
    static async findByEmailOrUsername(email, username) {
        try {
            const results = await executeQuery(
                'SELECT * FROM users WHERE (email = ? OR username = ?) AND is_active = TRUE',
                [email, username]
            );
            return results.length > 0 ? new User(results[0]) : null;
        } catch (error) {
            throw new Error('Error al buscar usuario: ' + error.message);
        }
    }
    
    // Verificar contraseña
    async verifyPassword(password) {
        try {
            return await bcrypt.compare(password, this.password_hash);
        } catch (error) {
            throw new Error('Error al verificar contraseña: ' + error.message);
        }
    }
    
    // Actualizar último login
    async updateLastLogin() {
        try {
            await executeQuery(
                'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
                [this.id]
            );
            this.last_login = new Date();
        } catch (error) {
            throw new Error('Error al actualizar último login: ' + error.message);
        }
    }
    
    // Actualizar estadísticas del usuario
    async updateStats(score, levelCompleted = false) {
        try {
            console.log(`🔄 Actualizando estadísticas para usuario ID ${this.id}:`);
            console.log(`   Score anterior: ${this.total_score}, Nuevo score: ${score}, Total: ${this.total_score + score}`);
            console.log(`   Games anterior: ${this.games_played}, Nuevo: ${this.games_played + 1}`);
            console.log(`   Levels anterior: ${this.levels_completed}, Level completado: ${levelCompleted}`);
            
            const updates = {
                total_score: (this.total_score || 0) + score,
                games_played: (this.games_played || 0) + 1,
                levels_completed: (this.levels_completed || 0) + (levelCompleted ? 1 : 0)
            };
            
            await executeQuery(
                `UPDATE users SET 
                 total_score = ?, 
                 games_played = ?, 
                 levels_completed = ?,
                 updated_at = CURRENT_TIMESTAMP 
                 WHERE id = ?`,
                [updates.total_score, updates.games_played, updates.levels_completed, this.id]
            );
            
            console.log(`✅ Estadísticas actualizadas en DB para usuario ID ${this.id}`);
            
            // Actualizar propiedades locales
            this.total_score = updates.total_score;
            this.games_played = updates.games_played;
            this.levels_completed = updates.levels_completed;
            
            console.log(`   Nuevos valores locales: Score: ${this.total_score}, Games: ${this.games_played}, Levels: ${this.levels_completed}`);
            
            return this;
        } catch (error) {
            console.error(`❌ Error actualizando estadísticas para usuario ID ${this.id}:`, error);
            throw new Error('Error al actualizar estadísticas: ' + error.message);
        }
    }
    
    // Método estático para actualizar estadísticas de usuario
    static async updateUserStats(userId, score, levelCompleted = false) {
        try {
            console.log(`🔄 Actualizando estadísticas para usuario ID ${userId}:`);
            
            // Obtener datos actuales del usuario
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            
            console.log(`   Score anterior: ${user.total_score}, Nuevo score: ${score}, Total: ${(user.total_score || 0) + score}`);
            console.log(`   Games anterior: ${user.games_played}, Nuevo: ${(user.games_played || 0) + 1}`);
            console.log(`   Levels anterior: ${user.levels_completed}, Level completado: ${levelCompleted}`);
            
            const updates = {
                total_score: (user.total_score || 0) + score,
                games_played: (user.games_played || 0) + 1,
                levels_completed: (user.levels_completed || 0) + (levelCompleted ? 1 : 0)
            };
            
            await executeQuery(
                `UPDATE users SET 
                 total_score = ?, 
                 games_played = ?, 
                 levels_completed = ?,
                 updated_at = CURRENT_TIMESTAMP 
                 WHERE id = ?`,
                [updates.total_score, updates.games_played, updates.levels_completed, userId]
            );
            
            console.log(`✅ Estadísticas actualizadas en DB para usuario ID ${userId}`);
            console.log(`   Nuevos valores: Score: ${updates.total_score}, Games: ${updates.games_played}, Levels: ${updates.levels_completed}`);
            
            return updates;
        } catch (error) {
            console.error(`❌ Error actualizando estadísticas para usuario ID ${userId}:`, error);
            throw new Error('Error al actualizar estadísticas: ' + error.message);
        }
    }
    
    // Obtener puntuaciones del usuario
    async getScores(limit = 10) {
        try {
            return await executeQuery(
                `SELECT * FROM game_scores 
                 WHERE user_id = ? 
                 ORDER BY completed_at DESC 
                 LIMIT ?`,
                [this.id, limit]
            );
        } catch (error) {
            throw new Error('Error al obtener puntuaciones: ' + error.message);
        }
    }
    
    // Obtener logros del usuario
    async getAchievements() {
        try {
            return await executeQuery(
                `SELECT * FROM user_achievements 
                 WHERE user_id = ? 
                 ORDER BY earned_at DESC`,
                [this.id]
            );
        } catch (error) {
            throw new Error('Error al obtener logros: ' + error.message);
        }
    }
    
    // Obtener ranking del usuario
    async getRanking() {
        try {
            const results = await executeQuery(
                `SELECT COUNT(*) + 1 as ranking 
                 FROM users 
                 WHERE total_score > ? AND is_active = TRUE`,
                [this.total_score]
            );
            return results[0].ranking;
        } catch (error) {
            throw new Error('Error al obtener ranking: ' + error.message);
        }
    }
    
    // Convertir a JSON seguro (sin contraseña)
    toJSON() {
        const { password_hash, ...userWithoutPassword } = this;
        return userWithoutPassword;
    }
    
    // Obtener top usuarios
    static async getTopUsers(limit = 10) {
        try {
            const results = await executeQuery(
                `SELECT id, username, full_name, total_score, games_played, levels_completed, created_at
                 FROM users 
                 WHERE is_active = TRUE 
                 ORDER BY total_score DESC, levels_completed DESC, games_played ASC
                 LIMIT ?`,
                [limit]
            );
            return results;
        } catch (error) {
            throw new Error('Error al obtener top usuarios: ' + error.message);
        }
    }
}

module.exports = User;