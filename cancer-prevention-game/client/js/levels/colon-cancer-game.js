// ============================================
// JUEGO DE CÁNCER DE COLON - NIVEL FINAL
// ============================================

class ColonCancerGame {
    constructor() {
        console.log('🎮 Inicializando Centro de Prevención del Colon...');
        
        this.currentPhase = 'intro';
        this.score = 0;
        this.lives = 3;
        this.gameTime = 480; // 8 minutos
        this.isPaused = false;
        this.timer = null;
        this.startTime = null;
        this.gameOverByLoss = false;
        
        // Progress tracking
        this.phaseProgress = {
            riskFactors: { completed: 0, total: 12, perfect: true },
            colonoscopy: { completed: 0, total: 5, perfect: true },
            polyps: { completed: 0, total: 8, perfect: true },
            diet: { completed: 0, total: 15, perfect: true },
            symptoms: { completed: 0, total: 10, perfect: true },
            screening: { completed: false, perfect: true }
        };
        
        this.achievements = [];
        this.draggedElement = null;
        this.currentPolypIndex = 0;
        this.currentCaseIndex = 0;
        this.currentScenarioIndex = 0;
        this.plateScore = 0;
        this.colonPosition = 0;
        
        this.init();
    }
    
    init() {
        console.log('🏥 Configurando Centro de Prevención del Colon...');
        
        // Event listeners
        document.getElementById('start-game').addEventListener('click', () => this.startGame());
        document.getElementById('pause-btn').addEventListener('click', () => this.togglePause());
        document.getElementById('retry-btn')?.addEventListener('click', () => location.reload());
        document.getElementById('menu-btn')?.addEventListener('click', () => window.location.href = 'index.html');
        
        // Hide loading screen
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
        }, 2000);
    }
    
    startGame() {
        console.log('🚀 Iniciando nivel de colon...');
        this.startTime = Date.now();
        this.startTimer();
        this.showPhase('risk-factors');
        this.initRiskFactorsPhase();
    }
    
    showPhase(phaseName) {
        document.querySelectorAll('.game-phase').forEach(phase => {
            phase.classList.remove('active');
        });
        
        const phase = document.getElementById(`${phaseName}-phase`);
        if (phase) {
            phase.classList.add('active');
            this.currentPhase = phaseName;
        }
    }
    
    // ============================================
    // FASE 1: FACTORES DE RIESGO
    // ============================================
    
    initRiskFactorsPhase() {
        console.log('⚖️ Iniciando fase de factores de riesgo...');
        this.createRiskItems();
        this.setupRiskDragDrop();
        this.setupContinueButton();
        this.updateProgress('risk');
        
        // DETECTAR BOTÓN CADA MEDIO SEGUNDO - SÚPER AGRESIVO
        this.completionChecker = setInterval(() => {
            const progressElement = document.getElementById('risk-progress');
            const floatingButton = document.getElementById('floating-continue');
            
            if (progressElement && floatingButton) {
                const progressText = progressElement.textContent.trim();
                const isComplete = progressText === '12/12';
                const isButtonHidden = floatingButton.style.display === 'none' || 
                                      window.getComputedStyle(floatingButton).display === 'none';
                
                if (isComplete && isButtonHidden) {
                    console.log('🚨 FORZANDO BOTÓN: Progreso 12/12 detectado');
                    floatingButton.style.display = 'block';
                    floatingButton.style.visibility = 'visible';
                    floatingButton.style.opacity = '1';
                    floatingButton.style.zIndex = '99999';
                    
                    clearInterval(this.completionChecker);
                    this.completionChecker = null;
                }
            }
        }, 500);
        
        // Hacer la instancia global para debugging
        window.colonGame = this;
        
        // BOTÓN DE EMERGENCIA - SI NO APARECE EN 15 SEGUNDOS, FORZAR
        setTimeout(() => {
            const progressElement = document.getElementById('risk-progress');
            const floatingButton = document.getElementById('floating-continue');
            
            if (progressElement && progressElement.textContent === '12/12' && 
                floatingButton && floatingButton.style.display === 'none') {
                console.log('🚨 EMERGENCIA: Forzando botón después de 15s');
                floatingButton.style.display = 'block';
            }
        }, 15000);
        
        // Función global de emergencia manual
        window.showButton = () => {
            const floatingButton = document.getElementById('floating-continue');
            if (floatingButton) {
                floatingButton.style.display = 'block';
                console.log('🚨 BOTÓN FORZADO MANUALMENTE');
            }
        };
    }
    
    createRiskItems() {
        const container = document.getElementById('risk-items');
        if (!container) {
            console.error('❌ ERROR: No se encontró el contenedor risk-items');
            return;
        }
        container.innerHTML = '';
        
        // Mezclar factores
        const shuffled = [...COLON_DATA.riskFactors].sort(() => Math.random() - 0.5);
        console.log(`📦 Creando ${shuffled.length} elementos de riesgo:`, shuffled.map(f => f.name));
        
        shuffled.forEach(factor => {
            const item = document.createElement('div');
            item.className = 'risk-item';
            item.draggable = true;
            item.dataset.id = factor.id;
            item.dataset.type = factor.type;
            item.innerHTML = `
                <div class="item-icon">${factor.icon}</div>
                <div class="item-name">${factor.name}</div>
            `;
            
            item.addEventListener('dragstart', (e) => this.handleDragStart(e));
            item.addEventListener('dragend', (e) => this.handleDragEnd(e));
            
            container.appendChild(item);
        });
        
        console.log(`✅ ${container.children.length} elementos creados correctamente`);
    }
    
    setupRiskDragDrop() {
        const zones = document.querySelectorAll('.zone-content[data-zone]');
        zones.forEach(zone => {
            zone.addEventListener('dragover', (e) => this.handleDragOver(e));
            zone.addEventListener('drop', (e) => this.handleRiskDrop(e));
        });
    }
    
    handleDragStart(e) {
        this.draggedElement = e.target;
        e.target.classList.add('dragging');
    }
    
    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }
    
    handleDragOver(e) {
        e.preventDefault();
    }
    
    handleRiskDrop(e) {
        e.preventDefault();
        
        console.log('🎯 Drop detectado');
        
        if (!this.draggedElement) {
            console.warn('⚠️ No hay elemento siendo arrastrado');
            return;
        }
        
        const zone = e.target.closest('[data-zone]');
        if (!zone) {
            console.warn('⚠️ No se encontró zona válida');
            return;
        }
        
        const zoneType = zone.dataset.zone;
        const itemType = this.draggedElement.dataset.type;
        const itemId = this.draggedElement.dataset.id;
        
        console.log(`🧩 Evaluando: ${this.draggedElement.querySelector('.item-name').textContent} (tipo: ${itemType}) en zona: ${zoneType}`);
        
        const factor = COLON_DATA.riskFactors.find(f => f.id === itemId);
        console.log(`🔍 Buscando factor con ID: "${itemId}" - Encontrado:`, factor);
        
        if ((zoneType === 'protection' && itemType === 'protection') ||
            (zoneType === 'danger' && itemType === 'danger')) {
            // Correcto
            this.draggedElement.classList.add('correct');
            this.draggedElement.draggable = false;
            zone.appendChild(this.draggedElement);
            this.addScore(factor.points);
            this.showFeedback('✅ ¡Correcto! ' + factor.explanation, 'success');
            this.phaseProgress.riskFactors.completed++;
            this.updateProgress('risk');
            
            // Verificar si completó la fase (IGUAL QUE CERVICAL)
            if (this.phaseProgress.riskFactors.completed === this.phaseProgress.riskFactors.total) {
                setTimeout(() => this.completeRiskFactorsPhase(), 1000);
            }
        } else {
            // Incorrecto
            this.loseLife();
            this.phaseProgress.riskFactors.perfect = false;
            this.showFeedback('❌ Zona incorrecta. Intenta de nuevo.', 'error');
            console.log(`❌ Factor incorrecto: ${itemType} no va en ${zoneType}`);
        }
        
        this.draggedElement = null;
    }
    
    completeRiskFactorsPhase() {
        this.showFeedback('✅ ¡Fase de Factores de Riesgo completada! Iniciando Colonoscopía...', 'success');
        
        if (this.phaseProgress.riskFactors.perfect) {
            this.unlockAchievement('risk_master');
            this.addScore(500);
        }
        
        setTimeout(() => {
            this.showPhase('colonoscopy');
            this.initColonoscopyPhase();
        }, 2000);
    }
    
    setupContinueButton() {
        const button = document.getElementById('continue-to-colonoscopy');
        if (button) {
            button.addEventListener('click', () => {
                console.log('🚀 ¡AVANZANDO A COLONOSCOPÍA!');
                
                // Limpiar cualquier timer
                if (this.completionChecker) {
                    clearInterval(this.completionChecker);
                }
                
                // Cambiar fases directamente
                document.querySelectorAll('.game-phase').forEach(phase => {
                    phase.classList.remove('active');
                });
                
                const colonoscopyPhase = document.getElementById('colonoscopy-phase');
                if (colonoscopyPhase) {
                    colonoscopyPhase.classList.add('active');
                    this.currentPhase = 'colonoscopy';
                    console.log('✅ ¡COLONOSCOPÍA INICIADA!');
                }
            });
        }
    }
    
    showContinueButton() {
        const button = document.getElementById('continue-to-colonoscopy');
        if (button) {
            button.disabled = false;
            button.classList.remove('disabled');
            button.innerHTML = `
                <i class="fas fa-microscope"></i>
                <span>Continuar a Colonoscopía</span>
                <i class="fas fa-arrow-right"></i>
            `;
            console.log('✅ Botón habilitado - Todas las tarjetas colocadas');
        }
    }
    
    // Función de emergencia para contar elementos colocados
    checkCompletionManually() {
        try {
            // Verificar por múltiples métodos
            const protectionZone = document.querySelector('[data-zone="protection"]');
            const dangerZone = document.querySelector('[data-zone="danger"]');
            
            const protectionCount = protectionZone ? protectionZone.children.length : 0;
            const dangerCount = dangerZone ? dangerZone.children.length : 0;
            const total = protectionCount + dangerCount;
            
            // También verificar por el progreso visual 
            const progressElement = document.getElementById('risk-progress');
            const progressText = progressElement ? progressElement.textContent : '0/12';
            
            console.log(`🔢 Verificación: DOM=${total}, Progreso=${progressText}`);
            
            // Si detecta 12 elementos colocados o progreso 12/12, MOSTRAR BOTÓN
            if (total >= 12 || progressText === '12/12') {
                console.log('🎯 ¡COMPLETITUD DETECTADA! Mostrando botón verde...');
                
                const floatingButton = document.getElementById('floating-continue');
                if (floatingButton) {
                    floatingButton.style.display = 'block';
                    console.log('✅ ¡BOTÓN VERDE VISIBLE!');
                }
                
                // Detener el checker
                if (this.completionChecker) {
                    clearInterval(this.completionChecker);
                    this.completionChecker = null;
                }
                
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('❌ Error en checkCompletionManually:', error);
            // En caso de error, forzar habilitación si el progreso dice 12/12
            const progressElement = document.getElementById('risk-progress');
            if (progressElement && progressElement.textContent === '12/12') {
                this.forceShowContinueButton();
            }
            return false;
        }
    }
    
    // Función para habilitar el botón cuando se completa
    forceShowContinueButton() {
        console.log('🎯 ¡12 elementos colocados! Habilitando botón...');
        const button = document.getElementById('continue-to-colonoscopy');
        if (button) {
            button.disabled = false;
            button.classList.remove('disabled');
            button.innerHTML = `
                <i class="fas fa-microscope"></i>
                <span>Continuar a Colonoscopía</span>
                <i class="fas fa-arrow-right"></i>
            `;
            console.log('✅ Botón habilitado - Listo para continuar');
        }
    }
    
    // ============================================
    // FASE 2: COLONOSCOPÍA VIRTUAL
    // ============================================
    
    initColonoscopyPhase() {
        console.log('🔬 Iniciando colonoscopía virtual...');
        this.colonPosition = 0;
        this.phaseProgress.colonoscopy.completed = 0; // Resetear contador
        this.setupColonCanvas();
        this.setupNavigationControls();
        this.updateSectionInfo();
        this.updateProgress('colonoscopy');
    }
    
    setupColonCanvas() {
        const canvas = document.getElementById('colon-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;
        
        this.colonCanvas = canvas;
        this.colonCtx = ctx;
        this.drawColonView();
    }
    
    drawColonView() {
        const ctx = this.colonCtx;
        const canvas = this.colonCanvas;
        const section = COLON_DATA.colonSections[this.colonPosition];
        
        // Limpiar canvas
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        // Vista de cámara endoscópica - círculo negro como visor
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(0, 0, 200, 0, Math.PI * 2);
        ctx.fill();
        
        // Borde del visor de la cámara
        ctx.strokeStyle = '#ff6b9d';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(0, 0, 200, 0, Math.PI * 2);
        ctx.stroke();
        
        // Dibujar tejido según la sección actual (CONSISTENTE)
        // Usar posición como semilla para patrones fijos
        const seed = this.colonPosition + 1;
        
        if (section.healthStatus === 'normal') {
            // Tejido sano - textura rosada suave FIJA
            ctx.fillStyle = '#ffb6c1';
            for (let i = 0; i < 15; i++) {
                const angle = (i * 0.4 + seed * 0.3) % (Math.PI * 2);
                const radius = 60 + (i * 8) % 120;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                ctx.beginPath();
                ctx.arc(x, y, 8 + (i * 2) % 8, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Textura adicional para que se vea más real
            ctx.fillStyle = '#ffc1cc';
            for (let i = 0; i < 8; i++) {
                const angle = (i * 0.8 + seed * 0.5) % (Math.PI * 2);
                const radius = 80 + (i * 12) % 100;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                ctx.beginPath();
                ctx.arc(x, y, 4, 0, Math.PI * 2);
                ctx.fill();
            }
            
        } else if (section.healthStatus === 'polyp') {
            // Tejido con pólipo - FIJO
            // Tejido normal primero
            ctx.fillStyle = '#ffb6c1';
            for (let i = 0; i < 10; i++) {
                const angle = (i * 0.6 + seed * 0.4) % (Math.PI * 2);
                const radius = 40 + (i * 10) % 100;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                ctx.beginPath();
                ctx.arc(x, y, 6, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Pólipo - área irregular roja FIJA
            ctx.fillStyle = '#ff4757';
            ctx.beginPath();
            ctx.arc(50, -30, 25, 0, Math.PI * 2);
            ctx.fill();
            
            // Textura del pólipo más detallada
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(45, -35, 15, 0, Math.PI * 2);
            ctx.fill();
            
            // Borde del pólipo
            ctx.strokeStyle = '#c0392b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(50, -30, 25, 0, Math.PI * 2);
            ctx.stroke();
            
        } else if (section.healthStatus === 'inflammation') {
            // Tejido inflamado - FIJO
            // Tejido normal primero
            ctx.fillStyle = '#ffb6c1';
            for (let i = 0; i < 8; i++) {
                const angle = (i * 0.7 + seed * 0.6) % (Math.PI * 2);
                const radius = 50 + (i * 15) % 130;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                ctx.beginPath();
                ctx.arc(x, y, 5, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Áreas inflamadas - rojizas dispersas
            ctx.fillStyle = '#ff7675';
            for (let i = 0; i < 6; i++) {
                const angle = (i * 1.0 + seed * 0.8) % (Math.PI * 2);
                const radius = 70 + (i * 20) % 110;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                ctx.beginPath();
                ctx.arc(x, y, 12, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        // Información de la sección en el canvas
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(section.name, 0, -240);
        
        ctx.font = '14px Arial';
        ctx.fillText(`Sección ${this.colonPosition + 1} de 5`, 0, 240);
        
        ctx.restore();
    }
    
    setupNavigationControls() {
        document.getElementById('nav-forward').addEventListener('click', () => this.navigateColon());
        document.getElementById('examine-section').addEventListener('click', () => this.examineSection());
        
        // Hacer los botones de zoom más útiles - cambian la vista del colon
        document.getElementById('zoom-in').addEventListener('click', () => this.enhanceView());
        document.getElementById('zoom-out').addEventListener('click', () => this.normalView());
    }
    
    navigateColon() {
        if (this.colonPosition < 4) {
            this.colonPosition++;
            this.drawColonView();
            this.updateSectionInfo();
            this.showFeedback(`📍 Navegando a: ${COLON_DATA.colonSections[this.colonPosition].name}`, 'info');
        } else {
            this.showFeedback(`⚠️ Ya estás en la última sección. Examina todas las secciones para continuar.`, 'warning');
        }
    }
    
    updateSectionInfo() {
        const section = COLON_DATA.colonSections[this.colonPosition];
        
        // Mapear estados de salud a descripciones claras
        const statusMap = {
            'normal': '✅ Tejido normal',
            'polyp': '🔴 Pólipo detectado',
            'inflammation': '🟡 Inflamación presente'
        };
        
        // Actualizar información de la sección
        const sectionInfo = document.querySelector('.section-info') || document.getElementById('current-section');
        if (sectionInfo) {
            sectionInfo.innerHTML = `
                <h3>Sección: ${section.name}</h3>
                <p>${section.description}</p>
                <p><strong>Estado:</strong> ${statusMap[section.healthStatus] || '⚠️ Anomalía'}</p>
            `;
        }
        
        // También actualizar el elemento de descripción si existe
        const descElement = document.getElementById('section-description');
        if (descElement) {
            descElement.textContent = section.description;
        }
    }
    
    examineSection() {
        const section = COLON_DATA.colonSections[this.colonPosition];
        
        // Verificar si ya examinó esta sección
        if (section.examined) {
            this.showFeedback('⚠️ Ya examinaste esta sección. Usa "Avanzar" para continuar.', 'warning');
            return;
        }
        
        // Marcar como examinada
        section.examined = true;
        
        this.addScore(section.points);
        this.showFeedback(`✅ ${section.name}: ${section.findings}`, 'success');
        
        // Agregar a hallazgos
        const findingsList = document.getElementById('findings-items');
        const li = document.createElement('li');
        li.innerHTML = `<strong>${section.name}:</strong> ${section.findings}`;
        findingsList.appendChild(li);
        
        this.phaseProgress.colonoscopy.completed++;
        this.updateProgress('colonoscopy');
        
        // Si no es la última posición, avanzar automáticamente después de examinar
        if (this.colonPosition < 4) {
            setTimeout(() => {
                this.navigateColon();
                this.showFeedback(`➡️ Avanzando a la siguiente sección...`, 'info');
            }, 2000);
        } else {
            // Es la última sección, completar fase
            setTimeout(() => this.completeColonoscopyyPhase(), 2000);
        }
    }
    
    enhanceView() {
        // Vista mejorada - destaca anomalías
        this.colonCanvas.style.filter = 'brightness(1.3) contrast(1.2)';
        this.colonCanvas.style.transform = 'scale(1.2)';
        this.showFeedback('🔍 Vista mejorada activada - Mejor visualización de anomalías', 'info');
    }
    
    normalView() {
        // Vista normal
        this.colonCanvas.style.filter = 'none';
        this.colonCanvas.style.transform = 'scale(1)';
        this.showFeedback('👁️ Vista normal restaurada', 'info');
    }
    
    completeColonoscopyyPhase() {
        if (this.phaseProgress.colonoscopy.perfect) {
            this.unlockAchievement('colonoscopy_expert');
            this.addScore(1000);
        }
        this.showFeedback('✅ ¡Colonoscopía completada!', 'success');
        setTimeout(() => {
            this.showPhase('polyps');
            this.initPolypsPhase();
        }, 1500);
    }
    
    // ============================================
    // FASE 3: DETECTOR DE PÓLIPOS
    // ============================================
    
    initPolypsPhase() {
        console.log('🔍 Iniciando detector de pólipos...');
        this.currentPolypIndex = 0;
        this.phaseProgress.polyps.completed = 0; // Resetear contador
        this.setupPolypCanvas();
        this.showCurrentPolyp();
        this.setupPolypControls();
        this.updateProgress('polyps');
    }
    
    setupPolypCanvas() {
        const canvas = document.getElementById('polyp-canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 600;
        canvas.height = 500;
        
        this.polypCanvas = canvas;
        this.polypCtx = ctx;
    }
    
    showCurrentPolyp() {
        const polyp = COLON_DATA.polyps[this.currentPolypIndex];
        this.drawPolyp(polyp);
        
        // Actualizar información
        document.getElementById('polyp-info').innerHTML = `
            <h4>${polyp.name}</h4>
            <p><strong>Tamaño:</strong> ${polyp.size}</p>
            <p><strong>Características:</strong> ${polyp.characteristics}</p>
        `;
    }
    
    drawPolyp(polyp) {
        const ctx = this.polypCtx;
        const canvas = this.polypCanvas;
        
        ctx.fillStyle = '#0f1419';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar pólipo según tipo
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        
        if (polyp.type === 'benign') {
            // Pólipo benigno - pequeño y regular
            ctx.fillStyle = '#ffb6c1';
            ctx.beginPath();
            ctx.arc(0, 0, 50, 0, Math.PI * 2);
            ctx.fill();
        } else if (polyp.type === 'precancerous') {
            // Precanceroso - más grande e irregular
            ctx.fillStyle = '#ff6b6b';
            ctx.beginPath();
            ctx.arc(0, 0, 80, 0, Math.PI * 2);
            ctx.fill();
            // Superficie irregular FIJA
            ctx.fillStyle = '#ff4757';
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 / 8) * i + polyp.id * 0.3; // Usar ID como semilla
                ctx.beginPath();
                ctx.arc(Math.cos(angle) * 60, Math.sin(angle) * 60, 15, 0, Math.PI * 2);
                ctx.fill();
            }
        } else {
            // Maligno - grande, irregular, oscuro
            ctx.fillStyle = '#8b0000';
            ctx.beginPath();
            ctx.arc(0, 0, 100, 0, Math.PI * 2);
            ctx.fill();
            // Necrosis central
            ctx.fillStyle = '#2d0000';
            ctx.beginPath();
            ctx.arc(0, 0, 50, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    setupPolypControls() {
        const buttons = document.querySelectorAll('.classify-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => this.classifyPolyp(btn.dataset.type));
        });
        
        document.getElementById('rotate-left').addEventListener('click', () => this.rotatePolyp(-15));
        document.getElementById('rotate-right').addEventListener('click', () => this.rotatePolyp(15));
    }
    
    classifyPolyp(classification) {
        const polyp = COLON_DATA.polyps[this.currentPolypIndex];
        
        if (classification === polyp.type) {
            this.addScore(polyp.points);
            this.showFeedback(`✅ Correcto! ${polyp.risk}`, 'success');
            this.phaseProgress.polyps.completed++;
            this.updateProgress('polyps');
            
            this.currentPolypIndex++;
            if (this.currentPolypIndex < COLON_DATA.polyps.length) {
                setTimeout(() => this.showCurrentPolyp(), 800);
            } else {
                setTimeout(() => this.completePolypsPhase(), 1000);
            }
        } else {
            this.loseLife();
            this.phaseProgress.polyps.perfect = false;
            this.showFeedback('❌ Clasificación incorrecta', 'error');
        }
    }
    
    rotatePolyp(degrees) {
        this.polypCanvas.style.transform = `rotate(${degrees}deg)`;
    }
    
    completePolypsPhase() {
        if (this.phaseProgress.polyps.perfect) {
            this.unlockAchievement('polyp_hunter');
            this.addScore(1000);
        }
        this.showFeedback('✅ ¡Fase de pólipos completada!', 'success');
        setTimeout(() => {
            this.showPhase('diet');
            this.initDietPhase();
        }, 1500);
    }
    
    // ============================================
    // FASE 4: DIETA SALUDABLE
    // ============================================
    
    initDietPhase() {
        console.log('🍎 Iniciando fase de nutrición...');
        this.plateScore = 0;
        this.phaseProgress.diet.completed = 0; // Resetear contador
        this.createFoodItems();
        this.setupPlateDragDrop();
        this.updateProgress('diet');
    }
    
    createFoodItems() {
        const container = document.getElementById('food-items');
        container.innerHTML = '';
        
        COLON_DATA.foods.forEach(food => {
            const item = document.createElement('div');
            item.className = 'food-item';
            item.draggable = true;
            item.dataset.id = food.id;
            item.dataset.category = food.category;
            item.dataset.score = food.healthScore;
            item.innerHTML = `
                <div class="food-icon">${food.icon}</div>
                <div class="food-name">${food.name}</div>
                <div class="food-score">${food.healthScore}</div>
            `;
            
            item.addEventListener('dragstart', (e) => this.handleDragStart(e));
            item.addEventListener('dragend', (e) => this.handleDragEnd(e));
            
            container.appendChild(item);
        });
    }
    
    setupPlateDragDrop() {
        const sections = document.querySelectorAll('.plate-section');
        sections.forEach(section => {
            section.addEventListener('dragover', (e) => this.handleDragOver(e));
            section.addEventListener('drop', (e) => this.handleFoodDrop(e));
        });
        
        document.getElementById('verify-plate').addEventListener('click', () => this.verifyPlate());
    }
    
    handleFoodDrop(e) {
        e.preventDefault();
        
        if (!this.draggedElement) return;
        
        const section = e.target.closest('.plate-section');
        const foodCategory = this.draggedElement.dataset.category;
        const sectionCategory = section.dataset.category;
        
        if (foodCategory === sectionCategory) {
            section.appendChild(this.draggedElement);
            this.draggedElement.classList.add('on-plate');
            const score = parseInt(this.draggedElement.dataset.score);
            this.plateScore += score;
            this.updatePlateScore();
            this.phaseProgress.diet.completed++;
            this.updateProgress('diet');
        } else {
            this.showFeedback('❌ Categoría incorrecta', 'error');
        }
    }
    
    updatePlateScore() {
        const maxScore = 100 * 15; // 15 alimentos máximo
        const percentage = Math.min((this.plateScore / maxScore) * 100, 100);
        document.getElementById('plate-score-fill').style.width = percentage + '%';
        document.getElementById('plate-score-text').textContent = Math.round(percentage) + '/100';
    }
    
    verifyPlate() {
        if (this.plateScore >= 1200) {
            this.addScore(this.plateScore);
            this.showFeedback('✅ ¡Plato saludable perfecto!', 'success');
            this.completeDietPhase();
        } else {
            this.showFeedback('⚠️ Mejora tu plato con más alimentos saludables', 'warning');
        }
    }
    
    completeDietPhase() {
        if (this.phaseProgress.diet.perfect) {
            this.unlockAchievement('nutrition_guru');
            this.addScore(800);
        }
        setTimeout(() => {
            this.showPhase('symptoms');
            this.initSymptomsPhase();
        }, 1500);
    }
    
    // ============================================
    // FASE 5: SÍNTOMAS CHECKER
    // ============================================
    
    initSymptomsPhase() {
        console.log('⚠️ Iniciando identificador de síntomas...');
        this.currentCaseIndex = 0;
        this.phaseProgress.symptoms.completed = 0; // Resetear contador
        this.showCurrentCase();
        this.setupSymptomsControls();
        this.updateProgress('symptoms');
    }
    
    showCurrentCase() {
        const caseData = COLON_DATA.symptomCases[this.currentCaseIndex];
        
        document.getElementById('case-number').textContent = this.currentCaseIndex + 1;
        document.getElementById('patient-info').innerHTML = `
            <p><strong>Edad:</strong> ${caseData.age} años</p>
            <p><strong>Género:</strong> ${caseData.gender}</p>
            <p><strong>Duración:</strong> ${caseData.duration}</p>
            <p><strong>Historial familiar:</strong> ${caseData.familyHistory ? 'Sí' : 'No'}</p>
        `;
        
        document.getElementById('symptoms-list').innerHTML = `
            <h4>Síntomas reportados:</h4>
            <ul>
                ${caseData.symptoms.map(s => `<li>${s}</li>`).join('')}
            </ul>
        `;
        
        // Medidor de urgencia
        const urgencyMeter = document.getElementById('urgency-meter');
        urgencyMeter.className = 'urgency-meter ' + caseData.urgencyLevel;
    }
    
    setupSymptomsControls() {
        const buttons = document.querySelectorAll('.action-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => this.evaluateCase(btn.dataset.action));
        });
    }
    
    evaluateCase(action) {
        const caseData = COLON_DATA.symptomCases[this.currentCaseIndex];
        
        if (action === caseData.correctAction) {
            this.addScore(caseData.points);
            this.showFeedback(`✅ Correcto! ${caseData.explanation}`, 'success');
            this.phaseProgress.symptoms.completed++;
            this.updateProgress('symptoms');
            
            this.currentCaseIndex++;
            if (this.currentCaseIndex < COLON_DATA.symptomCases.length) {
                setTimeout(() => this.showCurrentCase(), 1000);
            } else {
                setTimeout(() => this.completeSymptomsPhase(), 1000);
            }
        } else {
            this.loseLife();
            this.phaseProgress.symptoms.perfect = false;
            this.showFeedback('❌ Evaluación incorrecta', 'error');
        }
    }
    
    completeSymptomsPhase() {
        if (this.phaseProgress.symptoms.perfect) {
            this.unlockAchievement('symptom_detective');
            this.addScore(1000);
        }
        this.showFeedback('✅ ¡Fase de síntomas completada!', 'success');
        setTimeout(() => {
            this.showPhase('screening');
            this.initScreeningPhase();
        }, 1500);
    }
    
    // ============================================
    // FASE 6: CALENDARIO DE SCREENING
    // ============================================
    
    initScreeningPhase() {
        console.log('📅 Iniciando calendario de screening...');
        this.currentScenarioIndex = 0;
        this.showScreeningScenario();
        document.getElementById('verify-screening').addEventListener('click', () => this.verifyScreening());
    }
    
    showScreeningScenario() {
        const scenario = COLON_DATA.screeningScenarios[this.currentScenarioIndex];
        
        document.getElementById('screening-patient-info').innerHTML = `
            <p><strong>Edad:</strong> ${scenario.age} años</p>
            <p><strong>Historial familiar:</strong> ${scenario.familyHistory ? 'Sí' : 'No'}</p>
            <p><strong>Pólipos previos:</strong> ${scenario.previousPolyps ? 'Sí' : 'No'}</p>
            <p><strong>Factores de riesgo:</strong> ${scenario.riskFactors.join(', ') || 'Ninguno'}</p>
        `;
    }
    
    verifyScreening() {
        const scenario = COLON_DATA.screeningScenarios[this.currentScenarioIndex];
        const userAnswers = {
            firstScreening: document.getElementById('first-screening').value,
            frequency: document.getElementById('screening-frequency').value,
            additionalTests: document.getElementById('additional-tests').value,
            specialMonitoring: document.getElementById('special-monitoring').value
        };
        
        const correct = scenario.correctSchedule;
        let correctCount = 0;
        
        if (userAnswers.firstScreening === correct.firstScreening) correctCount++;
        if (userAnswers.frequency === correct.frequency) correctCount++;
        if (userAnswers.additionalTests === correct.additionalTests) correctCount++;
        if (userAnswers.specialMonitoring === correct.specialMonitoring) correctCount++;
        
        if (correctCount === 4) {
            this.addScore(scenario.points);
            this.phaseProgress.screening.completed = true;
            this.showFeedback('✅ ¡Plan de screening perfecto!', 'success');
            setTimeout(() => this.completeScreeningPhase(), 1500);
        } else {
            this.loseLife();
            this.phaseProgress.screening.perfect = false;
            this.showFeedback(`❌ ${correctCount}/4 correctas. Revisa el plan.`, 'error');
        }
    }
    
    completeScreeningPhase() {
        if (this.phaseProgress.screening.perfect) {
            this.unlockAchievement('screening_planner');
            this.addScore(500);
        }
        this.completeGame();
    }
    
    // ============================================
    // SISTEMA DE JUEGO
    // ============================================
    
    startTimer() {
        this.timer = setInterval(() => {
            if (!this.isPaused) {
                this.gameTime--;
                this.updateHUD();
                
                if (this.gameTime <= 0) {
                    this.timeUp();
                }
            }
        }, 1000);
    }
    
    updateHUD() {
        const minutes = Math.floor(this.gameTime / 60);
        const seconds = this.gameTime % 60;
        document.getElementById('timer').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('current-score').textContent = this.score;
    }
    
    updateProgress(phase) {
        // Mapear nombres cortos a nombres completos del objeto
        const phaseMap = {
            'risk': 'riskFactors',
            'colonoscopy': 'colonoscopy',
            'polyps': 'polyps',
            'diet': 'diet',
            'symptoms': 'symptoms',
            'screening': 'screening'
        };
        
        const phaseName = phaseMap[phase] || phase;
        const progress = this.phaseProgress[phaseName];
        
        if (!progress) {
            console.warn(`⚠️ Fase no encontrada: ${phase} (buscando ${phaseName})`);
            return;
        }
        
        let element;
        if (phase === 'risk') {
            element = document.getElementById('risk-progress');
        } else {
            element = document.getElementById(`${phase}-progress`);
        }
        
        if (element && progress.total) {
            element.textContent = `${progress.completed}/${progress.total}`;
        }
    }
    
    addScore(points) {
        this.score += points;
        this.updateHUD();
    }
    
    loseLife() {
        if (this.lives > 0) {
            this.lives--;
            const heart = document.getElementById(`heart${this.lives + 1}`);
            if (heart) {
                heart.classList.add('lost');
            }
            
            if (this.lives === 0) {
                this.gameOver();
            }
        }
    }
    
    showFeedback(message, type) {
        const feedback = document.createElement('div');
        feedback.className = `feedback-toast ${type}`;
        feedback.textContent = message;
        document.body.appendChild(feedback);
        
        setTimeout(() => feedback.classList.add('show'), 10);
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }
    
    unlockAchievement(achievementId) {
        if (!this.achievements.includes(achievementId)) {
            this.achievements.push(achievementId);
            const achievement = COLON_DATA.achievements.find(a => a.id === achievementId);
            if (achievement) {
                this.showFeedback(`🏆 ${achievement.name}!`, 'achievement');
            }
        }
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
    }
    
    timeUp() {
        clearInterval(this.timer);
        this.gameOver();
    }
    
    gameOver() {
        console.log('🎮 Game Over llamado');
        clearInterval(this.timer);
        this.gameOverByLoss = true;
        this.completeGame();
    }
    
    async completeGame() {
        console.log('🏆 Complete Game llamado');
        clearInterval(this.timer);
        
        const timeTaken = 480 - this.gameTime;
        
        // Bonificaciones
        if (!this.gameOverByLoss) {
            if (timeTaken < 360) {
                this.unlockAchievement('speed_champion');
                this.addScore(1500);
            }
            
            if (this.lives === 3) {
                this.unlockAchievement('perfect_game');
                this.addScore(2000);
            }
        }
        
        this.showVictoryScreen(timeTaken);
        
        // Guardar puntuación
        if (window.authClient && window.authClient.isAuthenticated()) {
            try {
                await this.submitScore(timeTaken);
                
                // Notificar completación del nivel si no fue por pérdida
                if (!this.gameOverByLoss) {
                    // Disparar evento de nivel completado
                    const levelCompletedEvent = new CustomEvent('level-completed', {
                        detail: {
                            levelType: 'colon',
                            score: this.score,
                            timeTaken: timeTaken,
                            isLastLevel: true
                        }
                    });
                    window.dispatchEvent(levelCompletedEvent);
                    
                    // Notificar al sistema de progresión
                    if (window.levelProgressionManager) {
                        window.levelProgressionManager.onLevelCompleted('colon', this.score);
                    }
                    
                    console.log('🎉 Evento de nivel completado disparado');
                }
                
            } catch (error) {
                console.error('Error guardando puntuación:', error);
            }
        }
    }
    
    showVictoryScreen(timeTaken) {
        const victoryTitle = document.querySelector('.victory-title');
        const trophyIcon = document.querySelector('.trophy-animation i');
        const nextLevelBtn = document.getElementById('next-level-btn');
        
        if (this.gameOverByLoss) {
            if (victoryTitle) {
                victoryTitle.textContent = '¡Nivel Fallido!';
                victoryTitle.style.color = '#ef4444';
            }
            if (trophyIcon) {
                trophyIcon.className = 'fas fa-times-circle';
                trophyIcon.style.color = '#ef4444';
            }
        } else {
            if (victoryTitle) {
                victoryTitle.textContent = '¡Centro Completado!';
            }
        }
        
        // Estadísticas
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-time').textContent = 
            `${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, '0')}`;
        
        const accuracy = Math.round((this.score / COLON_GAME_CONFIG.maxScore) * 100);
        document.getElementById('final-accuracy').textContent = `${accuracy}%`;
        
        // Rango
        const rank = COLON_GAME_CONFIG.ranks.find(r => this.score >= r.min);
        const rankElement = document.getElementById('final-rank');
        rankElement.textContent = rank.name;
        rankElement.style.color = rank.color;
        
        // Logros
        const achievementsList = document.getElementById('achievements-list');
        achievementsList.innerHTML = this.achievements.map(achId => {
            const ach = COLON_DATA.achievements.find(a => a.id === achId);
            if (!ach) return '';
            return `
                <div class="achievement-badge">
                    <span class="ach-icon">${ach.icon}</span>
                    <div class="ach-info">
                        <strong>${ach.name}</strong>
                        <p>${ach.description}</p>
                    </div>
                </div>
            `;
        }).join('');
        
        // Puntos de aprendizaje
        document.getElementById('learning-points').innerHTML = 
            COLON_DATA.learningPoints.map(point => `<li>${point}</li>`).join('');
        
        // Mostrar pantalla
        document.querySelectorAll('.game-phase').forEach(phase => {
            phase.classList.remove('active');
        });
        
        const victoryScreen = document.getElementById('victory-screen');
        if (victoryScreen) {
            victoryScreen.classList.add('active');
        }
    }
    
    async submitScore(timeTaken) {
        try {
            const scoreData = {
                level_type: 'colon',
                score: this.score,
                time_taken: timeTaken,
                anomalies_found: Object.values(this.phaseProgress)
                    .reduce((sum, phase) => sum + (phase.completed || 0), 0),
                total_anomalies: Object.values(this.phaseProgress)
                    .reduce((sum, phase) => sum + (phase.total || 0), 0)
            };
            
            await window.authClient.submitScore(scoreData);
            console.log('✅ Puntuación guardada');
        } catch (error) {
            console.error('❌ Error al guardar puntuación:', error.message);
        }
    }
}

// Inicializar juego
document.addEventListener('DOMContentLoaded', () => {
    new ColonCancerGame();
});
