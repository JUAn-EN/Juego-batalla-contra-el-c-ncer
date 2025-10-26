// ============================================
// MANEJO DEL MENÚ - VITAGUARD HEROES
// ============================================

class MenuManager {
    constructor() {
        this.currentScreen = 'main-menu';
        this.modals = {
            register: document.getElementById('register-modal'),
            login: document.getElementById('login-modal')
        };
        
        this.buttons = {
            play: document.getElementById('btn-play'),
            register: document.getElementById('btn-register'),
            login: document.getElementById('btn-login'),
            leaderboard: document.getElementById('btn-leaderboard'),
            info: document.getElementById('btn-info'),
            settings: document.getElementById('btn-settings')
        };
        
        this.cancerCards = document.querySelectorAll('.cancer-card');
        this.closeButtons = document.querySelectorAll('.close-modal');
        
        this.cancerInfo = {
            mama: {
                title: "Cáncer de Mama",
                description: "Aprende técnicas de autoexploración y la importancia de los chequeos regulares.",
                facts: [
                    "1 de cada 8 mujeres desarrollará cáncer de mama en su vida",
                    "La detección temprana aumenta las posibilidades de curación al 99%",
                    "El autoexamen mensual puede detectar cambios importantes",
                    "Las mamografías anuales se recomiendan después de los 40 años"
                ],
                prevention: [
                    "Realizar autoexámenes mensuales",
                    "Mantener un peso saludable",
                    "Hacer ejercicio regularmente",
                    "Limitar el consumo de alcohol"
                ]
            },
            prostata: {
                title: "Cáncer de Próstata",
                description: "Conoce los factores de riesgo y la importancia de los exámenes preventivos.",
                facts: [
                    "Es el segundo cáncer más común en hombres",
                    "1 de cada 9 hombres será diagnosticado con cáncer de próstata",
                    "La edad es el factor de riesgo más importante",
                    "El PSA es una prueba clave para la detección temprana"
                ],
                prevention: [
                    "Exámenes anuales después de los 50 años",
                    "Dieta rica en frutas y verduras",
                    "Mantener actividad física regular",
                    "Controlar el peso corporal"
                ]
            },
            cervical: {
                title: "Cáncer Cervical",
                description: "Prevención a través de vacunación y pruebas de detección regulares.",
                facts: [
                    "El VPH causa el 99% de los casos de cáncer cervical",
                    "Es altamente prevenible con vacunación y detección temprana",
                    "Las citologías pueden detectar cambios pre-cancerosos",
                    "La vacuna del VPH es efectiva al 90%"
                ],
                prevention: [
                    "Vacunarse contra el VPH",
                    "Realizar citologías regulares",
                    "Practicar sexo seguro",
                    "No fumar"
                ]
            },
            pulmon: {
                title: "Cáncer de Pulmón",
                description: "Comprende los factores de riesgo y cómo proteger tus pulmones.",
                facts: [
                    "Es la principal causa de muerte por cáncer",
                    "El 85% de los casos están relacionados con el tabaco",
                    "También afecta a no fumadores por exposición al humo",
                    "La detección temprana es crucial para el tratamiento"
                ],
                prevention: [
                    "No fumar o dejar de fumar",
                    "Evitar el humo de segunda mano",
                    "Evitar la exposición al radón",
                    "Dieta rica en antioxidantes"
                ]
            }
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.initKeyboardNavigation();
        this.initAccessibility();
    }
    
    // ============================================
    // EVENTOS Y NAVEGACIÓN
    // ============================================
    
    bindEvents() {
        // Eventos de botones principales
        if (this.buttons.play) {
            this.buttons.play.addEventListener('click', () => this.startGame());
        }
        
        if (this.buttons.register) {
            this.buttons.register.addEventListener('click', () => this.showModal('register'));
        }
        
        if (this.buttons.login) {
            this.buttons.login.addEventListener('click', () => this.showModal('login'));
        }
        
        if (this.buttons.leaderboard) {
            this.buttons.leaderboard.addEventListener('click', () => this.showLeaderboard());
        }
        
        if (this.buttons.info) {
            this.buttons.info.addEventListener('click', () => this.showInfo());
        }
        
        if (this.buttons.settings) {
            this.buttons.settings.addEventListener('click', () => this.showSettings());
        }
        
        // Eventos de tarjetas de cáncer
        this.cancerCards.forEach(card => {
            card.addEventListener('click', () => {
                const type = card.dataset.type;
                
                // Verificar autenticación antes de mostrar información del nivel
                if (!window.authClient || !window.authClient.isAuthenticated()) {
                    this.showAuthRequiredModal();
                    return;
                }
                
                this.showCancerInfo(type);
            });
        });
        
        // Eventos de cierre de modales
        this.closeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const modalId = button.dataset.modal;
                this.hideModal(modalId);
            });
        });
        
        // Cerrar modal al hacer clic fuera
        Object.values(this.modals).forEach(modal => {
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.hideModal(modal.id);
                    }
                });
            }
        });
    }
    
    initKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'Escape':
                    this.hideAllModals();
                    break;
                case 'Enter':
                    if (document.activeElement.classList.contains('nav-btn')) {
                        document.activeElement.click();
                    }
                    break;
                case '1':
                    if (!this.isModalOpen()) this.buttons.play?.click();
                    break;
                case '2':
                    if (!this.isModalOpen()) this.buttons.register?.click();
                    break;
                case '3':
                    if (!this.isModalOpen()) this.buttons.login?.click();
                    break;
                case '4':
                    if (!this.isModalOpen()) this.buttons.leaderboard?.click();
                    break;
                case '5':
                    if (!this.isModalOpen()) this.buttons.info?.click();
                    break;
                case '6':
                    if (!this.isModalOpen()) this.buttons.settings?.click();
                    break;
            }
        });
    }
    
    initAccessibility() {
        // Añadir atributos ARIA
        this.cancerCards.forEach((card, index) => {
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Aprender sobre ${this.cancerInfo[card.dataset.type]?.title}`);
        });
        
        // Navegación con teclado para tarjetas
        this.cancerCards.forEach(card => {
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    card.click();
                }
            });
        });
    }
    
    // ============================================
    // GESTIÓN DE MODALES
    // ============================================
    
    showModal(modalType) {
        const modal = this.modals[modalType];
        if (!modal) return;
        
        // Esconder otros modales primero
        this.hideAllModals();
        
        modal.classList.remove('hidden');
        modal.classList.add('animate-fade-in');
        
        // Enfocar el primer input
        setTimeout(() => {
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }, 300);
        
        // Efecto de sonido (placeholder)
        this.playSound('modal-open');
    }
    
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.classList.add('animate-fade-out');
        
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('animate-fade-in', 'animate-fade-out');
        }, 300);
        
        this.playSound('modal-close');
    }
    
    hideAllModals() {
        Object.values(this.modals).forEach(modal => {
            if (modal && !modal.classList.contains('hidden')) {
                this.hideModal(modal.id);
            }
        });
    }
    
    isModalOpen() {
        return Object.values(this.modals).some(modal => 
            modal && !modal.classList.contains('hidden')
        );
    }
    
    // ============================================
    // FUNCIONES DE NAVEGACIÓN
    // ============================================
    
    startGame() {
        // Verificar autenticación antes de permitir jugar
        if (!window.authClient || !window.authClient.isAuthenticated()) {
            this.showAuthRequiredModal();
            return;
        }
        
        this.playSound('game-start');
        
        // Mostrar selector de nivel solo si está autenticado
        this.showLevelSelector();
    }
    
    showAuthRequiredModal() {
        const authRequiredHTML = `
            <div id="auth-required-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-lock"></i> Acceso Restringido</h3>
                        <button class="close-modal" onclick="menuManager.hideAuthRequiredModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="auth-required-content">
                            <div class="auth-icon">
                                <i class="fas fa-shield-heart"></i>
                            </div>
                            <h4>¡Únete a los VitaGuard Heroes!</h4>
                            <p class="auth-message">
                                Para comenzar tu misión de prevención del cáncer y salvar vidas, 
                                necesitas crear tu cuenta de héroe o iniciar sesión.
                            </p>
                            <div class="benefits-list">
                                <div class="benefit-item">
                                    <i class="fas fa-star"></i>
                                    <span>Guarda tu progreso y puntajes</span>
                                </div>
                                <div class="benefit-item">
                                    <i class="fas fa-trophy"></i>
                                    <span>Compite en la tabla de héroes</span>
                                </div>
                                <div class="benefit-item">
                                    <i class="fas fa-certificate"></i>
                                    <span>Desbloquea logros y reconocimientos</span>
                                </div>
                                <div class="benefit-item">
                                    <i class="fas fa-heart"></i>
                                    <span>Contribuye a salvar vidas reales</span>
                                </div>
                            </div>
                            <div class="auth-actions">
                                <button class="btn-submit" onclick="menuManager.hideAuthRequiredModal(); window.authManager.showModal('register');">
                                    <i class="fas fa-user-plus"></i>
                                    Crear Cuenta de Héroe
                                </button>
                                <button class="btn-secondary" onclick="menuManager.hideAuthRequiredModal(); window.authManager.showModal('login');">
                                    <i class="fas fa-sign-in-alt"></i>
                                    Ya Tengo Cuenta
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', authRequiredHTML);
        this.addAuthRequiredStyles();
        
        // Agregar evento para cerrar al hacer clic fuera del modal
        setTimeout(() => {
            const modal = document.getElementById('auth-required-modal');
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.hideAuthRequiredModal();
                    }
                });
            }
        }, 100);
    }
    
    hideAuthRequiredModal() {
        const modal = document.getElementById('auth-required-modal');
        if (modal) {
            modal.classList.add('animate-fade-out');
            setTimeout(() => modal.remove(), 300);
        }
    }
    
    showLevelSelector() {
        const levelSelectorHTML = `
            <div id="level-selector" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-gamepad"></i> Selecciona tu Misión</h3>
                        <button class="close-modal" onclick="menuManager.hideLevelSelector()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="level-grid">
                            ${Object.entries(this.cancerInfo).map(([key, info]) => `
                                <div class="level-card" data-level="${key}" onclick="menuManager.startLevel('${key}')">
                                    <div class="level-icon">
                                        <i class="fas fa-${this.getLevelIcon(key)}"></i>
                                    </div>
                                    <h4>${info.title}</h4>
                                    <p>${info.description}</p>
                                    <div class="level-stats">
                                        <span class="difficulty">Nivel: ${this.getLevelDifficulty(key)}</span>
                                        <span class="duration">⏱️ 15-20 min</span>
                                    </div>
                                    <button class="level-btn">
                                        <i class="fas fa-play"></i> Comenzar
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', levelSelectorHTML);
        
        // Añadir estilos para el selector de nivel
        this.addLevelSelectorStyles();
        
        // Agregar evento para cerrar al hacer clic fuera del modal
        setTimeout(() => {
            const modal = document.getElementById('level-selector');
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.hideLevelSelector();
                    }
                });
            }
        }, 100);
    }
    
    hideLevelSelector() {
        const selector = document.getElementById('level-selector');
        if (selector) {
            selector.classList.add('animate-fade-out');
            setTimeout(() => {
                selector.remove();
            }, 300);
        }
    }
    
    startLevel(levelType) {
        console.log(`🎯 startLevel llamado con: ${levelType}`);
        console.log(`🔐 Usuario autenticado: ${window.authClient ? window.authClient.isAuthenticated() : 'authClient no disponible'}`);
        
        // Verificar autenticación antes de iniciar cualquier nivel
        if (!window.authClient || !window.authClient.isAuthenticated()) {
            console.log('❌ Usuario no autenticado, mostrando modal de auth');
            this.hideLevelSelector();
            this.hideCancerInfo();
            this.showAuthRequiredModal();
            return;
        }
        
        console.log(`✅ Usuario autenticado, procediendo con nivel: ${levelType}`);
        this.playSound('level-start');
        
        // Cerrar todos los modales antes de navegar
        this.hideLevelSelector();
        this.hideCancerInfo();
        this.hideComingSoonModal();
        
        // Redirigir al nivel específico según el tipo
        switch(levelType) {
            case 'mama':
                console.log('🎮 Iniciando nivel de Cáncer de Mama');
                // Verificar que el archivo existe antes de navegar
                this.navigateToLevel('breast-cancer-level.html', 'Cáncer de Mama');
                break;
            case 'prostata':
                console.log('🩺 Iniciando nivel de Cáncer de Próstata');
                // Verificar que el archivo existe antes de navegar
                this.navigateToLevel('prostate-cancer-level.html', 'Cáncer de Próstata');
                break;
            case 'cervical':
                console.log('🚧 Nivel Cervical en desarrollo...');
                this.showComingSoonModal(this.cancerInfo[levelType].title);
                break;
            case 'pulmon':
                console.log('🚧 Nivel de Pulmón en desarrollo...');
                this.showComingSoonModal(this.cancerInfo[levelType].title);
                break;
            default:
                console.warn('⚠️ Tipo de nivel no reconocido:', levelType);
                window.UIManager.showNotification('Este nivel no está disponible aún.', 'warning');
        }
    }
    
    navigateToLevel(filename, levelName) {
        // Mostrar mensaje de carga
        window.UIManager.showLoading(`Preparando misión: ${levelName}...`);
        
        console.log(`🎮 Intentando navegar a: ${filename}`);
        console.log(`📍 URL actual: ${window.location.href}`);
        console.log(`🔗 URL destino: ${window.location.origin}/${filename}`);
        
        // Pequeña demora para que se vea el mensaje de carga
        setTimeout(() => {
            try {
                console.log(`🚀 Navegando a: ${filename}`);
                
                // Verificar si estamos autenticados antes de navegar
                if (!window.authClient || !window.authClient.isAuthenticated()) {
                    window.UIManager.hideLoading();
                    window.UIManager.showNotification(
                        '🔐 Necesitas estar autenticado para acceder al nivel',
                        'warning'
                    );
                    this.showAuthRequiredModal();
                    return;
                }
                
                // Intentar navegar
                window.location.href = filename;
                
            } catch (error) {
                console.error('❌ Error al navegar al nivel:', error);
                window.UIManager.hideLoading();
                window.UIManager.showNotification(
                    `❌ Error al cargar el nivel ${levelName}. Por favor, inténtalo de nuevo.`,
                    'error'
                );
            }
        }, 500); // Reducir el tiempo de espera
    }
    
    showComingSoonModal(levelTitle) {
        const comingSoonHTML = `
            <div id="coming-soon-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-rocket"></i> Próximamente</h3>
                        <button class="close-modal" onclick="menuManager.hideComingSoonModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="coming-soon-content">
                            <div class="coming-soon-icon">
                                <i class="fas fa-tools"></i>
                            </div>
                            <h4>${levelTitle}</h4>
                            <p>¡Estamos trabajando duro para traerte este nivel!</p>
                            <div class="progress-info">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: 75%"></div>
                                </div>
                                <p>Progreso de desarrollo: 75%</p>
                            </div>
                            <div class="available-now">
                                <h5>🎮 Mientras tanto, puedes jugar:</h5>
                                <button class="btn-submit" onclick="menuManager.hideComingSoonModal(); menuManager.startLevel('mama');">
                                    <i class="fas fa-ribbon"></i>
                                    Cáncer de Mama (Disponible)
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', comingSoonHTML);
        this.addComingSoonStyles();
        
        // Agregar evento para cerrar al hacer clic fuera del modal
        setTimeout(() => {
            const modal = document.getElementById('coming-soon-modal');
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.hideComingSoonModal();
                    }
                });
            }
        }, 100);
    }
    
    hideComingSoonModal() {
        const modal = document.getElementById('coming-soon-modal');
        if (modal) {
            modal.classList.add('animate-fade-out');
            setTimeout(() => modal.remove(), 300);
        }
    }
    
    showLeaderboard() {
        this.playSound('ui-click');
        
        // Mostrar loading primero
        const loadingHTML = `
            <div id="leaderboard-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-trophy"></i> Tabla de Héroes</h3>
                        <button class="close-modal" onclick="menuManager.hideLeaderboard()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="loading-heroes">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Cargando héroes...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
        
        // Configurar eventos del modal
        const modal = document.getElementById('leaderboard-modal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideLeaderboard();
            }
        });
        
        // Cargar datos reales
        this.loadRealLeaderboardData();
        
        this.addLeaderboardStyles();
    }
    
    async loadRealLeaderboardData() {
        try {
            // Obtener datos del servidor
            const response = await fetch('/api/scores/leaderboard?limit=10');
            const data = await response.json();
            
            // Construir HTML con datos reales
            let leaderboardHTML = '<div class="leaderboard-list">';
            
            if (data.leaderboard && data.leaderboard.length > 0) {
                data.leaderboard.forEach((user, index) => {
                    const position = index + 1;
                    let itemClass = '';
                    let medal = '';
                    let badge = '';
                    
                    // Determinar clase y medalla
                    if (position === 1) {
                        itemClass = 'gold';
                        medal = '🥇';
                        badge = '🏆 Maestro de la Salud';
                    } else if (position === 2) {
                        itemClass = 'silver';
                        medal = '🥈';
                        badge = '⭐ Detector Experto';
                    } else if (position === 3) {
                        itemClass = 'bronze';
                        medal = '🥉';
                        badge = '🛡️ Protector';
                    } else if (position === 4) {
                        badge = '🎯 Explorador';
                    } else if (position === 5) {
                        badge = '🌟 Aprendiz';
                    } else {
                        badge = '🔍 Investigador';
                    }
                    
                    // Verificar si es el usuario actual
                    const currentUser = window.authClient?.getUser();
                    const isCurrentUser = currentUser && user.username === currentUser.username;
                    if (isCurrentUser) itemClass += ' current-user';
                    
                    leaderboardHTML += `
                        <div class="leaderboard-item ${itemClass}">
                            <span class="rank">${medal || position}</span>
                            <span class="name">Dr. ${user.username || 'Anónimo'}</span>
                            <span class="score">${(user.total_score || 0).toLocaleString()} pts</span>
                            <span class="badge">${badge}</span>
                        </div>
                    `;
                });
            } else {
                leaderboardHTML += `
                    <div class="leaderboard-item">
                        <span class="rank">-</span>
                        <span class="name">¡Sé el primer héroe!</span>
                        <span class="score">0 pts</span>
                        <span class="badge">🌟 Únete a la causa</span>
                    </div>
                `;
            }
            
            leaderboardHTML += '</div>';
            
            // Agregar información del usuario actual si está autenticado
            if (data.userRanking && window.authClient?.isAuthenticated()) {
                const currentUser = window.authClient.getUser();
                leaderboardHTML += `
                    <div class="user-rank">
                        <p><strong>Tu posición:</strong> #${data.userRanking} - ${(currentUser.total_score || 0).toLocaleString()} puntos</p>
                        <button class="btn-submit" onclick="menuManager.hideLeaderboard()">
                            <i class="fas fa-gamepad"></i> ¡Jugar para Mejorar!
                        </button>
                    </div>
                `;
            } else {
                leaderboardHTML += `
                    <div class="user-rank">
                        <p><strong>¡Únete a los héroes!</strong></p>
                        <button class="btn-submit" onclick="menuManager.hideLeaderboard(); window.authManager.showModal('register');">
                            <i class="fas fa-user-plus"></i> Registrarse para Competir
                        </button>
                    </div>
                `;
            }
            
            // Actualizar el modal con los datos reales
            const modalBody = document.querySelector('#leaderboard-modal .modal-body');
            if (modalBody) {
                modalBody.innerHTML = leaderboardHTML;
            }
            
        } catch (error) {
            console.error('Error cargando leaderboard:', error);
            // Mostrar datos predeterminados en caso de error
            this.showDefaultLeaderboard();
        }
    }
    
    showDefaultLeaderboard() {
        const modalBody = document.querySelector('#leaderboard-modal .modal-body');
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="leaderboard-list">
                    <div class="leaderboard-item gold">
                        <span class="rank">🥇</span>
                        <span class="name">Dr. Prevención</span>
                        <span class="score">2,500 pts</span>
                        <span class="badge">🏆 Maestro de la Salud</span>
                    </div>
                    <div class="leaderboard-item silver">
                        <span class="rank">🥈</span>
                        <span class="name">Guardián Vital</span>
                        <span class="score">2,100 pts</span>
                        <span class="badge">⭐ Detector Experto</span>
                    </div>
                    <div class="leaderboard-item bronze">
                        <span class="rank">🥉</span>
                        <span class="name">Héroe Salud</span>
                        <span class="score">1,850 pts</span>
                        <span class="badge">🛡️ Protector</span>
                    </div>
                </div>
                <div class="user-rank">
                    <p><strong>Error cargando datos</strong></p>
                    <button class="btn-submit" onclick="menuManager.hideLeaderboard()">
                        <i class="fas fa-redo"></i> Intentar Nuevamente
                    </button>
                </div>
            `;
        }
    }
    
    hideLeaderboard() {
        const modal = document.getElementById('leaderboard-modal');
        if (modal) {
            modal.classList.add('animate-fade-out');
            setTimeout(() => modal.remove(), 300);
        }
    }
    
    showInfo() {
        this.playSound('ui-click');
        
        const infoHTML = `
            <div id="info-modal" class="modal">
                <div class="modal-content" style="max-width: 800px;">
                    <div class="modal-header">
                        <h3><i class="fas fa-info-circle"></i> Información sobre el Cáncer</h3>
                        <button class="close-modal" onclick="menuManager.hideInfo()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="info-tabs">
                            <div class="tab active" data-tab="general">General</div>
                            <div class="tab" data-tab="prevention">Prevención</div>
                            <div class="tab" data-tab="detection">Detección</div>
                            <div class="tab" data-tab="resources">Recursos</div>
                        </div>
                        <div class="tab-content">
                            <div id="general-tab" class="tab-panel active">
                                <h4>¿Qué es el Cáncer?</h4>
                                <p>El cáncer es un grupo de enfermedades caracterizadas por el crecimiento descontrolado de células anormales. Cuando estas células se dividen sin control, pueden formar tumores y extenderse a otras partes del cuerpo.</p>
                                
                                <h4>Datos Importantes:</h4>
                                <ul>
                                    <li>🌍 El cáncer es una de las principales causas de muerte en el mundo</li>
                                    <li>📈 Muchos tipos de cáncer son prevenibles</li>
                                    <li>🎯 La detección temprana salva vidas</li>
                                    <li>💪 Los avances médicos han mejorado significativamente los tratamientos</li>
                                </ul>
                            </div>
                            
                            <div id="prevention-tab" class="tab-panel">
                                <h4>Prevención del Cáncer</h4>
                                <div class="prevention-grid">
                                    <div class="prevention-item">
                                        <i class="fas fa-smoking-ban"></i>
                                        <h5>No Fumar</h5>
                                        <p>Evitar el tabaco reduce significativamente el riesgo de múltiples tipos de cáncer.</p>
                                    </div>
                                    <div class="prevention-item">
                                        <i class="fas fa-apple-alt"></i>
                                        <h5>Dieta Saludable</h5>
                                        <p>Consumir frutas, verduras y alimentos ricos en fibra.</p>
                                    </div>
                                    <div class="prevention-item">
                                        <i class="fas fa-running"></i>
                                        <h5>Ejercicio Regular</h5>
                                        <p>Mantener actividad física reduce el riesgo de varios cánceres.</p>
                                    </div>
                                    <div class="prevention-item">
                                        <i class="fas fa-sun"></i>
                                        <h5>Protección Solar</h5>
                                        <p>Usar protector solar y evitar la exposición excesiva al sol.</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div id="detection-tab" class="tab-panel">
                                <h4>Detección Temprana</h4>
                                <p>La detección temprana aumenta significativamente las posibilidades de tratamiento exitoso.</p>
                                
                                <h5>Métodos de Detección:</h5>
                                <ul>
                                    <li>🔍 Autoexámenes regulares</li>
                                    <li>🏥 Chequeos médicos anuales</li>
                                    <li>📊 Pruebas de detección específicas</li>
                                    <li>🔬 Análisis de laboratorio</li>
                                </ul>
                            </div>
                            
                            <div id="resources-tab" class="tab-panel">
                                <h4>Recursos Útiles</h4>
                                <div class="resources-list">
                                    <a href="#" class="resource-link">
                                        <i class="fas fa-hospital"></i>
                                        <span>Instituto Nacional del Cáncer</span>
                                    </a>
                                    <a href="#" class="resource-link">
                                        <i class="fas fa-users"></i>
                                        <span>Grupos de Apoyo</span>
                                    </a>
                                    <a href="#" class="resource-link">
                                        <i class="fas fa-book"></i>
                                        <span>Guías de Autoexamen</span>
                                    </a>
                                    <a href="#" class="resource-link">
                                        <i class="fas fa-phone"></i>
                                        <span>Líneas de Ayuda</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', infoHTML);
        this.addInfoModalStyles();
        this.initInfoTabs();
    }
    
    hideInfo() {
        const modal = document.getElementById('info-modal');
        if (modal) {
            modal.classList.add('animate-fade-out');
            setTimeout(() => modal.remove(), 300);
        }
    }
    
    showSettings() {
        this.playSound('ui-click');
        alert('Panel de configuración - Próximamente disponible');
    }
    
    showCancerInfo(type) {
        const info = this.cancerInfo[type];
        if (!info) return;
        
        this.playSound('ui-click');
        
        const infoHTML = `
            <div id="cancer-info-modal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3><i class="fas fa-${this.getLevelIcon(type)}"></i> ${info.title}</h3>
                        <button class="close-modal" onclick="menuManager.hideCancerInfo()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p class="cancer-description">${info.description}</p>
                        
                        <div class="info-section">
                            <h4><i class="fas fa-chart-line"></i> Datos Importantes</h4>
                            <ul class="facts-list">
                                ${info.facts.map(fact => `<li>${fact}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="info-section">
                            <h4><i class="fas fa-shield-alt"></i> Métodos de Prevención</h4>
                            <ul class="prevention-list">
                                ${info.prevention.map(method => `<li>${method}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="action-buttons">
                            <button class="btn-submit" onclick="console.log('🔘 Botón Jugar Nivel clickeado (${type})'); menuManager.startLevel('${type}');">
                                <i class="fas fa-play"></i> Jugar Nivel
                            </button>
                            <button class="btn-secondary" onclick="this.closest('.modal').classList.add('hidden');">
                                <i class="fas fa-book"></i> Más Información
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', infoHTML);
        this.addCancerInfoStyles();
        
        // Agregar evento para cerrar al hacer clic fuera del modal
        setTimeout(() => {
            const modal = document.getElementById('cancer-info-modal');
            if (modal) {
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        this.hideCancerInfo();
                    }
                });
            }
        }, 100);
    }
    
    hideCancerInfo() {
        const modal = document.getElementById('cancer-info-modal');
        if (modal) {
            modal.classList.add('animate-fade-out');
            setTimeout(() => modal.remove(), 300);
        }
    }
    
    directNavigateToBreastCancer() {
        console.log('🎯 directNavigateToBreastCancer() llamada');
        
        // Verificar autenticación
        if (!window.authClient || !window.authClient.isAuthenticated()) {
            console.log('❌ Usuario no autenticado');
            window.UIManager.showNotification('🔐 Necesitas iniciar sesión para jugar', 'warning');
            this.showAuthRequiredModal();
            return;
        }
        
        console.log('✅ Usuario autenticado, navegando...');
        
        try {
            // Mostrar mensaje de carga
            window.UIManager.showNotification('🎮 Iniciando nivel de Cáncer de Mama...', 'info', 2000);
            
            // Navegar directamente
            setTimeout(() => {
                console.log('🚀 Navegando a breast-cancer-level.html');
                window.location.href = 'breast-cancer-level.html';
            }, 500);
            
        } catch (error) {
            console.error('❌ Error en directNavigateToBreastCancer:', error);
            window.UIManager.showNotification('❌ Error al cargar el nivel', 'error');
        }
    }
    
    // ============================================
    // FUNCIONES AUXILIARES
    // ============================================
    
    getLevelIcon(type) {
        const icons = {
            mama: 'ribbon',
            prostata: 'male',
            cervical: 'female',
            pulmon: 'lungs'
        };
        return icons[type] || 'question';
    }
    
    getLevelDifficulty(type) {
        const difficulties = {
            mama: 'Básico',
            prostata: 'Intermedio',
            cervical: 'Intermedio',
            pulmon: 'Avanzado'
        };
        return difficulties[type] || 'Normal';
    }
    
    playSound(soundType) {
        // Placeholder para efectos de sonido
        console.log(`Playing sound: ${soundType}`);
        // Aquí se implementarían los efectos de sonido reales
    }
    
    // ============================================
    // ESTILOS DINÁMICOS
    // ============================================
    
    addLevelSelectorStyles() {
        if (document.getElementById('level-selector-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'level-selector-styles';
        styles.textContent = `
            .level-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .level-card {
                background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
                border: 2px solid rgba(255,255,255,0.2);
                border-radius: 1rem;
                padding: 1.5rem;
                text-align: center;
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .level-card:hover {
                transform: translateY(-5px);
                border-color: #48cae4;
                box-shadow: 0 10px 25px rgba(72,202,228,0.3);
            }
            
            .level-icon {
                font-size: 3rem;
                margin-bottom: 1rem;
                color: #48cae4;
            }
            
            .level-card h4 {
                margin-bottom: 0.5rem;
                color: #2d3436;
            }
            
            .level-stats {
                display: flex;
                justify-content: space-between;
                margin: 1rem 0;
                font-size: 0.875rem;
            }
            
            .level-btn {
                background: linear-gradient(45deg, #48cae4, #06d6a0);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 600;
            }
            
            .level-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(72,202,228,0.4);
            }
        `;
        document.head.appendChild(styles);
    }
    
    addLeaderboardStyles() {
        if (document.getElementById('leaderboard-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'leaderboard-styles';
        styles.textContent = `
            .leaderboard-list {
                margin-bottom: 2rem;
            }
            
            .leaderboard-item {
                display: grid;
                grid-template-columns: auto 1fr auto auto;
                gap: 1rem;
                align-items: center;
                padding: 1rem;
                margin-bottom: 0.5rem;
                background: rgba(255,255,255,0.1);
                border-radius: 0.5rem;
                transition: all 0.3s ease;
            }
            
            .leaderboard-item:hover {
                background: rgba(255,255,255,0.2);
                transform: translateX(5px);
            }
            
            .leaderboard-item.gold {
                background: linear-gradient(45deg, rgba(255,215,0,0.2), rgba(255,193,7,0.1));
                border: 2px solid #ffd700;
            }
            
            .leaderboard-item.silver {
                background: linear-gradient(45deg, rgba(192,192,192,0.2), rgba(169,169,169,0.1));
                border: 2px solid #c0c0c0;
            }
            
            .leaderboard-item.bronze {
                background: linear-gradient(45deg, rgba(205,127,50,0.2), rgba(184,115,51,0.1));
                border: 2px solid #cd7f32;
            }
            
            .leaderboard-item.current-user {
                background: linear-gradient(45deg, rgba(72,202,228,0.3), rgba(72,202,228,0.1));
                border: 2px solid #48cae4;
                transform: scale(1.02);
            }
            
            .rank {
                font-size: 1.5rem;
                font-weight: bold;
            }
            
            .name {
                font-weight: 600;
                color: #2d3436;
            }
            
            .score {
                font-weight: bold;
                color: #48cae4;
            }
            
            .badge {
                font-size: 0.875rem;
                opacity: 0.8;
            }
            
            .user-rank {
                text-align: center;
                padding: 1rem;
                background: rgba(72,202,228,0.1);
                border-radius: 0.5rem;
                border: 2px solid #48cae4;
            }
        `;
        document.head.appendChild(styles);
    }
    
    addInfoModalStyles() {
        if (document.getElementById('info-modal-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'info-modal-styles';
        styles.textContent = `
            .info-tabs {
                display: flex;
                border-bottom: 2px solid rgba(0,0,0,0.1);
                margin-bottom: 1rem;
            }
            
            .tab {
                padding: 1rem 1.5rem;
                cursor: pointer;
                border-bottom: 3px solid transparent;
                transition: all 0.3s ease;
                font-weight: 600;
            }
            
            .tab:hover {
                background: rgba(72,202,228,0.1);
            }
            
            .tab.active {
                border-bottom-color: #48cae4;
                color: #48cae4;
            }
            
            .tab-panel {
                display: none;
            }
            
            .tab-panel.active {
                display: block;
                animation: fadeIn 0.3s ease-in;
            }
            
            .prevention-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
                margin-top: 1rem;
            }
            
            .prevention-item {
                text-align: center;
                padding: 1rem;
                border-radius: 0.5rem;
                background: rgba(255,255,255,0.1);
            }
            
            .prevention-item i {
                font-size: 2rem;
                color: #48cae4;
                margin-bottom: 0.5rem;
            }
            
            .resources-list {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .resource-link {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: rgba(255,255,255,0.1);
                border-radius: 0.5rem;
                text-decoration: none;
                color: #2d3436;
                transition: all 0.3s ease;
            }
            
            .resource-link:hover {
                background: rgba(72,202,228,0.2);
                transform: translateX(5px);
            }
        `;
        document.head.appendChild(styles);
    }
    
    addCancerInfoStyles() {
        if (document.getElementById('cancer-info-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'cancer-info-styles';
        styles.textContent = `
            .cancer-description {
                font-size: 1.1rem;
                margin-bottom: 1.5rem;
                padding: 1rem;
                background: rgba(72,202,228,0.1);
                border-radius: 0.5rem;
                border-left: 4px solid #48cae4;
            }
            
            .info-section {
                margin-bottom: 1.5rem;
            }
            
            .info-section h4 {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 1rem;
                color: #2d3436;
            }
            
            .facts-list, .prevention-list {
                list-style: none;
                padding: 0;
            }
            
            .facts-list li, .prevention-list li {
                padding: 0.5rem 0;
                border-bottom: 1px solid rgba(0,0,0,0.1);
                position: relative;
                padding-left: 2rem;
            }
            
            .facts-list li:before {
                content: "📊";
                position: absolute;
                left: 0;
            }
            
            .prevention-list li:before {
                content: "🛡️";
                position: absolute;
                left: 0;
            }
            
            .action-buttons {
                display: flex;
                gap: 1rem;
                margin-top: 2rem;
            }
            
            .btn-secondary {
                background: rgba(255,255,255,0.2);
                color: #2d3436;
                border: 2px solid rgba(0,0,0,0.2);
                padding: 0.75rem 1.5rem;
                border-radius: 0.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                text-decoration: none;
            }
            
            .btn-secondary:hover {
                background: rgba(255,255,255,0.3);
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(styles);
    }
    
    addAuthRequiredStyles() {
        if (document.getElementById('auth-required-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'auth-required-styles';
        styles.textContent = `
            .auth-required-content {
                text-align: center;
                padding: 1rem 0;
            }
            
            .auth-icon {
                font-size: 4rem;
                color: #48cae4;
                margin-bottom: 1rem;
                animation: pulse 2s infinite;
            }
            
            .auth-required-content h4 {
                color: #2d3436;
                margin-bottom: 1rem;
                font-size: 1.5rem;
            }
            
            .auth-message {
                color: #636e72;
                margin-bottom: 2rem;
                font-size: 1.1rem;
                line-height: 1.6;
            }
            
            .benefits-list {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                margin-bottom: 2rem;
                text-align: left;
            }
            
            .benefit-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0.75rem;
                background: rgba(72,202,228,0.1);
                border-radius: 0.5rem;
                border-left: 3px solid #48cae4;
            }
            
            .benefit-item i {
                color: #48cae4;
                font-size: 1.2rem;
                width: 20px;
            }
            
            .benefit-item span {
                color: #2d3436;
                font-weight: 500;
            }
            
            .auth-actions {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                margin-top: 1.5rem;
            }
            
            .auth-actions .btn-submit,
            .auth-actions .btn-secondary {
                padding: 1rem 2rem;
                font-size: 1.1rem;
                border-radius: 0.75rem;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .auth-actions .btn-submit:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(72,202,228,0.4);
            }
            
            .auth-actions .btn-secondary:hover {
                transform: translateY(-2px);
                background: rgba(255,255,255,0.3);
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
        `;
        document.head.appendChild(styles);
    }
    
    addComingSoonStyles() {
        if (document.getElementById('coming-soon-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'coming-soon-styles';
        styles.textContent = `
            .coming-soon-content {
                text-align: center;
                padding: 1rem 0;
            }
            
            .coming-soon-icon {
                font-size: 4rem;
                color: #ff9800;
                margin-bottom: 1rem;
                animation: spin 3s linear infinite;
            }
            
            .coming-soon-content h4 {
                color: #2d3436;
                margin-bottom: 1rem;
                font-size: 1.5rem;
            }
            
            .progress-info {
                margin: 2rem 0;
            }
            
            .progress-bar {
                width: 100%;
                height: 12px;
                background: rgba(0,0,0,0.1);
                border-radius: 6px;
                overflow: hidden;
                margin-bottom: 0.5rem;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(45deg, #48cae4, #06d6a0);
                border-radius: 6px;
                transition: width 0.3s ease;
                position: relative;
            }
            
            .progress-fill::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                animation: shimmer 2s infinite;
            }
            
            .available-now {
                background: rgba(76,175,80,0.1);
                padding: 1.5rem;
                border-radius: 0.75rem;
                border: 2px solid #4caf50;
                margin-top: 1.5rem;
            }
            
            .available-now h5 {
                color: #2d3436;
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `;
        document.head.appendChild(styles);
    }
    
    initInfoTabs() {
        const tabs = document.querySelectorAll('#info-modal .tab');
        const panels = document.querySelectorAll('#info-modal .tab-panel');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Remover active de todas las tabs y panels
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                
                // Activar tab y panel seleccionados
                tab.classList.add('active');
                document.getElementById(`${targetTab}-tab`).classList.add('active');
            });
        });
    }
}

// Inicializar el manager del menú cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.menuManager = new MenuManager();
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MenuManager;
}