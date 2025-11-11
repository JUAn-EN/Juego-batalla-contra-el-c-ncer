// ============================================
// SISTEMA DE PROGRESIÓN DE NIVELES EN TIEMPO REAL
// ============================================

class LevelProgressionManager {
    constructor() {
        this.levels = [
            { id: 'mama', name: 'Cáncer de Mama', order: 1, requiredScore: 0 },
            { id: 'prostate', name: 'Cáncer de Próstata', order: 2, requiredScore: 1000 },
            { id: 'cervical', name: 'Cáncer Cervical', order: 3, requiredScore: 2000 },
            { id: 'colon', name: 'Cáncer de Colon', order: 4, requiredScore: 3000 }
        ];
        this.userScores = {};
        this.init();
    }

    init() {
        console.log('🎮 Inicializando sistema de progresión de niveles...');
        
        // Escuchar eventos de autenticación
        window.addEventListener('user-logged-in', () => {
            console.log('👤 Usuario logueado - Actualizando niveles');
            this.updateLevelAccess();
        });

        window.addEventListener('user-logged-out', () => {
            console.log('👤 Usuario deslogueado - Bloqueando niveles');
            this.blockAllLevels();
        });

        // Escuchar completación de niveles
        window.addEventListener('level-completed', (event) => {
            console.log('🎉 Nivel completado:', event.detail);
            setTimeout(() => this.updateLevelAccess(), 1000);
        });

        // Inicializar después de un pequeño delay
        setTimeout(() => this.updateLevelAccess(), 500);
        
        // Verificar periódicamente para mantener sincronizado
        setInterval(() => this.updateLevelAccess(), 30000); // Cada 30 segundos

        // Función de emergencia accesible desde consola
        window.debugUnlockAllLevels = () => {
            console.log('🚨 FUNCIÓN DE EMERGENCIA: Desbloqueando todos los niveles');
            this.unlockAllLevels();
        };
    }

    async updateLevelAccess() {
        console.log('🔄 Actualizando acceso a niveles...');
        
        if (!window.authClient || !window.authClient.isAuthenticated()) {
            console.log('❌ Usuario no autenticado - Bloqueando todos los niveles');
            this.blockAllLevelsExceptFirst();
            return;
        }

        try {
            // Obtener puntuaciones del usuario
            const data = await window.authClient.getUserScores(null, 100);
            this.userScores = {};

            if (data.scores && data.scores.length > 0) {
                // Organizar puntuaciones por nivel
                data.scores.forEach(score => {
                    const levelId = score.level_type;
                    if (!this.userScores[levelId] || score.score > this.userScores[levelId]) {
                        this.userScores[levelId] = score.score;
                    }
                });
                
                console.log('📊 Puntuaciones del usuario:', this.userScores);
                
                // Si el usuario ya tiene puntuaciones, probablemente ya jugó antes
                // Desbloquear niveles basado en las puntuaciones existentes
                const hasAnyScores = Object.keys(this.userScores).length > 0;
                if (hasAnyScores) {
                    console.log('🎮 Usuario con puntuaciones existentes - Aplicando progresión');
                }
            } else {
                console.log('🆕 Usuario nuevo - Solo nivel 1 disponible');
            }

            this.applyLevelAccess();
            
        } catch (error) {
            console.error('❌ Error obteniendo puntuaciones:', error);
            // En caso de error, al menos desbloquear el primer nivel
            this.applyLevelAccess();
        }
    }

    applyLevelAccess() {
        console.log('🎯 Aplicando acceso a niveles...');
        console.log('📊 DEBUG - Puntuaciones actuales:', this.userScores);
        
        this.levels.forEach(level => {
            const card = document.getElementById(`${level.id}-level-card`);
            if (!card) {
                console.log(`❌ No se encontró la tarjeta: ${level.id}-level-card`);
                return;
            }

            const isUnlocked = this.isLevelUnlocked(level.id);
            console.log(`🔍 Nivel ${level.name} (${level.id}): ${isUnlocked ? 'DESBLOQUEADO' : 'BLOQUEADO'}`);
            
            if (isUnlocked) {
                this.unlockLevel(card, level);
            } else {
                this.lockLevel(card, level);
            }
        });
    }

