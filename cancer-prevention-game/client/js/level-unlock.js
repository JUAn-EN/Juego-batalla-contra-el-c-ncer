// ============================================
// SISTEMA DE DESBLOQUEO DE NIVELES
// ============================================

class LevelUnlockSystem {
    constructor() {
        this.prostateCard = null;
        this.init();
    }
    
    init() {
        console.log('🔓 Inicializando sistema de desbloqueo de niveles...');
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.prostateCard = document.getElementById('prostate-level-card');
        
        if (!this.prostateCard) {
            console.log('⚠️ Tarjeta de próstata no encontrada en esta página');
            return;
        }
        
        // Verificar si se acaba de completar el nivel de mama
        const justCompleted = sessionStorage.getItem('breastLevelCompleted');
        if (justCompleted === 'true') {
            console.log('🎉 Nivel de mama recién completado, verificando desbloqueo inmediatamente...');
            sessionStorage.removeItem('breastLevelCompleted');
            // Verificar múltiples veces para asegurar que se detecte
            setTimeout(() => this.checkLevelUnlock(), 100);
            setTimeout(() => this.checkLevelUnlock(), 500);
            setTimeout(() => this.checkLevelUnlock(), 1000);
            setTimeout(() => this.checkLevelUnlock(), 2000);
        } else {
            // Verificar desbloqueo después de un pequeño delay para asegurar autenticación
            setTimeout(() => this.checkLevelUnlock(), 1000);
            setTimeout(() => this.checkLevelUnlock(), 3000);
        }
        
        // Escuchar evento de login
        window.addEventListener('user-logged-in', () => {
            setTimeout(() => this.checkLevelUnlock(), 1000);
        });
        
        // Escuchar evento de nivel completado
        window.addEventListener('level-completed', (e) => {
            console.log('🎉 Nivel completado detectado:', e.detail);
            if (e.detail && e.detail.levelType === 'mama') {
                console.log('✅ Nivel de mama completado, verificando desbloqueo...');
                setTimeout(() => this.checkLevelUnlock(), 500);
            }
        });
        
        // Interceptar clics en tarjeta bloqueada
        this.prostateCard.addEventListener('click', (e) => {
            if (this.prostateCard.classList.contains('locked')) {
                e.stopPropagation();
                e.preventDefault();
                this.showLockedMessage();
            }
        });
    }
    
    async checkLevelUnlock() {
        console.log('🔍 Verificando desbloqueo de nivel de próstata...');
        
        // Verificar autenticación
        if (!window.authClient || !window.authClient.isAuthenticated()) {
            console.log('❌ Usuario no autenticado');
            return;
        }
        
        try {
            // Obtener puntuaciones del usuario usando el método de authClient
            console.log('📡 Obteniendo puntuaciones del usuario...');
            const data = await window.authClient.getUserScores(null, 100);
            
            console.log('📊 Puntuaciones del usuario:', data);
            console.log('📊 Total de puntuaciones:', data.scores ? data.scores.length : 0);
            
            if (data.scores && data.scores.length > 0) {
                // Verificar si ha completado el nivel de mama con buena puntuación
                const breastLevels = data.scores.filter(s => s.level_type === 'mama');
                console.log('🎯 Puntuaciones de mama encontradas:', breastLevels.length);
                console.log('🎯 Detalles:', breastLevels);
                
                if (breastLevels.length > 0) {
                    // Buscar la mejor puntuación
                    const bestScore = Math.max(...breastLevels.map(s => s.score || 0));
                    console.log(`🏆 Mejor puntuación en mama: ${bestScore}`);
                    
                    // Desbloquear si tiene al menos una puntuación en nivel de mama
                    if (bestScore > 0) {
                        console.log(`✅ Nivel de mama completado con ${bestScore} puntos! Desbloqueando próstata...`);
                        this.unlockProstateLevel();
                    } else {
                        console.log('🔒 Nivel de mama no completado aún (score = 0)');
                    }
                } else {
                    console.log('🔒 No se encontraron puntuaciones de mama');
                }
            } else {
                console.log('📝 Sin puntuaciones previas');
            }
        } catch (error) {
            console.error('❌ Error verificando puntuaciones:', error);
            console.error('❌ Detalles del error:', error.message);
        }
    }
    
