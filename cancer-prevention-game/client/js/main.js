// ============================================
// ARCHIVO PRINCIPAL - VITAGUARD HEROES
// ============================================

class VitaGuardGame {
    constructor() {
        this.version = '1.0.0';
        this.gameTitle = 'VitaGuard Heroes - Guardianes de la Vida';
        this.isDebugMode = false;
        
        // Estados del juego
        this.gameState = {
            currentScreen: 'loading',
            currentLevel: null,
            currentUser: null,
            gameProgress: {},
            settings: this.loadGameSettings()
        };
        
        // Managers
        this.animationManager = null;
        this.menuManager = null;
        this.authManager = null;
        this.soundManager = null;
        
        // Sistema de eventos
        this.eventBus = new EventTarget();
        
        this.init();
    }
    
    // ============================================
    // INICIALIZACIÓN
    // ============================================
    
    async init() {
        try {
            this.log('Inicializando VitaGuard Heroes...');
            
            // Verificar compatibilidad del navegador
            if (!this.checkBrowserCompatibility()) {
                this.showBrowserWarning();
                return;
            }
            
            // Inicializar sistemas principales
            await this.initializeManagers();
            
            // Configurar eventos globales
            this.setupGlobalEvents();
            
            // Cargar configuración del usuario
            this.loadUserPreferences();
            
            // Inicializar sistema de analíticas (placeholder)
            this.initAnalytics();
            
            // Indicar que el juego está listo
            this.gameState.currentScreen = 'main-menu';
            this.dispatchGameEvent('gameReady', { version: this.version });
            
            this.log('VitaGuard Heroes inicializado correctamente');
            
            // Mostrar mensaje de bienvenida en consola
            this.showWelcomeMessage();
            
        } catch (error) {
            this.error('Error al inicializar el juego:', error);
            this.showErrorScreen(error);
        }
    }
    
    async initializeManagers() {
        // Los managers se inicializan automáticamente cuando sus archivos se cargan
        // Aquí verificamos que estén disponibles
        await this.waitForManagers();
        
        // Referencias a los managers globales
        this.animationManager = window.gameAnimations;
        this.menuManager = window.menuManager;
        this.authManager = window.authManager;
        
        // Inicializar manager de sonidos (placeholder)
        this.soundManager = new SoundManager();
        
        this.log('Todos los managers inicializados correctamente');
    }
    
    async waitForManagers() {
        const maxWaitTime = 5000; // 5 segundos máximo
        const checkInterval = 100; // Verificar cada 100ms
        let elapsed = 0;
        
        return new Promise((resolve, reject) => {
            const check = () => {
                if (window.gameAnimations && window.menuManager && window.authManager) {
                    resolve();
                } else if (elapsed >= maxWaitTime) {
                    reject(new Error('Timeout esperando la inicialización de los managers'));
                } else {
                    elapsed += checkInterval;
                    setTimeout(check, checkInterval);
                }
            };
            check();
        });
    }
    
    // ============================================
    // EVENTOS GLOBALES
    // ============================================
    
