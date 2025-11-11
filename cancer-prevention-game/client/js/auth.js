// ============================================
// CLIENTE DE AUTENTICACIÓN Y API
// ============================================

class AuthClient {
    constructor() {
        this.baseURL = 'http://localhost:3000/api';
        this.token = localStorage.getItem('vitaguard_token');
        this.refreshToken = localStorage.getItem('vitaguard_refresh_token');
        this.user = null;
        
        // Configuración de sesión persistente (2 horas)
        this.SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 horas
        this.AUTO_REFRESH_INTERVAL = 15 * 60 * 1000; // Renovar cada 15 minutos
        this.refreshInterval = null;
        this.lastActivity = Date.now();
        
        // Inicializar cliente
        this.init();
    }
    
    async init() {
        // Cargar usuario desde localStorage si existe
        this.loadStoredUser();
        
        if (this.token) {
            try {
                // Verificar si la sesión no ha expirado
                if (this.isSessionValid()) {
                    await this.verifyToken();
                    this.setupAutoRefresh();
                    this.setupActivityTracking();
                } else {
                    console.log('Sesión expirada, intentando renovar...');
                    await this.refreshAccessToken();
                }
            } catch (error) {
                console.log('Token inválido, limpiando sesión...');
                await this.logout();
            }
        }
    }
    
    loadStoredUser() {
        try {
            const storedUser = localStorage.getItem('vitaguard_user');
            const loginTime = localStorage.getItem('vitaguard_login_time');
            
            if (storedUser && loginTime) {
                this.user = JSON.parse(storedUser);
                this.lastActivity = parseInt(loginTime);
            }
        } catch (error) {
            console.error('Error cargando usuario almacenado:', error);
        }
    }
    
    isSessionValid() {
        const loginTime = localStorage.getItem('vitaguard_login_time');
        if (!loginTime) return false;
        
        const elapsed = Date.now() - parseInt(loginTime);
        return elapsed < this.SESSION_DURATION;
    }
    
    setupAutoRefresh() {
        // Limpiar intervalo anterior si existe
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        // Configurar renovación automática cada 15 minutos
        this.refreshInterval = setInterval(async () => {
            if (this.isSessionValid() && this.token) {
                try {
                    await this.refreshAccessToken();
                } catch (error) {
                    console.error('Error en renovación automática:', error);
                    await this.logout();
                }
            } else {
                await this.logout();
            }
        }, this.AUTO_REFRESH_INTERVAL);
    }
    
    setupActivityTracking() {
        // Rastrear actividad del usuario para mantener la sesión activa
        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        const updateActivity = () => {
            this.lastActivity = Date.now();
            localStorage.setItem('vitaguard_last_activity', this.lastActivity.toString());
        };
        
        events.forEach(event => {
            document.addEventListener(event, updateActivity, true);
        });
    }
    
    // ============================================
    // MÉTODOS DE AUTENTICACIÓN
    // ============================================
    