    isLevelUnlocked(levelId) {
        const level = this.levels.find(l => l.id === levelId);
        if (!level) return false;

        // El primer nivel siempre está desbloqueado para usuarios autenticados
        if (level.order === 1) return true;

        // Si el usuario tiene puntuación en este nivel, está desbloqueado
        if (this.userScores[levelId] && this.userScores[levelId] > 0) {
            return true;
        }

        // Para otros niveles, verificar que el nivel anterior esté completado
        const previousLevel = this.levels.find(l => l.order === level.order - 1);
        if (!previousLevel) return false;

        const previousScore = this.userScores[previousLevel.id] || 0;
        return previousScore > 0; // Cualquier puntuación > 0 cuenta como completado
    }

    unlockLevel(card, level) {
        console.log(`🔓 Desbloqueando nivel: ${level.name}`);
        
        // Remover clase locked
        card.classList.remove('locked');
        card.classList.add('unlocked');
        
        // Actualizar badge de estado
        const statusElement = card.querySelector('.locked-status, .status');
        if (statusElement) {
            statusElement.className = 'status available';
            statusElement.textContent = '✓ Disponible';
        }

        // Remover mensaje de requisito
        const requirementElement = card.querySelector('.unlock-requirement');
        if (requirementElement) {
            requirementElement.style.display = 'none';
        }

        // Habilitar interacción
        card.style.cursor = 'pointer';
        card.style.opacity = '1';
        card.style.pointerEvents = 'auto';

        // Remover overlay de bloqueo si existe
        const lockOverlay = card.querySelector('.lock-overlay');
        if (lockOverlay) {
            lockOverlay.style.display = 'none';
        }

        // Asegurar que el evento de clic funcione
        this.enableCardClick(card, level.id);
    }

    lockLevel(card, level) {
        console.log(`🔒 Bloqueando nivel: ${level.name}`);
        
        // Agregar clase locked
        card.classList.add('locked');
        card.classList.remove('unlocked');
        
        // Actualizar badge de estado
        const statusElement = card.querySelector('.locked-status, .status');
        if (statusElement) {
            statusElement.className = 'status locked';
            statusElement.textContent = '🔒 Bloqueado';
        }

        // Mostrar mensaje de requisito
        let requirementElement = card.querySelector('.unlock-requirement');
        if (!requirementElement) {
            requirementElement = document.createElement('div');
            requirementElement.className = 'unlock-requirement';
            card.appendChild(requirementElement);
        }
        
        const previousLevel = this.levels.find(l => l.order === level.order - 1);
        if (previousLevel) {
            requirementElement.innerHTML = `
                <p><i class="fas fa-lock"></i> Completa "${previousLevel.name}" para desbloquear</p>
            `;
        }
        requirementElement.style.display = 'block';

        // Deshabilitar interacción
        card.style.cursor = 'not-allowed';
        card.style.opacity = '0.6';

        // Deshabilitar clic
        card.style.pointerEvents = 'none';

        // Mostrar overlay de bloqueo
        const lockOverlay = card.querySelector('.lock-overlay');
        if (lockOverlay) {
            lockOverlay.style.display = 'flex';
        }
    }

    enableCardClick(card, levelId) {
        // Solo habilitar el pointer events, MenuManager se encarga del clic
        card.style.pointerEvents = 'auto';
        console.log(`✅ Tarjeta ${levelId} habilitada para clic`);
    }

    blockAllLevelsExceptFirst() {
        console.log('🔒 Bloqueando todos los niveles excepto el primero');
        
        this.levels.forEach(level => {
            const card = document.getElementById(`${level.id}-level-card`);
            if (!card) return;

            if (level.order === 1) {
                // Mantener el primer nivel desbloqueado pero requerirá login
                card.classList.remove('locked');
                const statusElement = card.querySelector('.locked-status, .status');
                if (statusElement) {
                    statusElement.className = 'status available';
                    statusElement.textContent = '▶️ Jugar';
                }
            } else {
                this.lockLevel(card, level);
            }
        });
    }

    blockAllLevels() {
        console.log('🔒 Bloqueando TODOS los niveles');
        
        this.levels.forEach(level => {
            const card = document.getElementById(`${level.id}-level-card`);
            if (!card) return;
            
            this.lockLevel(card, level);
        });
    }