    setupGlobalEvents() {
        // Eventos de usuario
        document.addEventListener('userLoggedIn', (e) => {
            this.handleUserLogin(e.detail.user);
        });
        
        document.addEventListener('userLoggedOut', () => {
            this.handleUserLogout();
        });
        
        // Eventos de juego
        this.eventBus.addEventListener('levelStart', (e) => {
            this.handleLevelStart(e.detail);
        });
        
        this.eventBus.addEventListener('levelComplete', (e) => {
            this.handleLevelComplete(e.detail);
        });
        
        // Eventos de ventana
        window.addEventListener('beforeunload', () => {
            this.saveGameState();
        });
        
        window.addEventListener('focus', () => {
            this.handleWindowFocus();
        });
        
        window.addEventListener('blur', () => {
            this.handleWindowBlur();
        });
        
        // Eventos de teclado globales
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyPress(e);
        });
        
        // Eventos de errores globales
        window.addEventListener('error', (e) => {
            this.handleGlobalError(e);
        });
        
        window.addEventListener('unhandledrejection', (e) => {
            this.handleUnhandledRejection(e);
        });
    }
    
    // ============================================
    // MANEJO DE EVENTOS
    // ============================================
    
    handleUserLogin(user) {
        this.gameState.currentUser = user;
        this.log(`Usuario conectado: ${user.username}`);
        
        // Cargar progreso del usuario
        this.loadUserProgress(user.id);
        
        // Actualizar UI
        this.updateUIForUser(user);
        
        // Analíticas
        this.trackEvent('user_login', { userId: user.id });
    }
    
    handleUserLogout() {
        // Guardar progreso antes del logout
        if (this.gameState.currentUser) {
            this.saveUserProgress(this.gameState.currentUser.id);
        }
        
        this.gameState.currentUser = null;
        this.gameState.gameProgress = {};
        
        this.log('Usuario desconectado');
        this.trackEvent('user_logout');
    }
    
    handleLevelStart(levelData) {
        this.gameState.currentLevel = levelData.levelType;
        this.log(`Iniciando nivel: ${levelData.levelType}`);
        
        // Analíticas
        this.trackEvent('level_start', { 
            level: levelData.levelType,
            userId: this.gameState.currentUser?.id 
        });
    }
    
    handleLevelComplete(levelData) {
        this.log(`Nivel completado: ${levelData.levelType} - Puntuación: ${levelData.score}`);
        
        // Actualizar progreso del usuario
        if (this.authManager && this.gameState.currentUser) {
            this.authManager.updateUserProgress({
                score: levelData.score,
                completed: true,
                perfectScore: levelData.perfectScore || false
            });
        }
        
        // Guardar progreso
        this.saveUserProgress(this.gameState.currentUser?.id);
        
        // Mostrar efectos de celebración
        if (this.animationManager) {
            this.animationManager.createConfettiEffect();
            
            if (levelData.perfectScore) {
                this.animationManager.showLevelUpEffect();
            }
        }
        
        // Analíticas
        this.trackEvent('level_complete', {
            level: levelData.levelType,
            score: levelData.score,
            perfectScore: levelData.perfectScore || false,
            userId: this.gameState.currentUser?.id
        });
        
        this.gameState.currentLevel = null;
    }
    
    handleWindowFocus() {
        // Reanudar animaciones y sonidos si estaban pausados
        this.log('Ventana enfocada - Reanudando juego');
    }
    
    handleWindowBlur() {
        // Pausar animaciones y sonidos para ahorrar recursos
        this.log('Ventana desenfocada - Pausando juego');
        this.saveGameState();
    }
    
    handleGlobalKeyPress(e) {
        // Atajos de teclado globales
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'p':
                    e.preventDefault();
                    this.togglePause();
                    break;
                case 'm':
                    e.preventDefault();
                    this.toggleMute();
                    break;
                case 'd':
                    if (e.shiftKey) {
                        e.preventDefault();
                        this.toggleDebugMode();
                    }
                    break;
            }
        }
        
        // Tecla F11 para pantalla completa
        if (e.key === 'F11') {
            e.preventDefault();
            this.toggleFullscreen();
        }
    }
    
    handleGlobalError(e) {
        this.error('Error global:', e.error);
        this.trackEvent('error', {
            message: e.error?.message,
            filename: e.filename,
            line: e.lineno
        });
    }
    
    handleUnhandledRejection(e) {
        this.error('Promise rechazada:', e.reason);
        this.trackEvent('unhandled_rejection', {
            reason: e.reason?.toString()
        });
    }
    
    // ============================================
    // GESTIÓN DE DATOS
    // ============================================
    
    loadGameSettings() {
        const defaultSettings = {
            volume: 0.8,
            sfxVolume: 0.7,
            musicVolume: 0.5,
            graphics: 'high',
            language: 'es',
            accessibility: {
                highContrast: false,
                reduceAnimations: false,
                largeText: false
            }
        };
        
        try {
            const savedSettings = localStorage.getItem('vitaguard_settings');
            return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
        } catch (error) {
            this.error('Error cargando configuración:', error);
            return defaultSettings;
        }
    }
    
    saveGameSettings() {
        try {
            localStorage.setItem('vitaguard_settings', JSON.stringify(this.gameState.settings));
        } catch (error) {
            this.error('Error guardando configuración:', error);
        }
    }
    
    loadUserProgress(userId) {
        if (!userId) return;
        
        try {
            const progress = localStorage.getItem(`vitaguard_progress_${userId}`);
            this.gameState.gameProgress = progress ? JSON.parse(progress) : {};
        } catch (error) {
            this.error('Error cargando progreso del usuario:', error);
            this.gameState.gameProgress = {};
        }
    }
    
    saveUserProgress(userId) {
        if (!userId) return;
        
        try {
            localStorage.setItem(
                `vitaguard_progress_${userId}`, 
                JSON.stringify(this.gameState.gameProgress)
            );
        } catch (error) {
            this.error('Error guardando progreso del usuario:', error);
        }
    }
    
    saveGameState() {
        this.saveGameSettings();
        if (this.gameState.currentUser) {
            this.saveUserProgress(this.gameState.currentUser.id);
        }
    }
    
    loadUserPreferences() {
        // Aplicar configuración de accesibilidad
        if (this.gameState.settings.accessibility.highContrast) {
            document.body.classList.add('high-contrast');
        }
        
        if (this.gameState.settings.accessibility.reduceAnimations) {
            document.body.classList.add('reduce-animations');
        }
        
        if (this.gameState.settings.accessibility.largeText) {
            document.body.classList.add('large-text');
        }
    }
    
    // ============================================
    // FUNCIONES DE UTILIDAD
    // ============================================
    
    checkBrowserCompatibility() {
        // Verificar características requeridas
        const requiredFeatures = [
            'localStorage',
            'JSON',
            'Promise',
            'fetch',
            'addEventListener'
        ];
        
        for (const feature of requiredFeatures) {
            if (!(feature in window)) {
                this.error(`Característica no soportada: ${feature}`);
                return false;
            }
        }
        
        return true;
    }
    
    showBrowserWarning() {
        const warningHTML = `
            <div class="browser-warning">
                <h2>⚠️ Navegador No Compatible</h2>
                <p>Tu navegador no es compatible con VitaGuard Heroes.</p>
                <p>Por favor actualiza tu navegador o usa uno moderno como:</p>
                <ul>
                    <li>Chrome 80+</li>
                    <li>Firefox 75+</li>
                    <li>Safari 13+</li>
                    <li>Edge 80+</li>
                </ul>
            </div>
        `;
        
        document.body.innerHTML = warningHTML;
    }
    
    showErrorScreen(error) {
        const errorHTML = `
            <div class="error-screen">
                <h2>❌ Error del Sistema</h2>
                <p>Ha ocurrido un error inesperado:</p>
                <pre>${error.message}</pre>
                <button onclick="location.reload()">Reintentar</button>
            </div>
        `;
        
        document.body.innerHTML = errorHTML;
    }
    
    showWelcomeMessage() {
        const welcomeStyles = `
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 10px 20px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        `;
        
        console.log(`%c🦸‍♂️ ¡Bienvenido a ${this.gameTitle}! 🦸‍♀️`, welcomeStyles);
        console.log('%c🎮 Versión:', 'font-weight: bold; color: #48cae4', this.version);
        console.log('%c💡 Misión:', 'font-weight: bold; color: #06d6a0', 'Educar sobre la prevención del cáncer');
        console.log('%c🔧 Debug Mode:', 'font-weight: bold; color: #ffb703', 'Ctrl+Shift+D para activar');
        console.log('%c📊 Estado del juego disponible en:', 'font-weight: bold; color: #f72585', 'window.vitaguardGame');
    }
    
    // ============================================
    // FUNCIONES DE CONTROL
    // ============================================
    
    togglePause() {
        // Placeholder para pausar/reanudar el juego
        this.log('Toggle pause - Función por implementar');
    }
    
    toggleMute() {
        const isMuted = this.gameState.settings.volume === 0;
        this.gameState.settings.volume = isMuted ? 0.8 : 0;
        this.saveGameSettings();
        
        this.log(`Audio ${isMuted ? 'activado' : 'silenciado'}`);
    }
    
    toggleDebugMode() {
        this.isDebugMode = !this.isDebugMode;
        document.body.classList.toggle('debug-mode', this.isDebugMode);
        
        if (this.isDebugMode) {
            this.showDebugPanel();
        } else {
            this.hideDebugPanel();
        }
        
        this.log(`Modo debug ${this.isDebugMode ? 'activado' : 'desactivado'}`);
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                this.error('Error al entrar en pantalla completa:', err);
            });
        } else {
            document.exitFullscreen().catch(err => {
                this.error('Error al salir de pantalla completa:', err);
            });
        }
    }
    
    // ============================================
    // PANEL DE DEBUG
    // ============================================
    
    showDebugPanel() {
        if (document.getElementById('debug-panel')) return;
        
        const debugHTML = `
            <div id="debug-panel" class="debug-panel">
                <div class="debug-header">
                    <h3>🔧 Panel de Debug</h3>
                    <button onclick="vitaguardGame.hideDebugPanel()">✕</button>
                </div>
                <div class="debug-content">
                    <div class="debug-section">
                        <h4>Estado del Juego</h4>
                        <p><strong>Pantalla:</strong> <span id="debug-screen">${this.gameState.currentScreen}</span></p>
                        <p><strong>Nivel:</strong> <span id="debug-level">${this.gameState.currentLevel || 'Ninguno'}</span></p>
                        <p><strong>Usuario:</strong> <span id="debug-user">${this.gameState.currentUser?.username || 'No autenticado'}</span></p>
                    </div>
                    
                    <div class="debug-section">
                        <h4>Acciones</h4>
                        <button onclick="vitaguardGame.debugUnlockAllLevels()">Desbloquear Niveles</button>
                        <button onclick="vitaguardGame.debugAddScore(1000)">Añadir 1000 Puntos</button>
                        <button onclick="vitaguardGame.debugShowConfetti()">Mostrar Confetti</button>
                        <button onclick="vitaguardGame.debugClearData()">Limpiar Datos</button>
                    </div>
                    
                    <div class="debug-section">
                        <h4>Logs</h4>
                        <div id="debug-logs" class="debug-logs"></div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', debugHTML);
        this.addDebugStyles();
        this.updateDebugInfo();
        
        // Actualizar debug info cada segundo
        this.debugInterval = setInterval(() => {
            this.updateDebugInfo();
        }, 1000);
    }
    
    hideDebugPanel() {
        const panel = document.getElementById('debug-panel');
        if (panel) {
            panel.remove();
        }
        
        if (this.debugInterval) {
            clearInterval(this.debugInterval);
        }
    }
    
    updateDebugInfo() {
        const screenEl = document.getElementById('debug-screen');
        const levelEl = document.getElementById('debug-level');
        const userEl = document.getElementById('debug-user');
        
        if (screenEl) screenEl.textContent = this.gameState.currentScreen;
        if (levelEl) levelEl.textContent = this.gameState.currentLevel || 'Ninguno';
        if (userEl) userEl.textContent = this.gameState.currentUser?.username || 'No autenticado';
    }
    
    // ============================================
    // FUNCIONES DE DEBUG
    // ============================================
    
    debugUnlockAllLevels() {
        this.log('Debug: Desbloqueando todos los niveles');
        // Implementar lógica de desbloqueo
    }
    
    debugAddScore(points) {
        if (this.authManager && this.gameState.currentUser) {
            this.authManager.updateUserProgress({
                score: points,
                completed: false,
                perfectScore: false
            });
            this.log(`Debug: Añadidos ${points} puntos`);
        } else {
            this.log('Debug: No hay usuario autenticado');
        }
    }
    
    debugShowConfetti() {
        if (this.animationManager) {
            this.animationManager.createConfettiEffect();
            this.log('Debug: Mostrando confetti');
        }
    }
    
    debugClearData() {
        if (confirm('¿Estás seguro de que quieres limpiar todos los datos?')) {
            localStorage.clear();
            location.reload();
        }
    }
    
    // ============================================
    // SISTEMA DE EVENTOS Y LOGGING
    // ============================================
    
    dispatchGameEvent(eventType, data = {}) {
        const event = new CustomEvent(eventType, { detail: data });
        this.eventBus.dispatchEvent(event);
    }
    
    log(...args) {
        if (this.isDebugMode) {
            console.log('[VitaGuard]', ...args);
            
            // Añadir al panel de debug si está visible
            const debugLogs = document.getElementById('debug-logs');
            if (debugLogs) {
                const logEntry = document.createElement('div');
                logEntry.className = 'debug-log-entry';
                logEntry.textContent = `${new Date().toLocaleTimeString()} - ${args.join(' ')}`;
                debugLogs.appendChild(logEntry);
                debugLogs.scrollTop = debugLogs.scrollHeight;
                
                // Limitar a 50 entradas
                while (debugLogs.children.length > 50) {
                    debugLogs.removeChild(debugLogs.firstChild);
                }
            }
        }
    }
    
    error(...args) {
        console.error('[VitaGuard Error]', ...args);
    }
    
    // ============================================
    // ANALÍTICAS (PLACEHOLDER)
    // ============================================
    
    initAnalytics() {
        // Placeholder para sistema de analíticas
        this.analytics = {
            sessionStart: Date.now(),
            events: []
        };
    }
    
    trackEvent(eventName, data = {}) {
        const event = {
            name: eventName,
            timestamp: Date.now(),
            data: data
        };
        
        this.analytics.events.push(event);
        this.log(`Analytics: ${eventName}`, data);
        
        // En producción, enviar a servidor de analíticas
    }
    
    updateUIForUser(user) {
        // Placeholder para actualizar UI cuando un usuario se conecta
        this.log(`Actualizando UI para usuario: ${user.username}`);
    }
    
    // ============================================
    // ESTILOS DE DEBUG
    // ============================================
    
    addDebugStyles() {
        if (document.getElementById('debug-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'debug-styles';
        styles.textContent = `
            .debug-panel {
                position: fixed;
                top: 10px;
                left: 10px;
                width: 300px;
                max-height: 80vh;
                background: rgba(0,0,0,0.9);
                color: white;
                border-radius: 8px;
                z-index: 10000;
                font-family: monospace;
                font-size: 12px;
                overflow: hidden;
            }
            
            .debug-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 10px;
                background: #333;
                border-bottom: 1px solid #555;
            }
            
            .debug-header h3 {
                margin: 0;
                font-size: 14px;
            }
            
            .debug-header button {
                background: #e63946;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 4px 8px;
                cursor: pointer;
            }
            
            .debug-content {
                padding: 10px;
                max-height: 60vh;
                overflow-y: auto;
            }
            
            .debug-section {
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid #333;
            }
            
            .debug-section h4 {
                margin: 0 0 8px 0;
                color: #48cae4;
                font-size: 13px;
            }
            
            .debug-section p {
                margin: 4px 0;
                line-height: 1.4;
            }
            
            .debug-section button {
                background: #06d6a0;
                color: white;
                border: none;
                border-radius: 4px;
                padding: 6px 10px;
                margin: 2px;
                cursor: pointer;
                font-size: 11px;
            }
            
            .debug-section button:hover {
                background: #04a078;
            }
            
            .debug-logs {
                max-height: 150px;
                overflow-y: auto;
                background: #111;
                border-radius: 4px;
                padding: 5px;
                font-size: 10px;
            }
            
            .debug-log-entry {
                margin: 2px 0;
                color: #ccc;
            }
            
            .debug-log-entry:nth-child(odd) {
                background: rgba(255,255,255,0.05);
            }
        `;
        document.head.appendChild(styles);
    }
}

// ============================================
// SOUND MANAGER (PLACEHOLDER)
// ============================================

class SoundManager {
    constructor() {
        this.sounds = {};
        this.musicVolume = 0.5;
        this.sfxVolume = 0.7;
        this.isMuted = false;
    }
    
    loadSound(name, url) {
        // Placeholder para cargar sonidos
        console.log(`Loading sound: ${name} from ${url}`);
    }
    
    playSound(name, volume = 1) {
        if (this.isMuted) return;
        // Placeholder para reproducir sonidos
        console.log(`Playing sound: ${name} at volume ${volume}`);
    }
    
    playMusic(name, loop = true) {
        if (this.isMuted) return;
        // Placeholder para reproducir música
        console.log(`Playing music: ${name}, loop: ${loop}`);
    }
    
    stopAll() {
        // Placeholder para detener todos los sonidos
        console.log('Stopping all sounds');
    }
}

// ============================================
// INICIALIZACIÓN GLOBAL
// ============================================

// Inicializar el juego cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.vitaguardGame = new VitaGuardGame();
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VitaGuardGame, SoundManager };
}