    async register(userData) {
        try {
            const response = await fetch(`${this.baseURL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                // Crear error con información completa para mejor manejo
                const error = new Error(data.message || 'Error en el registro');
                error.status = response.status;
                error.details = data.details || [];
                error.errorType = data.error || 'unknown';
                error.responseText = JSON.stringify(data);
                throw error;
            }
            
            // Guardar tokens y tiempo de sesión (registro)
            this.token = data.tokens.access;
            this.refreshToken = data.tokens.refresh;
            this.user = data.user;
            this.lastActivity = Date.now();
            
            localStorage.setItem('vitaguard_token', this.token);
            localStorage.setItem('vitaguard_refresh_token', this.refreshToken);
            localStorage.setItem('vitaguard_user', JSON.stringify(this.user));
            localStorage.setItem('vitaguard_login_time', this.lastActivity.toString());
            localStorage.setItem('vitaguard_last_activity', this.lastActivity.toString());
            
            // Configurar sesión persistente
            this.setupAutoRefresh();
            this.setupActivityTracking();
            
            this.onAuthChange?.(true, this.user);
            
            return data;
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    }
    
    async login(credentials) {
        try {
            const response = await fetch(`${this.baseURL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error en el inicio de sesión');
            }
            
            // Guardar tokens y tiempo de sesión (login)
            this.token = data.tokens.access;
            this.refreshToken = data.tokens.refresh;
            this.user = data.user;
            this.lastActivity = Date.now();
            
            localStorage.setItem('vitaguard_token', this.token);
            localStorage.setItem('vitaguard_refresh_token', this.refreshToken);
            localStorage.setItem('vitaguard_user', JSON.stringify(this.user));
            localStorage.setItem('vitaguard_login_time', this.lastActivity.toString());
            localStorage.setItem('vitaguard_last_activity', this.lastActivity.toString());
            
            // Configurar sesión persistente
            this.setupAutoRefresh();
            this.setupActivityTracking();
            
            this.onAuthChange?.(true, this.user);
            
            return data;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }
    
    async logout() {
        try {
            if (this.token) {
                await fetch(`${this.baseURL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
            }
        } catch (error) {
            console.error('Error en logout:', error);
        } finally {
            // Limpiar datos locales y temporizadores
            this.token = null;
            this.refreshToken = null;
            this.user = null;
            this.lastActivity = 0;
            
            // Limpiar intervalos
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
                this.refreshInterval = null;
            }
            
            localStorage.removeItem('vitaguard_token');
            localStorage.removeItem('vitaguard_refresh_token');
            localStorage.removeItem('vitaguard_user');
            localStorage.removeItem('vitaguard_login_time');
            localStorage.removeItem('vitaguard_last_activity');
            
            this.onAuthChange?.(false, null);
        }
    }
    
    async verifyToken() {
        if (!this.token) {
            throw new Error('No hay token');
        }
        
        try {
            const response = await fetch(`${this.baseURL}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Token inválido');
            }
            
            this.user = data.user;
            localStorage.setItem('vitaguard_user', JSON.stringify(this.user));
            
            return data;
        } catch (error) {
            console.error('Error al verificar token:', error);
            throw error;
        }
    }
    
    async refreshAccessToken() {
        if (!this.refreshToken) {
            throw new Error('No hay token de refresco');
        }
        
        try {
            const response = await fetch(`${this.baseURL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    refreshToken: this.refreshToken
                })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Error al renovar token');
            }
            
            this.token = data.tokens.access;
            localStorage.setItem('vitaguard_token', this.token);
            
            return data;
        } catch (error) {
            console.error('Error al renovar token:', error);
            // Si falla la renovación, hacer logout
            await this.logout();
            throw error;
        }
    }
    
    // ============================================
    // MÉTODOS DE PUNTUACIONES
    // ============================================
    
    async submitScore(scoreData) {
        try {
            console.log('🎮 Enviando puntuación:', scoreData);
            
            // Validar datos antes de enviar
            if (!scoreData.level_type || !scoreData.score || scoreData.time_taken === undefined) {
                throw new Error('Datos de puntuación incompletos');
            }
            
            const response = await this.authenticatedFetch('/scores/submit', {
                method: 'POST',
                body: JSON.stringify(scoreData)
            });
            
            const result = await response.json();
            console.log('✅ Puntuación enviada exitosamente:', result);
            
            // Si la puntuación se guardó exitosamente, actualizar datos del usuario
            if (result.user) {
                this.updateUserData(result.user);
            }
            
            return result;
        } catch (error) {
            console.error('❌ Error al enviar puntuación:', error);
            
            // NO mostrar notificación de error - manejado por el juego
            // Solo registrar en consola para debugging
            
            throw error;
        }
    }
    
    // Actualizar datos del usuario en localStorage
    updateUserData(userData) {
        const currentUser = this.getUser();
        if (currentUser) {
            // Actualizar datos relevantes
            currentUser.total_score = userData.total_score;
            currentUser.games_played = userData.games_played;
            currentUser.levels_completed = userData.levels_completed;
            
            // Guardar en localStorage
            localStorage.setItem('user', JSON.stringify(currentUser));
            
            // Disparar evento de actualización
            window.dispatchEvent(new CustomEvent('userDataUpdated', { 
                detail: currentUser 
            }));
            
            console.log('✅ Datos de usuario actualizados:', currentUser);
        }
    }
    
    async getLeaderboard(levelType = null, limit = 50) {
        try {
            const params = new URLSearchParams();
            if (levelType) params.append('level_type', levelType);
            if (limit) params.append('limit', limit.toString());
            
            const response = await fetch(`${this.baseURL}/scores/leaderboard?${params}`);
            
            if (!response.ok) {
                throw new Error('Error al obtener ranking');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error al obtener leaderboard:', error);
            throw error;
        }
    }
    
    async getUserScores(userId = null, limit = 20) {
        try {
            const endpoint = userId ? `/scores/user/${userId}` : '/scores/user';
            const params = new URLSearchParams();
            if (limit) params.append('limit', limit.toString());
            
            const response = await this.authenticatedFetch(`${endpoint}?${params}`);
            
            return await response.json();
        } catch (error) {
            console.error('Error al obtener puntuaciones del usuario:', error);
            throw error;
        }
    }
    
    async getBestScore(levelType) {
        try {
            const response = await this.authenticatedFetch(`/scores/best/${levelType}`);
            return await response.json();
        } catch (error) {
            console.error('Error al obtener mejor puntuación:', error);
            throw error;
        }
    }
    
    async getGameStats() {
        try {
            const response = await fetch(`${this.baseURL}/scores/stats`);
            
            if (!response.ok) {
                throw new Error('Error al obtener estadísticas');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            throw error;
        }
    }
    
    // ============================================
    // MÉTODOS AUXILIARES
    // ============================================
    
    async authenticatedFetch(endpoint, options = {}) {
        if (!this.token) {
            throw new Error('Usuario no autenticado');
        }
        
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            }
        };
        
        const mergedOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers
            }
        };
        
        try {
            console.log(`🔄 Realizando petición autenticada a: ${this.baseURL}${endpoint}`);
            const response = await fetch(`${this.baseURL}${endpoint}`, mergedOptions);
            
            console.log(`📡 Respuesta recibida: ${response.status} ${response.statusText}`);
            
            // Si el token expiró, intentar renovar
            if (response.status === 401) {
                console.log('🔄 Token expirado, intentando renovar...');
                try {
                    await this.refreshAccessToken();
                    
                    // Reintentar la petición con el nuevo token
                    mergedOptions.headers.Authorization = `Bearer ${this.token}`;
                    console.log('🔄 Reintentando petición con nuevo token...');
                    const retryResponse = await fetch(`${this.baseURL}${endpoint}`, mergedOptions);
                    
                    if (!retryResponse.ok) {
                        const errorData = await retryResponse.json().catch(() => ({ message: 'Error desconocido' }));
                        throw new Error(errorData.message || 'Error en la petición después de renovar token');
                    }
                    
                    return retryResponse;
                } catch (refreshError) {
                    console.error('❌ Error renovando token:', refreshError);
                    await this.logout();
                    throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
                }
            }
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `Error HTTP ${response.status}` }));
                console.error('❌ Error en respuesta:', errorData);
                throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
            }
            
            return response;
        } catch (error) {
            if (error.name === 'TypeError' && error.message.includes('fetch')) {
                console.error('❌ Error de red - servidor no disponible');
                throw new Error('No se pudo conectar con el servidor. Verifica tu conexión a internet.');
            }
            
            console.error('❌ Error en petición autenticada:', error);
            throw error;
        }
    }
    
    // Getters
    isAuthenticated() {
        return !!this.token && !!this.user;
    }
    
    getUser() {
        return this.user;
    }
    
    // Callback para cambios de autenticación
    onAuthChange = null;
    
    // Establecer callback para cambios de autenticación
    setAuthChangeCallback(callback) {
        this.onAuthChange = callback;
    }
}

// ============================================
// INSTANCIA GLOBAL
// ============================================

window.authClient = new AuthClient();

// ============================================
// UTILIDADES DE UI
// ============================================

class UIManager {
    static showNotification(message, type = 'info', duration = 5000) {
        // Crear elemento de notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Agregar estilos si no existen
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    max-width: 400px;
                    padding: 15px 20px;
                    border-radius: 8px;
                    color: white;
                    font-family: Arial, sans-serif;
                    z-index: 10000;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    animation: slideIn 0.3s ease-out;
                }
                
                .notification-info { background: #2196F3; }
                .notification-success { background: #4CAF50; }
                .notification-warning { background: #FF9800; }
                .notification-error { background: #F44336; }
                
                .notification-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    margin-left: 10px;
                }
                
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Agregar al DOM
        document.body.appendChild(notification);
        
        // Manejar cierre
        const closeBtn = notification.querySelector('.notification-close');
        const closeNotification = () => {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        };
        
        closeBtn.onclick = closeNotification;
        
        // Auto cerrar
        if (duration > 0) {
            setTimeout(closeNotification, duration);
        }
        
        return notification;
    }
    
    static showLoading(message = 'Cargando...') {
        const loader = document.createElement('div');
        loader.id = 'global-loader';
        loader.innerHTML = `
            <div class="loader-backdrop">
                <div class="loader-content">
                    <div class="loader-spinner"></div>
                    <p class="loader-message">${message}</p>
                </div>
            </div>
        `;
        
        // Agregar estilos si no existen
        if (!document.querySelector('#loader-styles')) {
            const styles = document.createElement('style');
            styles.id = 'loader-styles';
            styles.textContent = `
                .loader-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10001;
                }
                
                .loader-content {
                    text-align: center;
                    color: white;
                }
                
                .loader-spinner {
                    width: 50px;
                    height: 50px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #2196F3;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 20px;
                }
                
                .loader-message {
                    font-family: Arial, sans-serif;
                    font-size: 16px;
                    margin: 0;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(loader);
        return loader;
    }
    
    static hideLoading() {
        const loader = document.querySelector('#global-loader');
        if (loader) {
            loader.parentNode.removeChild(loader);
        }
    }
}

// Hacer UIManager disponible globalmente
window.UIManager = UIManager;