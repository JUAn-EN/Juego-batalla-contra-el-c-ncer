// ============================================
// ANIMACIONES - VITAGUARD HEROES
// ============================================

class GameAnimations {
    constructor() {
        this.loadingScreen = document.getElementById('loading-screen');
        this.mainMenu = document.getElementById('main-menu');
        this.particles = document.querySelectorAll('.particle');
        this.cancerCards = document.querySelectorAll('.cancer-card');
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.healthTipElement = document.getElementById('health-tip-text');
        
        this.healthTips = [
            "💡 Consejo del día: La detección temprana salva vidas. ¡Hazte chequeos regulares!",
            "🏃‍♂️ Mantente activo: 30 minutos de ejercicio diario reducen el riesgo de cáncer.",
            "🥗 Come saludable: Una dieta rica en frutas y verduras fortalece tu sistema inmune.",
            "🚭 Evita el tabaco: Es la causa principal del cáncer de pulmón y otros tipos.",
            "☀️ Protégete del sol: Usa protector solar para prevenir el cáncer de piel.",
            "🔍 Conoce tu cuerpo: Los autoexámenes pueden detectar cambios importantes.",
            "👨‍⚕️ Consulta al médico: Las revisiones anuales son tu mejor defensa.",
            "💤 Duerme bien: 7-8 horas de sueño fortalecen tu sistema inmunológico.",
            "🧘‍♀️ Reduce el estrés: La meditación y relajación mejoran tu salud general.",
            "💧 Hidrátate: Beber suficiente agua ayuda a eliminar toxinas del cuerpo."
        ];
        
        this.currentTipIndex = 0;
        
        // Verificar si estamos en una página de juego donde no hay menú principal
        if (!this.loadingScreen && !this.mainMenu) {
            console.log('Página de juego detectada - saltando animaciones del menú principal');
            return;
        }
        
        this.init();
    }
    
    init() {
        // Solo inicializar elementos que existen
        if (this.loadingScreen) {
            this.initLoadingScreen();
        }
        
        if (this.particles.length > 0) {
            this.initParticleAnimations();
        }
        
        if (this.cancerCards.length > 0) {
            this.initCardAnimations();
        }
        
        if (this.navButtons.length > 0) {
            this.initButtonAnimations();
        }
        
        if (this.healthTipElement) {
            this.initHealthTips();
        }
        
        this.initScrollAnimations();
    }
    
    // ============================================
    // PANTALLA DE CARGA
    // ============================================
    
