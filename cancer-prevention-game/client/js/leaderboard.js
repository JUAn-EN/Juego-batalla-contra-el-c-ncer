// ============================================
// MANAGER DE TABLA DE HÉROES (LEADERBOARD)
// ============================================

class LeaderboardManager {
    constructor() {
        this.authClient = window.authClient;
        this.currentData = null;
        this.updateInterval = null;
        this.currentFilter = null;
        
        this.init();
    }
    
    init() {
        // Cargar datos iniciales
        this.loadLeaderboard();
        
        // Actualizar cada 30 segundos
        this.updateInterval = setInterval(() => {
            this.loadLeaderboard(this.currentFilter);
        }, 30000);
        
        console.log('📊 LeaderboardManager inicializado');
    }
    
    async loadLeaderboard(levelType = null) {
        try {
            // Guardar el filtro actual
            this.currentFilter = levelType;
            
            // Obtener datos del ranking
            const data = await this.authClient.getLeaderboard(levelType, 10);
            this.currentData = data;
            
            // Actualizar la tabla en la interfaz
            this.updateLeaderboardTable(data.leaderboard);
            
        } catch (error) {
            console.error('Error cargando leaderboard:', error);
            this.showDefaultLeaderboard();
        }
    }
    
    updateLeaderboardTable(scores) {
        const tableContainer = document.querySelector('.leaderboard-table, .heroes-table, #heroes-table');
        
        if (!tableContainer) {
            console.warn('No se encontró contenedor de tabla de héroes');
            return;
        }
        
        // Limpiar contenido anterior
        tableContainer.innerHTML = '';
        
        // Crear header
        const header = document.createElement('div');
        header.className = 'leaderboard-header';
        header.innerHTML = `
            <h2>🏆 Tabla de Héroes</h2>
            <p>Los mejores defensores de la salud</p>
        `;
        tableContainer.appendChild(header);
        
        // Crear lista de héroes
        const herosList = document.createElement('div');
        herosList.className = 'heroes-list';
        
        if (!scores || scores.length === 0) {
            herosList.innerHTML = `
                <div class="no-heroes">
                    <i class="fas fa-users"></i>
                    <p>¡Sé el primer héroe en unirse a la causa!</p>
                </div>
            `;
        } else {
            scores.forEach((score, index) => {
                const heroCard = this.createHeroCard(score, index + 1);
                herosList.appendChild(heroCard);
            });
        }
        
        tableContainer.appendChild(herosList);
        
        // Agregar estadísticas si el usuario está autenticado
        if (this.authClient.isAuthenticated() && this.currentData.userRanking) {
            this.addUserRankingInfo();
        }
        
        // Aplicar estilos
        this.addLeaderboardStyles();
    }
    
    createHeroCard(score, position) {
        const card = document.createElement('div');
        card.className = `hero-card position-${position}`;
        
        // Determinar clase de posición y medalla
        let positionClass = '';
        let medal = '';
        let badge = '';
        
        if (position === 1) {
            positionClass = 'first-place';
            medal = '🥇';
            badge = 'Maestro de la Salud';
        } else if (position === 2) {
            positionClass = 'second-place';
            medal = '🥈';
            badge = 'Guardian Vital';
        } else if (position === 3) {
            positionClass = 'third-place';
            medal = '🥉';
            badge = 'Héroe Salud';
        } else {
            badge = this.generateBadge(score.total_score);
        }
        
        card.classList.add(positionClass);
        
        // Calcular nivel basado en puntuación
        const level = Math.floor(score.total_score / 200) + 1;
        
        card.innerHTML = `
            <div class="hero-position">
                ${medal || position}
            </div>
            <div class="hero-info">
                <div class="hero-avatar">
                    <i class="fas fa-user-md"></i>
                </div>
                <div class="hero-details">
                    <h3 class="hero-name">Dr. ${score.username || 'Anónimo'}</h3>
                    <p class="hero-badge">${badge}</p>
                </div>
            </div>
            <div class="hero-stats">
                <div class="score">${score.total_score.toLocaleString()} pts</div>
                <div class="level">Nivel ${level}</div>
                <div class="games">🎮 ${score.games_played || 0} partidas</div>
            </div>
        `;
        
        // Destacar al usuario actual
        const currentUser = this.authClient.getUser();
        if (currentUser && score.username === currentUser.username) {
            card.classList.add('current-user');
        }
        
        return card;
    }
    
    generateBadge(score) {
        if (score >= 2000) return 'Legendario';
        if (score >= 1500) return 'Experto';
        if (score >= 1000) return 'Protector';
        if (score >= 500) return 'Defensor Vida';
        if (score >= 200) return 'Explorador';
        return 'Aprendiz';
    }
    
    addUserRankingInfo() {
        const tableContainer = document.querySelector('.leaderboard-table, .heroes-table, #heroes-table');
        const userRanking = this.currentData.userRanking;
        
        if (!tableContainer || !userRanking) return;
        
        const userInfo = document.createElement('div');
        userInfo.className = 'user-ranking-info';
        userInfo.innerHTML = `
            <div class="user-position-card">
                <div class="user-rank">
                    <span class="rank-number">#${userRanking}</span>
                    <span class="rank-label">Tu posición</span>
                </div>
                <div class="user-motivation">
                    ${this.getMotivationMessage(userRanking)}
                </div>
            </div>
        `;
        
        tableContainer.appendChild(userInfo);
    }
    