    unlockProstateLevel() {
        console.log('🔓 INICIANDO unlockProstateLevel()');
        console.log('🔓 prostateCard existe:', !!this.prostateCard);
        
        if (!this.prostateCard) {
            console.error('❌ No se pudo encontrar prostateCard!');
            return;
        }
        
        console.log('🔓 Clases actuales:', this.prostateCard.className);
        
        // Remover clase locked
        this.prostateCard.classList.remove('locked');
        console.log('✅ Clase "locked" removida');
        console.log('🔓 Clases después de remover locked:', this.prostateCard.className);
        
        // Actualizar el badge de estado
        const statusElement = this.prostateCard.querySelector('.locked-status');
        console.log('🔍 statusElement encontrado:', !!statusElement);
        if (statusElement) {
            statusElement.className = 'status available';
            statusElement.textContent = '✓ Disponible';
            console.log('✅ Badge actualizado a "Disponible"');
        }
        
        // Remover el mensaje de requisito
        const requirementElement = this.prostateCard.querySelector('.unlock-requirement');
        console.log('🔍 requirementElement encontrado:', !!requirementElement);
        if (requirementElement) {
            requirementElement.style.opacity = '0';
            setTimeout(() => requirementElement.remove(), 300);
            console.log('✅ Mensaje de requisito oculto');
        }
        
        // Habilitar click
        this.prostateCard.style.cursor = 'pointer';
        
        // Agregar animación de desbloqueo
        this.prostateCard.classList.add('unlocked-animation');
        console.log('✅ Animación de desbloqueo agregada');
        setTimeout(() => {
            this.prostateCard.classList.remove('unlocked-animation');
        }, 1000);
        
        console.log('🎉 Nivel de próstata desbloqueado!');
        
        // Mostrar notificación
        this.showUnlockedNotification();
    }
    
    showLockedMessage() {
        // Crear modal personalizado para nivel bloqueado
        const modal = document.createElement('div');
        modal.className = 'custom-modal-overlay';
        modal.innerHTML = `
            <div class="custom-modal">
                <div class="modal-icon warning">🔒</div>
                <h3 class="modal-title">Nivel Bloqueado</h3>
                <p class="modal-message">
                    Para desbloquear el <strong>Nivel de Cáncer de Próstata</strong>, 
                    primero debes completar el <strong>Nivel de Cáncer de Mama</strong>.
                </p>
                <div class="level-progress" style="margin: 1.5rem 0;">
                    <div style="background: rgba(255,255,255,0.1); padding: 1rem; border-radius: 10px; border-left: 4px solid #48cae4;">
                        <p style="margin: 0; font-size: 0.9rem;">
                            💡 <strong>Consejo:</strong> Completa el primer nivel para aprender sobre prevención 
                            del cáncer de mama y desbloquear el siguiente desafío.
                        </p>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="modal-btn modal-btn-primary" onclick="this.closest('.custom-modal-overlay').remove(); window.menuManager.startLevel('mama');">
                        <i class="fas fa-play"></i>
                        Jugar Nivel de Mama
                    </button>
                    <button class="modal-btn modal-btn-secondary" onclick="this.closest('.custom-modal-overlay').remove();">
                        <i class="fas fa-times"></i>
                        Cerrar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    showUnlockedNotification() {
        // NOTIFICACIÓN DESHABILITADA - El usuario no quiere alertas
        return;
        
        /* CÓDIGO COMENTADO
        // Crear notificación de desbloqueo
        const notification = document.createElement('div');
        notification.className = 'unlock-notification';
        notification.innerHTML = `
            <div class="unlock-content">
                <div class="unlock-icon">🎉</div>
                <div class="unlock-text">
                    <h4>¡Nuevo Nivel Desbloqueado!</h4>
                    <p>Cáncer de Próstata ahora disponible</p>
                </div>
            </div>
        `;
        
        // Agregar estilos inline
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: -400px;
            background: linear-gradient(135deg, #06d6a0, #48cae4);
            color: white;
            padding: 1.5rem;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(6, 214, 160, 0.4);
            z-index: 10000;
            min-width: 350px;
            animation: slideInUnlock 0.5s ease forwards, slideOutUnlock 0.5s ease 4.5s forwards;
        `;
        
        // Agregar animación
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInUnlock {
                to { right: 20px; }
            }
            @keyframes slideOutUnlock {
                to { right: -400px; opacity: 0; }
            }
            .unlock-content {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            .unlock-icon {
                font-size: 3rem;
                animation: bounce 1s ease-in-out infinite;
            }
            .unlock-text h4 {
                margin: 0 0 0.3rem 0;
                font-size: 1.2rem;
            }
            .unlock-text p {
                margin: 0;
                opacity: 0.9;
            }
            .unlocked-animation {
                animation: unlockPulse 1s ease;
            }
            @keyframes unlockPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); box-shadow: 0 0 30px rgba(6, 214, 160, 0.6); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remover después de 5 segundos
        setTimeout(() => {
            notification.remove();
            style.remove();
        }, 5000);
        */
        // FIN DEL CÓDIGO COMENTADO
    }
}

// Inicializar sistema automáticamente
window.levelUnlockSystem = new LevelUnlockSystem();