    initLoadingScreen() {
        let progress = 0;
        const progressBar = document.querySelector('.loading-progress');
        const loadingTexts = [
            "Iniciando sistemas de prevención...",
            "Cargando base de datos médica...",
            "Preparando misiones de salud...",
            "Activando modo héroe...",
            "¡Listo para salvar vidas!"
        ];
        
        const loadingTextElement = document.querySelector('.loading-container p');
        let textIndex = 0;
        
        // Verificar que los elementos existen antes de usarlos
        if (!progressBar || !loadingTextElement) {
            console.warn('Elementos de loading no encontrados, saltando animaciones de carga');
            setTimeout(() => {
                this.showMainMenu();
            }, 1000);
            return;
        }
        
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15 + 5;
            
            if (progress > 100) {
                progress = 100;
            }
            
            if (progressBar) {
                progressBar.style.width = progress + '%';
            }
            
            // Cambiar texto de carga
            if (Math.random() > 0.7 && textIndex < loadingTexts.length - 1 && loadingTextElement) {
                textIndex++;
                loadingTextElement.textContent = loadingTexts[textIndex];
                loadingTextElement.classList.add('animate-fade-in');
                
                setTimeout(() => {
                    if (loadingTextElement) {
                        loadingTextElement.classList.remove('animate-fade-in');
                    }
                }, 500);
            }
            
            if (progress >= 100) {
                clearInterval(loadingInterval);
                if (loadingTextElement) {
                    loadingTextElement.textContent = loadingTexts[loadingTexts.length - 1];
                }
                
                setTimeout(() => {
                    this.showMainMenu();
                }, 1000);
            }
        }, 100);
    }
    
    showMainMenu() {
        // Verificar que los elementos existen antes de manipularlos
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('animate-fade-out');
        }
        
        setTimeout(() => {
            if (this.loadingScreen) {
                this.loadingScreen.classList.add('hidden');
            }
            if (this.mainMenu) {
                this.mainMenu.classList.remove('hidden');
                this.mainMenu.classList.add('animate-fade-in');
                
                // Animar elementos del menú secuencialmente
                this.animateMenuElements();
            } else {
                console.warn('Elemento main-menu no encontrado');
            }
        }, 500);
    }
    
    animateMenuElements() {
        const elements = [
            document.querySelector('.game-header'),
            document.querySelector('.hero-content h2'),
            document.querySelector('.hero-description'),
            document.querySelector('.cancer-types-preview'),
            document.querySelector('.main-navigation'),
            document.querySelector('.game-footer')
        ];
        
        elements.forEach((element, index) => {
            if (element) {
                setTimeout(() => {
                    element.classList.add('animate-slide-up');
                }, index * 200);
            }
        });
        
        // Animar tarjetas de cáncer
        setTimeout(() => {
            this.cancerCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('animate-bounce-in');
                }, index * 150);
            });
        }, 800);
        
        // Animar botones de navegación
        setTimeout(() => {
            this.navButtons.forEach((button, index) => {
                setTimeout(() => {
                    button.classList.add('animate-slide-up');
                }, index * 100);
            });
        }, 1200);
    }
    
    // ============================================
    // ANIMACIONES DE PARTÍCULAS
    // ============================================
    
    initParticleAnimations() {
        this.particles.forEach((particle, index) => {
            // Posición aleatoria inicial
            this.randomizeParticlePosition(particle);
            
            // Animación continua
            setInterval(() => {
                this.animateParticle(particle);
            }, 6000 + (index * 1000));
        });
        
        // Crear partículas adicionales dinámicamente
        setInterval(() => {
            this.createTemporaryParticle();
        }, 8000);
    }
    
    randomizeParticlePosition(particle) {
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        particle.style.left = x + '%';
        particle.style.top = y + '%';
    }
    
    animateParticle(particle) {
        const animations = ['particleFloat1', 'particleFloat2', 'particleFloat3'];
        const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
        
        particle.style.animation = `${randomAnimation} 6s ease-in-out infinite`;
        
        // Cambiar posición gradualmente
        setTimeout(() => {
            this.randomizeParticlePosition(particle);
        }, 3000);
    }
    
    createTemporaryParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.background = `rgba(${Math.random() * 255}, ${Math.random() * 255}, 255, 0.6)`;
        
        this.randomizeParticlePosition(particle);
        document.querySelector('.particles-bg').appendChild(particle);
        
        // Animar y eliminar después de un tiempo
        setTimeout(() => {
            particle.style.animation = 'fadeOut 2s ease-out forwards';
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }, 6000);
    }
    
    // ============================================
    // ANIMACIONES DE TARJETAS
    // ============================================
    
    initCardAnimations() {
        this.cancerCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card, true);
            });
            
            card.addEventListener('mouseleave', () => {
                this.animateCardHover(card, false);
            });
            
            card.addEventListener('click', () => {
                this.animateCardClick(card);
            });
        });
    }
    
    animateCardHover(card, isHover) {
        const icon = card.querySelector('.card-icon i');
        const difficulty = card.querySelector('.difficulty');
        
        if (isHover) {
            icon.style.animation = 'pulse 0.5s ease-in-out';
            difficulty.style.animation = 'bounce 0.5s ease-in-out';
            
            // Efecto de brillo
            card.style.boxShadow = `0 15px 35px rgba(72, 202, 228, 0.3)`;
        } else {
            icon.style.animation = '';
            difficulty.style.animation = '';
            card.style.boxShadow = '';
        }
    }
    
    animateCardClick(card) {
        card.style.animation = 'cardFlip 0.6s ease-in-out';
        
        // Efecto de selección
        setTimeout(() => {
            card.style.transform = 'scale(1.05)';
            card.style.boxShadow = '0 20px 40px rgba(6, 214, 160, 0.4)';
            
            setTimeout(() => {
                card.style.transform = '';
                card.style.boxShadow = '';
                card.style.animation = '';
            }, 200);
        }, 300);
    }
    
    // ============================================
    // ANIMACIONES DE BOTONES
    // ============================================
    
    initButtonAnimations() {
        this.navButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                this.animateButtonHover(button, true);
            });
            
            button.addEventListener('mouseleave', () => {
                this.animateButtonHover(button, false);
            });
            
            button.addEventListener('click', () => {
                this.animateButtonClick(button);
            });
        });
    }
    
    animateButtonHover(button, isHover) {
        const icon = button.querySelector('i');
        
        if (isHover) {
            if (icon) {
                icon.style.animation = 'iconBounce 0.5s ease-in-out';
            }
            
            // Efecto de pulso para el botón principal
            if (button.classList.contains('primary')) {
                button.style.animation = 'pulse 1s ease-in-out infinite';
            }
        } else {
            if (icon) {
                icon.style.animation = '';
            }
            button.style.animation = '';
        }
    }
    
    animateButtonClick(button) {
        button.style.animation = 'buttonPress 0.3s ease-in-out';
        
        // Crear efecto de ondas
        this.createRippleEffect(button, event);
        
        setTimeout(() => {
            button.style.animation = '';
        }, 300);
    }
    
    createRippleEffect(button, event) {
        const ripple = document.createElement('div');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = (event ? event.clientX : rect.left + rect.width / 2) - rect.left - size / 2;
        const y = (event ? event.clientY : rect.top + rect.height / 2) - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: ripple 0.6s ease-out;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    // ============================================
    // CONSEJOS DE SALUD ROTATIVOS
    // ============================================
    
    initHealthTips() {
        if (!this.healthTipElement) return;
        
        setInterval(() => {
            this.rotateHealthTip();
        }, 8000);
    }
    
    rotateHealthTip() {
        this.healthTipElement.style.animation = 'fadeOut 0.5s ease-out';
        
        setTimeout(() => {
            this.currentTipIndex = (this.currentTipIndex + 1) % this.healthTips.length;
            this.healthTipElement.textContent = this.healthTips[this.currentTipIndex];
            this.healthTipElement.style.animation = 'fadeIn 0.5s ease-in';
        }, 500);
    }
    
    // ============================================
    // ANIMACIONES DE SCROLL
    // ============================================
    
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                }
            });
        }, observerOptions);
        
        // Observar elementos que aparecen al hacer scroll
        document.querySelectorAll('.cancer-card, .nav-btn, .footer-link').forEach(el => {
            observer.observe(el);
        });
    }
    
    // ============================================
    // EFECTOS ESPECIALES
    // ============================================
    
    createConfettiEffect() {
        const colors = ['#f72585', '#48cae4', '#06d6a0', '#ffb703', '#e63946'];
        const confettiContainer = document.createElement('div');
        confettiContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        
        document.body.appendChild(confettiContainer);
        
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    left: ${Math.random() * 100}%;
                    animation: confetti 3s ease-out forwards;
                `;
                
                confettiContainer.appendChild(confetti);
                
                setTimeout(() => {
                    if (confetti.parentNode) {
                        confetti.parentNode.removeChild(confetti);
                    }
                }, 3000);
            }, i * 50);
        }
        
        setTimeout(() => {
            if (confettiContainer.parentNode) {
                confettiContainer.parentNode.removeChild(confettiContainer);
            }
        }, 4000);
    }
    
    showLevelUpEffect() {
        const levelUpDiv = document.createElement('div');
        levelUpDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(45deg, #06d6a0, #48cae4);
                color: white;
                padding: 2rem;
                border-radius: 1rem;
                text-align: center;
                font-size: 2rem;
                font-weight: bold;
                z-index: 9999;
                animation: levelUp 2s ease-out;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            ">
                <i class="fas fa-star" style="color: #ffb703; margin-right: 0.5rem;"></i>
                ¡Nivel Completado!
                <i class="fas fa-star" style="color: #ffb703; margin-left: 0.5rem;"></i>
            </div>
        `;
        
        document.body.appendChild(levelUpDiv);
        
        setTimeout(() => {
            if (levelUpDiv.parentNode) {
                levelUpDiv.parentNode.removeChild(levelUpDiv);
            }
        }, 2000);
    }
}

// Añadir estilos de animación dinámicos
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        0% {
            transform: scale(0);
            opacity: 1;
        }
        100% {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Inicializar animaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.gameAnimations = new GameAnimations();
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameAnimations;
}