    getMotivationMessage(ranking) {
        if (ranking === 1) return '🎉 ¡Eres el héroe número 1!';
        if (ranking <= 3) return '🔥 ¡Estás en el podio!';
        if (ranking <= 10) return '⭐ ¡Estás en el top 10!';
        if (ranking <= 50) return '🚀 ¡Sigue escalando posiciones!';
        return '💪 ¡Cada punto cuenta en tu misión!';
    }
    
    showDefaultLeaderboard() {
        // Mostrar tabla predeterminada si falla la carga
        const tableContainer = document.querySelector('.leaderboard-table, .heroes-table, #heroes-table');
        
        if (!tableContainer) return;
        
        const defaultHeroes = [
            { username: 'Prevención', total_score: 2500, games_played: 15 },
            { username: 'Vital', total_score: 2100, games_played: 12 },
            { username: 'Salud', total_score: 1850, games_played: 10 }
        ];
        
        this.updateLeaderboardTable(defaultHeroes);
    }
    
    addLeaderboardStyles() {
        if (document.getElementById('leaderboard-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'leaderboard-styles';
        styles.textContent = `
            .leaderboard-header {
                text-align: center;
                margin-bottom: 30px;
                padding: 20px;
            }
            
            .leaderboard-header h2 {
                margin: 0 0 10px 0;
                font-size: 2rem;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .leaderboard-header p {
                color: #666;
                margin: 0;
                font-style: italic;
            }
            
            .heroes-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
                max-width: 800px;
                margin: 0 auto;
            }
            
            .hero-card {
                display: flex;
                align-items: center;
                padding: 20px;
                border-radius: 15px;
                background: white;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
                transition: all 0.3s ease;
                border-left: 5px solid #ddd;
            }
            
            .hero-card:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }
            
            .hero-card.first-place {
                background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
                border-left-color: #f39c12;
                color: #2c3e50;
            }
            
            .hero-card.second-place {
                background: linear-gradient(135deg, #c0c0c0 0%, #e8e8e8 100%);
                border-left-color: #95a5a6;
                color: #2c3e50;
            }
            
            .hero-card.third-place {
                background: linear-gradient(135deg, #cd7f32 0%, #deb887 100%);
                border-left-color: #d68910;
                color: #2c3e50;
            }
            
            .hero-card.current-user {
                border: 3px solid #3498db;
                background: linear-gradient(135deg, #ebf8ff 0%, #dbeafe 100%);
            }
            
            .hero-position {
                font-size: 2rem;
                font-weight: bold;
                min-width: 60px;
                text-align: center;
                margin-right: 20px;
            }
            
            .hero-info {
                display: flex;
                align-items: center;
                flex: 1;
                gap: 15px;
            }
            
            .hero-avatar {
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.5rem;
            }
            
            .hero-details h3 {
                margin: 0 0 5px 0;
                font-size: 1.2rem;
                color: #2c3e50;
            }
            
            .hero-badge {
                margin: 0;
                font-size: 0.9rem;
                color: #7f8c8d;
                font-style: italic;
            }
            
            .hero-stats {
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 5px;
                text-align: right;
            }
            
            .hero-stats .score {
                font-size: 1.4rem;
                font-weight: bold;
                color: #27ae60;
            }
            
            .hero-stats .level {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 2px 8px;
                border-radius: 10px;
                font-size: 0.8rem;
                font-weight: 600;
            }
            
            .hero-stats .games {
                font-size: 0.8rem;
                color: #7f8c8d;
            }
            
            .no-heroes {
                text-align: center;
                padding: 60px 20px;
                color: #7f8c8d;
            }
            
            .no-heroes i {
                font-size: 3rem;
                margin-bottom: 15px;
                display: block;
            }
            
            .user-ranking-info {
                margin-top: 30px;
                text-align: center;
            }
            
            .user-position-card {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 15px;
                max-width: 400px;
                margin: 0 auto;
            }
            
            .user-rank {
                margin-bottom: 10px;
            }
            
            .rank-number {
                font-size: 2rem;
                font-weight: bold;
                display: block;
            }
            
            .rank-label {
                font-size: 0.9rem;
                opacity: 0.8;
            }
            
            .user-motivation {
                font-size: 1.1rem;
                font-weight: 500;
            }
            
            @media (max-width: 768px) {
                .hero-card {
                    flex-direction: column;
                    text-align: center;
                    gap: 15px;
                }
                
                .hero-position {
                    margin-right: 0;
                    margin-bottom: 10px;
                }
                
                .hero-info {
                    flex-direction: column;
                    gap: 10px;
                }
                
                .hero-stats {
                    align-items: center;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Esperar a que authClient esté disponible
    const initLeaderboard = () => {
        if (window.authClient) {
            window.leaderboardManager = new LeaderboardManager();
            console.log('📊 Tabla de Héroes inicializada');
        } else {
            setTimeout(initLeaderboard, 100);
        }
    };
    
    initLeaderboard();
});