    showLockedMessage(level, previousLevel) {
        const modal = document.createElement('div');
        modal.className = 'custom-modal-overlay';
        modal.innerHTML = `
            <div class="custom-modal">
                <div class="modal-icon warning">🔒</div>
                <h3 class="modal-title">Nivel Bloqueado</h3>
                <p class="modal-message">
                    Para desbloquear el <strong>${level.name}</strong>, 
                    primero debes completar el <strong>${previousLevel.name}</strong>.
                </p>
                <div class="level-progress" style="margin: 1.5rem 0;">
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 10px; border-left: 4px solid #48cae4;">
                        <p style="margin: 0; font-size: 0.9rem;">
                            💡 <strong>Progreso:</strong> Completa los niveles en orden para desbloquear nuevos desafíos.
                        </p>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="modal-btn modal-btn-primary" onclick="this.closest('.custom-modal-overlay').remove(); window.menuManager.startLevel('${previousLevel.id}');">
                        <i class="fas fa-play"></i>
                        Jugar ${previousLevel.name}
                    </button>
                    <button class="modal-btn modal-btn-secondary" onclick="this.closest('.custom-modal-overlay').remove();">
                        <i class="fas fa-times"></i>
                        Cerrar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto cerrar después de 8 segundos
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
            }
        }, 8000);
    }

    // Método para forzar actualización cuando se completa un nivel
    onLevelCompleted(levelId, score) {
        console.log(`🎯 Nivel completado callback: ${levelId} con ${score} puntos`);
        this.userScores[levelId] = Math.max(this.userScores[levelId] || 0, score);
        
        // Actualizar inmediatamente
        setTimeout(() => this.applyLevelAccess(), 500);
        
        // Mostrar felicitaciones si es el último nivel
        if (levelId === 'colon') {
            setTimeout(() => this.showGameCompletionCelebration(), 2000);
        }
    }

    showGameCompletionCelebration() {
        const modal = document.createElement('div');
        modal.className = 'custom-modal-overlay celebration-modal';
        modal.innerHTML = `
            <div class="custom-modal celebration">
                <div class="celebration-header">
                    <div class="celebration-icon">🎉</div>
                    <h2>¡FELICITACIONES!</h2>
                    <div class="celebration-fireworks">✨🎆✨</div>
                </div>
                
                <div class="celebration-content">
                    <h3>🏆 ¡Has completado todos los niveles! 🏆</h3>
                    <p>Has demostrado un excelente conocimiento sobre la prevención del cáncer.</p>
                    
                    <div class="achievement-summary">
                        <h4>📊 Tu progreso:</h4>
                        <div class="achievement-grid">
                            <div class="achievement-item">
                                <div class="achievement-icon">🎗️</div>
                                <div class="achievement-text">
                                    <strong>Cáncer de Mama</strong>
                                    <span>Completado ✓</span>
                                </div>
                            </div>
                            <div class="achievement-item">
                                <div class="achievement-icon">🔵</div>
                                <div class="achievement-text">
                                    <strong>Cáncer de Próstata</strong>
                                    <span>Completado ✓</span>
                                </div>
                            </div>
                            <div class="achievement-item">
                                <div class="achievement-icon">💜</div>
                                <div class="achievement-text">
                                    <strong>Cáncer Cervical</strong>
                                    <span>Completado ✓</span>
                                </div>
                            </div>
                            <div class="achievement-item">
                                <div class="achievement-icon">🟤</div>
                                <div class="achievement-text">
                                    <strong>Cáncer de Colon</strong>
                                    <span>Completado ✓</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="final-message">
                        <p>🌟 <strong>¡Eres un Experto en Prevención del Cáncer!</strong> 🌟</p>
                        <p>Comparte este conocimiento con otros y ayuda a salvar vidas.</p>
                    </div>
                </div>

                <div class="modal-actions">
                    <button class="modal-btn modal-btn-primary" onclick="this.closest('.custom-modal-overlay').remove(); window.location.href='leaderboard.html';">
                        <i class="fas fa-trophy"></i>
                        Ver Leaderboard
                    </button>
                    <button class="modal-btn modal-btn-secondary" onclick="this.closest('.custom-modal-overlay').remove();">
                        <i class="fas fa-home"></i>
                        Volver al Menú
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Función de emergencia para desbloquear todos los niveles
    unlockAllLevels() {
        console.log('🚨 Desbloqueando todos los niveles manualmente...');
        this.levels.forEach(level => {
            const card = document.getElementById(`${level.id}-level-card`);
            if (card) {
                this.unlockLevel(card, level);
            }
        });
        
        // Simular que el usuario tiene puntuaciones en todos los niveles
        this.userScores = {
            'mama': 1500,
            'prostate': 1200,
            'cervical': 1800,
            'colon': 2000
        };
        
        console.log('✅ Todos los niveles desbloqueados');
    }
}

// Inicializar el sistema cuando la página cargue
document.addEventListener('DOMContentLoaded', () => {
    window.levelProgressionManager = new LevelProgressionManager();
});

// También inicializar si el DOM ya está listo
if (document.readyState !== 'loading') {
    window.levelProgressionManager = new LevelProgressionManager();
}