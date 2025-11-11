// ============================================
// MODELO DE PUNTUACIONES
// ============================================

const { executeQuery } = require('../config/database');

class GameScore {
    constructor(scoreData) {
        this.id = scoreData.id;
        this.user_id = scoreData.user_id;
        this.level_type = scoreData.level_type;
        this.score = scoreData.score;
        this.time_taken = scoreData.time_taken;
        this.anomalies_found = scoreData.anomalies_found;
        this.total_anomalies = scoreData.total_anomalies;
        this.accuracy_percentage = scoreData.accuracy_percentage;
        this.completed_at = scoreData.completed_at;
    }
    
    // Crear nueva puntuación
    static async create(scoreData) {
        try {
            const {
                user_id,
                level_type,
                score,
                time_taken,
                anomalies_found,
                total_anomalies
            } = scoreData;
            
            // Calcular precisión
            const accuracy_percentage = total_anomalies > 0 
                ? ((anomalies_found / total_anomalies) * 100).toFixed(2)
                : 0;
            
            const result = await executeQuery(
                `INSERT INTO game_scores 
                 (user_id, level_type, score, time_taken, anomalies_found, total_anomalies, accuracy_percentage) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [user_id, level_type, score, time_taken, anomalies_found, total_anomalies, accuracy_percentage]
            );
            
            // Obtener la puntuación creada
            const newScore = await this.findById(result.insertId);
            return new GameScore(newScore);
        } catch (error) {
            throw new Error('Error al crear puntuación: ' + error.message);
        }
    }
    
    // Buscar puntuación por ID
    static async findById(id) {
        try {
            const results = await executeQuery(
                'SELECT * FROM game_scores WHERE id = ?',
                [id]
            );
            return results.length > 0 ? results[0] : null;
        } catch (error) {
            throw new Error('Error al buscar puntuación: ' + error.message);
        }
    }
    
    // Obtener puntuaciones por usuario
    static async getByUser(user_id, limit = 20) {
        try {
            const limitNum = parseInt(limit) || 20;
            return await executeQuery(
                `SELECT gs.*, u.username, u.full_name
                 FROM game_scores gs
                 JOIN users u ON gs.user_id = u.id
                 WHERE gs.user_id = ?
                 ORDER BY gs.completed_at DESC
                 LIMIT ${limitNum}`,
                [user_id]
            );
        } catch (error) {
            console.error('❌ Error en query:', error.message);
            throw new Error('Error al obtener puntuaciones del usuario: ' + error.message);
        }
    }
    
    // Obtener puntuaciones por nivel
    static async getByLevel(level_type, limit = 100) {
        try {
            const limitNum = parseInt(limit) || 100;
            return await executeQuery(
                `SELECT gs.*, u.username, u.full_name
                 FROM game_scores gs
                 JOIN users u ON gs.user_id = u.id
                 WHERE gs.level_type = ?
                 ORDER BY gs.score DESC, gs.time_taken ASC
                 LIMIT ${limitNum}`,
                [level_type]
            );
        } catch (error) {
            throw new Error('Error al obtener puntuaciones del nivel: ' + error.message);
        }
    }
    
    // Obtener top puntuaciones globales
    static async getTopScores(limit = 50) {
        try {
            const limitNum = parseInt(limit) || 50;
            return await executeQuery(
                `SELECT gs.*, u.username, u.full_name
                 FROM game_scores gs
                 JOIN users u ON gs.user_id = u.id
                 ORDER BY gs.score DESC, gs.accuracy_percentage DESC, gs.time_taken ASC
                 LIMIT ${limitNum}`,
                []
            );
        } catch (error) {
            throw new Error('Error al obtener top puntuaciones: ' + error.message);
        }
    }
    
    // Obtener leaderboard global por total de puntos de usuario
    static async getGlobalLeaderboard(limit = 50) {
        try {
            return await executeQuery(
                `SELECT 
                    u.id,
                    u.username,
                    u.full_name,
                    u.total_score,
                    u.games_played,
                    u.levels_completed,
                    u.created_at
                 FROM users u
                 ORDER BY u.total_score DESC, u.created_at ASC
                 LIMIT 50`
            );
        } catch (error) {
            console.error('Error detallado en leaderboard:', error);
            // En caso de error, devolver datos básicos de la tabla users
            return await executeQuery('SELECT id, username, full_name, total_score FROM users ORDER BY total_score DESC LIMIT 10');
        }
    }
    
    // Obtener mejor puntuación del usuario en un nivel
    static async getBestUserScore(user_id, level_type) {
        try {
            const results = await executeQuery(
                `SELECT * FROM game_scores 
                 WHERE user_id = ? AND level_type = ?
                 ORDER BY score DESC, accuracy_percentage DESC, time_taken ASC
                 LIMIT 1`,
                [user_id, level_type]
            );
            return results.length > 0 ? new GameScore(results[0]) : null;
        } catch (error) {
            throw new Error('Error al obtener mejor puntuación: ' + error.message);
        }
    }
    
    // Obtener estadísticas del usuario
    static async getUserStats(user_id) {
        try {
            const results = await executeQuery(
                `SELECT 
                    level_type,
                    COUNT(*) as games_played,
                    MAX(score) as best_score,
                    AVG(score) as avg_score,
                    AVG(accuracy_percentage) as avg_accuracy,
                    MIN(time_taken) as best_time,
                    AVG(time_taken) as avg_time
                 FROM game_scores 
                 WHERE user_id = ?
                 GROUP BY level_type`,
                [user_id]
            );
            return results;
        } catch (error) {
            throw new Error('Error al obtener estadísticas del usuario: ' + error.message);
        }
    }
    
    // Obtener estadísticas generales
    static async getGeneralStats() {
        try {
            const results = await executeQuery(`
                SELECT 
                    COUNT(DISTINCT user_id) as total_players,
                    COUNT(*) as total_games,
                    AVG(score) as avg_score,
                    MAX(score) as highest_score,
                    AVG(accuracy_percentage) as avg_accuracy,
                    AVG(time_taken) as avg_time
                FROM game_scores
            `);
            return results[0];
        } catch (error) {
            throw new Error('Error al obtener estadísticas generales: ' + error.message);
        }
    }
    
    // Obtener ranking del usuario en un nivel específico
    static async getUserRankingInLevel(user_id, level_type) {
        try {
            const results = await executeQuery(
                `SELECT COUNT(*) + 1 as ranking 
                 FROM (
                     SELECT user_id, MAX(score) as best_score
                     FROM game_scores 
                     WHERE level_type = ?
                     GROUP BY user_id
                 ) user_scores
                 WHERE user_scores.best_score > (
                     SELECT MAX(score) 
                     FROM game_scores 
                     WHERE user_id = ? AND level_type = ?
                 )`,
                [level_type, user_id, level_type]
            );
            return results[0].ranking;
        } catch (error) {
            throw new Error('Error al obtener ranking en nivel: ' + error.message);
        }
    }
    
    // Obtener actividad reciente
    static async getRecentActivity(limit = 20) {
        try {
            return await executeQuery(
                `SELECT gs.*, u.username, u.full_name
                 FROM game_scores gs
                 JOIN users u ON gs.user_id = u.id
                 ORDER BY gs.completed_at DESC
                 LIMIT ?`,
                [limit]
            );
        } catch (error) {
            throw new Error('Error al obtener actividad reciente: ' + error.message);
        }
    }
}

module.exports = GameScore;