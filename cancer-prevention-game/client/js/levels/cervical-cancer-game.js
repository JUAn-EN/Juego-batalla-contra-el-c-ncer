// ============================================
// JUEGO DE CÁNCER CERVICAL
// ============================================

class CervicalCancerGame {
    constructor() {
        console.log('🎮 Inicializando Laboratorio Cervical...');
        
        this.currentPhase = 'intro';
        this.score = 0;
        this.lives = 3;
        this.gameTime = 420; // 7 minutos
        this.isPaused = false;
        this.timer = null;
        this.startTime = null;
        
        // Progress tracking
        this.phaseProgress = {
            timeline: { completed: 0, total: 5, perfect: true },
            pap: { completed: 0, total: 8, perfect: true },
            risks: { completed: 0, total: 12, perfect: true },
            myths: { completed: 0, total: 10, perfect: true },
            calendar: { completed: false, perfect: true }
        };
        
        this.achievements = [];
        this.draggedElement = null;
        
        this.init();
    }
    
    init() {
        this.hideLoading();
        this.attachEventListeners();
        this.showPhase('intro');
    }
    
    hideLoading() {
        setTimeout(() => {
            document.getElementById('loading-screen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('loading-screen').style.display = 'none';
            }, 500);
        }, 2000);
    }
    
    attachEventListeners() {
        // Botones principales
        document.getElementById('start-game-btn')?.addEventListener('click', () => this.startGame());
        document.getElementById('pause-btn')?.addEventListener('click', () => this.togglePause());
        document.getElementById('resume-btn')?.addEventListener('click', () => this.togglePause());
        document.getElementById('restart-btn')?.addEventListener('click', () => this.restartGame());
        document.getElementById('exit-btn')?.addEventListener('click', () => this.exitGame());
        
        // Botones de victoria
        document.getElementById('next-level-btn')?.addEventListener('click', () => this.nextLevel());
        document.getElementById('replay-btn')?.addEventListener('click', () => this.restartGame());
        document.getElementById('menu-btn')?.addEventListener('click', () => this.exitGame());
        
        // Controles del microscopio
        document.getElementById('zoom-in')?.addEventListener('click', () => this.zoom(1.2));
        document.getElementById('zoom-out')?.addEventListener('click', () => this.zoom(0.8));
        document.getElementById('rotate')?.addEventListener('click', () => this.rotateSample());
    }
    
    startGame() {
        console.log('🎮 Iniciando juego...');
        this.startTime = Date.now();
        this.startTimer();
        this.showPhase('timeline');
        this.initTimelinePhase();
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
    // FASE 1: LÍNEA DE TIEMPO VPH
    // ============================================
    
    initTimelinePhase() {
        console.log('📅 Iniciando fase de línea de tiempo...');
        this.createAgeMarkers();
        this.createVaccinationCards();
        this.updateProgress('timeline');
    }
    
    createAgeMarkers() {
        const container = document.getElementById('age-markers');
        container.innerHTML = '';
        
        // Crear marcadores de edad de 5 a 30 años
        for (let age = 5; age <= 30; age += 1) {
            const marker = document.createElement('div');
            marker.className = 'age-marker';
            marker.dataset.age = age;
            marker.innerHTML = `
                <div class="marker-line"></div>
                ${age % 5 === 0 ? `<span class="age-label">${age}</span>` : ''}
            `;
            
            // Zona de drop
            marker.addEventListener('dragover', (e) => this.handleDragOver(e));
            marker.addEventListener('drop', (e) => this.handleTimelineDrop(e, age));
            
            container.appendChild(marker);
        }
    }
    
    createVaccinationCards() {
        const container = document.getElementById('vaccination-cards');
        container.innerHTML = '';
        
        // Mezclar las tarjetas
        const shuffled = [...CERVICAL_DATA.vaccinationTimeline].sort(() => Math.random() - 0.5);
        
        shuffled.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = 'vaccination-card';
            cardEl.draggable = true;
            cardEl.dataset.id = card.id;
            cardEl.dataset.correctAge = card.correctAge;
            cardEl.innerHTML = `
                <div class="card-icon">💉</div>
                <div class="card-content">
                    <h4>${card.description}</h4>
                    <p class="age-hint">${card.ageRange}</p>
                </div>
            `;
            
            cardEl.addEventListener('dragstart', (e) => this.handleDragStart(e));
            cardEl.addEventListener('dragend', (e) => this.handleDragEnd(e));
            
            container.appendChild(cardEl);
        });
    }
    
    handleDragStart(e) {
        this.draggedElement = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    }
    
    handleDragEnd(e) {
        e.target.classList.remove('dragging');
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }
    
    handleTimelineDrop(e, age) {
        e.preventDefault();
        
        if (!this.draggedElement) return;
        
        const correctAge = parseInt(this.draggedElement.dataset.correctAge);
        const cardId = parseInt(this.draggedElement.dataset.id);
        const tolerance = 2; // Permitir ±2 años
        
        if (Math.abs(age - correctAge) <= tolerance) {
            // Respuesta correcta
            this.draggedElement.classList.add('correct');
            this.draggedElement.draggable = false;
            
            const cardData = CERVICAL_DATA.vaccinationTimeline.find(c => c.id === cardId);
            this.addScore(cardData.points);
            this.showFeedback('✅ ¡Correcto! ' + cardData.info, 'success');
            
            this.phaseProgress.timeline.completed++;
            this.updateProgress('timeline');
            
            // Posicionar la tarjeta en el timeline
            const marker = e.target.closest('.age-marker');
            if (marker) {
                marker.appendChild(this.draggedElement);
                this.draggedElement.style.position = 'absolute';
                this.draggedElement.style.top = '-80px';
            }
            
            // Verificar si completó la fase
            if (this.phaseProgress.timeline.completed === this.phaseProgress.timeline.total) {
                setTimeout(() => this.completeTimelinePhase(), 1000);
            }
        } else {
            // Respuesta incorrecta
            this.draggedElement.classList.add('incorrect');
            this.loseLife();
            this.phaseProgress.timeline.perfect = false;
            this.showFeedback('❌ Edad incorrecta. Intenta de nuevo.', 'error');
            
            setTimeout(() => {
                this.draggedElement.classList.remove('incorrect');
            }, 1000);
        }
        
        this.draggedElement = null;
    }
    
    completeTimelinePhase() {
        this.showFeedback('🎉 ¡Fase de vacunación completada!', 'success');
        
        if (this.phaseProgress.timeline.perfect) {
            this.addScore(500); // Bonus por perfecto
            this.unlockAchievement('perfect_timeline');
        }
        
        setTimeout(() => {
            this.showPhase('pap-simulator');
            this.initPapSimulatorPhase();
        }, 2000);
    }
    
    // ============================================
    // FASE 2: SIMULADOR DE PAPANICOLAOU
    // ============================================
    
    initPapSimulatorPhase() {
        console.log('🔬 Iniciando simulador de Papanicolaou...');
        this.currentSampleIndex = 0;
        this.zoomLevel = 1;
        this.rotation = 0;
        this.shuffledSamples = [...CERVICAL_DATA.cellSamples].sort(() => Math.random() - 0.5);
        
        this.canvas = document.getElementById('cell-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.loadNextSample();
        this.attachPapListeners();
        this.updateProgress('pap');
    }
    
    attachPapListeners() {
        document.querySelectorAll('.diagnosis-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const diagnosis = e.currentTarget.dataset.diagnosis;
                this.checkDiagnosis(diagnosis);
            });
        });
    }
    
    loadNextSample() {
        if (this.currentSampleIndex >= this.shuffledSamples.length) {
            this.completePapPhase();
            return;
        }
        
        const sample = this.shuffledSamples[this.currentSampleIndex];
        this.currentSample = sample;
        
        // Actualizar info
        document.getElementById('sample-info').innerHTML = `
            <div class="sample-header">
                <h4>Muestra #${this.currentSampleIndex + 1}</h4>
                <span class="difficulty-badge ${sample.difficulty}">${this.getDifficultyText(sample.difficulty)}</span>
            </div>
            <p class="sample-desc">${sample.description}</p>
            <div class="sample-hint">
                <i class="fas fa-lightbulb"></i>
                <span>Busca: ${sample.characteristics}</span>
            </div>
        `;
        
        // Limpiar feedback
        document.getElementById('feedback-message').innerHTML = '';
        
        // Dibujar muestra
        this.drawCellSample(sample);
    }
    
    drawCellSample(sample) {
        const ctx = this.ctx;
        const canvas = this.canvas;
        
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Guardar estado
        ctx.save();
        
        // Aplicar transformaciones
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(this.zoomLevel, this.zoomLevel);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        
        // Fondo del microscopio
        ctx.fillStyle = sample.type === 'normal' ? '#e8f4f8' : '#fef3f3';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar células simuladas
        this.drawCells(sample);
        
        // Restaurar estado
        ctx.restore();
    }
    
    drawCells(sample) {
        const ctx = this.ctx;
        const cellCount = 15 + Math.floor(Math.random() * 10);
        
        for (let i = 0; i < cellCount; i++) {
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const size = 15 + Math.random() * 25;
            
            if (sample.type === 'normal') {
                this.drawNormalCell(x, y, size);
            } else {
                // Mezclar células normales y anormales
                if (Math.random() > 0.3) {
                    this.drawAbnormalCell(x, y, size);
                } else {
                    this.drawNormalCell(x, y, size);
                }
            }
        }
    }
    
    drawNormalCell(x, y, size) {
        const ctx = this.ctx;
        
        // Citoplasma
        ctx.fillStyle = 'rgba(100, 150, 200, 0.3)';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Núcleo pequeño y uniforme
        ctx.fillStyle = 'rgba(50, 100, 150, 0.6)';
        ctx.beginPath();
        ctx.arc(x, y, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Borde celular
        ctx.strokeStyle = 'rgba(100, 150, 200, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    drawAbnormalCell(x, y, size) {
        const ctx = this.ctx;
        
        // Citoplasma
        ctx.fillStyle = 'rgba(200, 100, 100, 0.3)';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Núcleo irregular y grande
        ctx.fillStyle = 'rgba(150, 50, 50, 0.7)';
        ctx.beginPath();
        ctx.arc(x + Math.random() * 5 - 2.5, y + Math.random() * 5 - 2.5, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Formas irregulares adicionales
        ctx.fillStyle = 'rgba(180, 60, 60, 0.5)';
        ctx.beginPath();
        ctx.arc(x + size * 0.3, y, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Borde irregular
        ctx.strokeStyle = 'rgba(200, 100, 100, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    zoom(factor) {
        this.zoomLevel *= factor;
        this.zoomLevel = Math.max(0.5, Math.min(3, this.zoomLevel));
        this.drawCellSample(this.currentSample);
    }
    
    rotateSample() {
        this.rotation += 45;
        if (this.rotation >= 360) this.rotation = 0;
        this.drawCellSample(this.currentSample);
    }
    
    checkDiagnosis(diagnosis) {
        const sample = this.currentSample;
        const isCorrect = diagnosis === sample.type;
        
        if (isCorrect) {
            this.addScore(sample.points);
            this.phaseProgress.pap.completed++;
            this.showFeedback(`✅ ¡Correcto! ${sample.explanation || ''}`, 'success');
            
            setTimeout(() => {
                this.currentSampleIndex++;
                this.loadNextSample();
            }, 1500);
        } else {
            this.loseLife();
            this.phaseProgress.pap.perfect = false;
            this.showFeedback('❌ Diagnóstico incorrecto. Observa con más atención.', 'error');
        }
        
        this.updateProgress('pap');
    }
    
    completePapPhase() {
        this.showFeedback('🎉 ¡Simulador de Papanicolaou completado!', 'success');
        
        if (this.phaseProgress.pap.perfect) {
            this.addScore(800);
            this.unlockAchievement('master_cytologist');
        }
        
        setTimeout(() => {
            this.showPhase('risk-factors');
            this.initRiskFactorsPhase();
        }, 2000);
    }
    
    // ============================================
    // FASE 3: FACTORES DE RIESGO
    // ============================================
    
    initRiskFactorsPhase() {
        console.log('⚠️ Iniciando fase de factores de riesgo...');
        this.createRiskItems();
        this.updateProgress('risks');
    }
    
    createRiskItems() {
        const container = document.getElementById('risk-items');
        container.innerHTML = '';
        
        const shuffled = [...CERVICAL_DATA.riskFactors].sort(() => Math.random() - 0.5);
        
        shuffled.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'risk-item';
            itemEl.draggable = true;
            itemEl.dataset.id = item.id;
            itemEl.dataset.type = item.type;
            itemEl.innerHTML = `
                <div class="item-icon">${item.icon}</div>
                <p class="item-name">${item.name}</p>
            `;
            
            itemEl.addEventListener('dragstart', (e) => this.handleDragStart(e));
            itemEl.addEventListener('dragend', (e) => this.handleDragEnd(e));
            
            container.appendChild(itemEl);
        });
        
        // Configurar zonas de drop
        document.getElementById('healthy-items').addEventListener('dragover', (e) => this.handleDragOver(e));
        document.getElementById('healthy-items').addEventListener('drop', (e) => this.handleRiskDrop(e, 'healthy'));
        
        document.getElementById('danger-items').addEventListener('dragover', (e) => this.handleDragOver(e));
        document.getElementById('danger-items').addEventListener('drop', (e) => this.handleRiskDrop(e, 'danger'));
    }
    
    handleRiskDrop(e, zone) {
        e.preventDefault();
        
        if (!this.draggedElement) return;
        
        const itemType = this.draggedElement.dataset.type;
        const itemId = this.draggedElement.dataset.id;
        
        if (itemType === zone) {
            // Correcto
            const itemData = CERVICAL_DATA.riskFactors.find(r => r.id === itemId);
            this.addScore(itemData.points);
            this.phaseProgress.risks.completed++;
            
            e.target.appendChild(this.draggedElement);
            this.draggedElement.classList.add('correct');
            this.draggedElement.draggable = false;
            
            this.showFeedback(`✅ ${itemData.explanation}`, 'success');
            
            if (this.phaseProgress.risks.completed === this.phaseProgress.risks.total) {
                setTimeout(() => this.completeRiskPhase(), 1000);
            }
        } else {
            // Incorrecto
            this.loseLife();
            this.phaseProgress.risks.perfect = false;
            this.draggedElement.classList.add('incorrect');
            this.showFeedback('❌ Zona incorrecta', 'error');
            
            setTimeout(() => {
                this.draggedElement.classList.remove('incorrect');
            }, 1000);
        }
        
        this.updateProgress('risks');
        this.draggedElement = null;
    }
    
    completeRiskPhase() {
        this.showFeedback('🎉 ¡Factores de riesgo identificados!', 'success');
        
        if (this.phaseProgress.risks.perfect) {
            this.addScore(600);
            this.unlockAchievement('risk_eliminator');
        }
        
        setTimeout(() => {
            this.showPhase('myths');
            this.initMythsPhase();
        }, 2000);
    }
    
    // ============================================
    // FASE 4: MITOS VS REALIDADES
    // ============================================
    
    initMythsPhase() {
        console.log('💡 Iniciando fase de mitos vs realidades...');
        this.createMythCards();
        this.updateProgress('myths');
    }
    
    createMythCards() {
        const container = document.getElementById('myth-statements');
        container.innerHTML = '';
        
        const shuffled = [...CERVICAL_DATA.mythsAndFacts].sort(() => Math.random() - 0.5);
        
        shuffled.forEach(myth => {
            const cardEl = document.createElement('div');
            cardEl.className = 'myth-card';
            cardEl.draggable = true;
            cardEl.dataset.id = myth.id;
            cardEl.dataset.isMyth = myth.isMyth;
            cardEl.innerHTML = `
                <p class="myth-statement">${myth.statement}</p>
                <div class="drag-hint"><i class="fas fa-hand-pointer"></i> Arrastra</div>
            `;
            
            cardEl.addEventListener('dragstart', (e) => this.handleDragStart(e));
            cardEl.addEventListener('dragend', (e) => this.handleDragEnd(e));
            
            container.appendChild(cardEl);
        });
        
        // Configurar zonas
        document.getElementById('reality-zone').addEventListener('dragover', (e) => this.handleDragOver(e));
        document.getElementById('reality-zone').addEventListener('drop', (e) => this.handleMythDrop(e, false));
        
        document.getElementById('myth-zone').addEventListener('dragover', (e) => this.handleDragOver(e));
        document.getElementById('myth-zone').addEventListener('drop', (e) => this.handleMythDrop(e, true));
    }
    
    handleMythDrop(e, isMyth) {
        e.preventDefault();
        
        if (!this.draggedElement) return;
        
        const cardIsMyth = this.draggedElement.dataset.isMyth === 'true';
        const cardId = parseInt(this.draggedElement.dataset.id);
        
        if (cardIsMyth === isMyth) {
            // Correcto
            const mythData = CERVICAL_DATA.mythsAndFacts.find(m => m.id === cardId);
            this.addScore(mythData.points);
            this.phaseProgress.myths.completed++;
            
            e.target.appendChild(this.draggedElement);
            this.draggedElement.classList.add('correct');
            this.draggedElement.draggable = false;
            
            this.showFeedback(`✅ ${mythData.explanation}`, 'success');
            
            if (this.phaseProgress.myths.completed === this.phaseProgress.myths.total) {
                setTimeout(() => this.completeMythsPhase(), 1000);
            }
        } else {
            // Incorrecto
            this.loseLife();
            this.phaseProgress.myths.perfect = false;
            this.draggedElement.classList.add('incorrect');
            this.showFeedback('❌ Clasificación incorrecta', 'error');
            
            setTimeout(() => {
                this.draggedElement.classList.remove('incorrect');
            }, 1000);
        }
        
        this.updateProgress('myths');
        this.draggedElement = null;
    }
    
    completeMythsPhase() {
        this.showFeedback('🎉 ¡Mitos desmentidos con éxito!', 'success');
        
        if (this.phaseProgress.myths.perfect) {
            this.addScore(700);
            this.unlockAchievement('myth_buster');
        }
        
        setTimeout(() => {
            this.showPhase('calendar');
            this.initCalendarPhase();
        }, 2000);
    }
    
    // ============================================
    // FASE 5: CALENDARIO DE PREVENCIÓN
    // ============================================
    
    initCalendarPhase() {
        console.log('📆 Iniciando fase de calendario...');
        this.selectedScenario = CERVICAL_DATA.calendarScenarios[
            Math.floor(Math.random() * CERVICAL_DATA.calendarScenarios.length)
        ];
        
        this.displayPatientInfo();
        this.createCalendar();
    }
    
    displayPatientInfo() {
        const scenario = this.selectedScenario;
        document.getElementById('patient-info').innerHTML = `
            <div class="info-item">
                <strong>Edad:</strong> ${scenario.patientAge} años
            </div>
            <div class="info-item">
                <strong>Papanicolaou previo:</strong> ${scenario.previousPap}
            </div>
            <div class="info-item">
                <strong>Factores de riesgo:</strong> 
                ${scenario.riskFactors.length > 0 ? scenario.riskFactors.join(', ') : 'Ninguno'}
            </div>
        `;
    }
    
    createCalendar() {
        const container = document.getElementById('prevention-calendar');
        container.innerHTML = `
            <div class="calendar-options">
                <div class="option-group">
                    <label>Primera prueba de Papanicolaou:</label>
                    <select id="first-pap">
                        <option value="">Seleccionar...</option>
                        <option value="ahora">Ahora</option>
                        <option value="1 año">En 1 año</option>
                        <option value="nunca">No necesario</option>
                    </select>
                </div>
                <div class="option-group">
                    <label>Próximo Papanicolaou:</label>
                    <select id="next-pap">
                        <option value="">Seleccionar...</option>
                        <option value="1 año">1 año después</option>
                        <option value="3 años después">3 años después</option>
                        <option value="5 años">5 años después</option>
                    </select>
                </div>
                <div class="option-group">
                    <label>Prueba de VPH:</label>
                    <select id="hpv-test">
                        <option value="">Seleccionar...</option>
                        <option value="recomendado">Recomendado</option>
                        <option value="co-testing disponible">Co-testing disponible</option>
                        <option value="no necesario">No necesario aún</option>
                    </select>
                </div>
                <div class="option-group">
                    <label>Vacuna VPH:</label>
                    <select id="vaccine">
                        <option value="">Seleccionar...</option>
                        <option value="urgente">Urgente</option>
                        <option value="recomendado">Recomendado</option>
                        <option value="considerar">Considerar</option>
                        <option value="no aplicable">No aplicable</option>
                    </select>
                </div>
            </div>
        `;
        
        document.getElementById('verify-calendar').addEventListener('click', () => this.verifyCalendar());
    }
    
    verifyCalendar() {
        const userAnswers = {
            firstPap: document.getElementById('first-pap').value,
            nextPap: document.getElementById('next-pap').value,
            hpvTest: document.getElementById('hpv-test').value,
            vaccine: document.getElementById('vaccine').value
        };
        
        const correct = this.selectedScenario.correctSchedule;
        let correctCount = 0;
        
        if (userAnswers.firstPap === correct.firstPap) correctCount++;
        if (userAnswers.nextPap === correct.nextPap) correctCount++;
        if (userAnswers.hpvTest === correct.hpvTest) correctCount++;
        if (userAnswers.vaccine === correct.vaccine) correctCount++;
        
        if (correctCount === 4) {
            this.addScore(this.selectedScenario.points);
            this.phaseProgress.calendar.completed = true;
            this.showFeedback('✅ ¡Calendario perfecto!', 'success');
            setTimeout(() => this.completeGame(), 1500);
        } else {
            this.loseLife();
            this.phaseProgress.calendar.perfect = false;
            this.showFeedback(`❌ ${correctCount}/4 correctas. Revisa el calendario.`, 'error');
        }
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
        const progress = this.phaseProgress[phase];
        const element = document.getElementById(`${phase}-progress`);
        if (element) {
            element.textContent = `${progress.completed}/${progress.total}`;
        }
    }
    
    addScore(points) {
        this.score += points;
        this.updateHUD();
        this.animateScore(points);
    }
    
    animateScore(points) {
        const scoreEl = document.getElementById('current-score');
        const notification = document.createElement('div');
        notification.className = 'score-popup';
        notification.textContent = `+${points}`;
        notification.style.position = 'absolute';
        notification.style.left = scoreEl.offsetLeft + 'px';
        notification.style.top = scoreEl.offsetTop + 'px';
        document.body.appendChild(notification);
        
        setTimeout(() => notification.remove(), 1000);
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
        
        setTimeout(() => {
            feedback.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            feedback.classList.remove('show');
            setTimeout(() => feedback.remove(), 300);
        }, 3000);
    }
    
    unlockAchievement(achievementId) {
        const achievement = CERVICAL_DATA.achievements.find(a => a.id === achievementId);
        if (achievement && !this.achievements.includes(achievementId)) {
            this.achievements.push(achievementId);
            this.showFeedback(`🏆 Logro desbloqueado: ${achievement.name}`, 'achievement');
        }
    }
    
    getDifficultyText(difficulty) {
        const texts = {
            easy: 'Fácil',
            medium: 'Medio',
            hard: 'Difícil'
        };
        return texts[difficulty] || difficulty;
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        const modal = document.getElementById('pause-modal');
        modal.style.display = this.isPaused ? 'flex' : 'none';
    }
    
    restartGame() {
        window.location.reload();
    }
    
    exitGame() {
        window.location.href = '/index.html';
    }
    
    nextLevel() {
        sessionStorage.setItem('cervicalLevelCompleted', 'true');
        window.location.href = '/index.html';
    }
    
    timeUp() {
        clearInterval(this.timer);
        this.gameOver();
    }
    
    gameOver() {
        console.log('🎮 Game Over llamado');
        clearInterval(this.timer);
        
        // Marcar que el juego terminó por pérdida
        this.gameOverByLoss = true;
        
        // Forzar mostrar pantalla de victoria inmediatamente
        this.completeGame();
    }
    
    async completeGame() {
        console.log('🏆 Complete Game llamado');
        clearInterval(this.timer);
        
        const totalTime = Math.floor((Date.now() - this.startTime) / 1000);
        const timeTaken = 420 - this.gameTime; // 7 minutos total
        
        // Calcular bonificaciones solo si no perdió
        if (!this.gameOverByLoss) {
            if (timeTaken < 300) { // Menos de 5 minutos = velocista
                this.unlockAchievement('speed_demon');
                this.addScore(1000);
            }
            
            if (this.lives === 3) {
                this.unlockAchievement('flawless_victory');
                this.addScore(1500);
            }
        }
        
        // Mostrar pantalla de victoria
        console.log('📺 Mostrando pantalla de victoria...');
        this.showVictoryScreen(timeTaken);
        
        // Guardar puntuación solo si hay autenticación
        if (window.authClient && window.authClient.isAuthenticated()) {
            try {
                await this.submitScore(timeTaken);
            } catch (error) {
                // Error ya manejado en submitScore, no hacer nada
            }
        } else {
            console.log('⚠️ Usuario no autenticado - Jugando sin guardar puntuación');
        }
    }
    
    showVictoryScreen(timeTaken) {
        console.log('🎬 showVictoryScreen llamado');
        
        // Cambiar título y trofeo dependiendo si ganó o perdió
        const victoryTitle = document.querySelector('.victory-title');
        const trophyIcon = document.querySelector('.trophy-animation i');
        const nextLevelBtn = document.getElementById('next-level-btn');
        
        if (this.gameOverByLoss) {
            // Perdió el nivel
            if (victoryTitle) {
                victoryTitle.textContent = '¡Nivel Fallido!';
                victoryTitle.style.color = '#ef4444';
            }
            if (trophyIcon) {
                trophyIcon.className = 'fas fa-times-circle';
                trophyIcon.style.color = '#ef4444';
            }
            // Ocultar botón de siguiente nivel cuando pierde
            if (nextLevelBtn) {
                nextLevelBtn.style.display = 'none';
            }
        } else {
            // Ganó el nivel
            if (victoryTitle) {
                victoryTitle.textContent = '¡Laboratorio Completado!';
                victoryTitle.style.color = '#06b6d4';
            }
            if (trophyIcon) {
                trophyIcon.className = 'fas fa-trophy';
                trophyIcon.style.color = '#fbbf24';
            }
            // Mostrar botón de siguiente nivel cuando gana
            if (nextLevelBtn) {
                nextLevelBtn.style.display = 'inline-flex';
            }
        }
        
        const finalScoreEl = document.getElementById('final-score');
        const finalTimeEl = document.getElementById('final-time');
        const finalAccuracyEl = document.getElementById('final-accuracy');
        
        if (finalScoreEl) finalScoreEl.textContent = this.score;
        if (finalTimeEl) {
            finalTimeEl.textContent = 
                `${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, '0')}`;
        }
        
        if (finalAccuracyEl) {
            const accuracy = Math.round((this.score / GAME_CONFIG.maxScore) * 100);
            finalAccuracyEl.textContent = `${accuracy}%`;
        }
        
        // Mostrar logros
        const achievementsList = document.getElementById('achievements-list');
        if (achievementsList) {
            achievementsList.innerHTML = this.achievements.map(achId => {
                const ach = CERVICAL_DATA.achievements.find(a => a.id === achId);
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
        }
        
        // Puntos de aprendizaje
        const learningList = document.getElementById('learning-points');
        if (learningList) {
            learningList.innerHTML = CERVICAL_DATA.learningPoints.map(point => 
                `<li>${point}</li>`
            ).join('');
        }
        
        console.log('✅ Mostrando fase de victoria');
        
        // Ocultar todas las fases primero
        document.querySelectorAll('.game-phase').forEach(phase => {
            phase.classList.remove('active');
        });
        
        // Mostrar pantalla de victoria
        const victoryScreen = document.getElementById('victory-screen');
        if (victoryScreen) {
            victoryScreen.classList.add('active');
            this.currentPhase = 'victory';
            console.log('✅ Pantalla de victoria mostrada');
        } else {
            console.error('❌ No se encontró victory-screen');
        }
    }
    
    async submitScore(timeTaken) {
        try {
            const correctAnswers = Object.values(this.phaseProgress)
                .reduce((sum, phase) => sum + (phase.completed || 0), 0);
            
            const totalQuestions = Object.values(this.phaseProgress)
                .reduce((sum, phase) => sum + (phase.total || 0), 0);
            
            const scoreData = {
                level_type: 'cervical',
                score: this.score,
                time_taken: timeTaken,
                anomalies_found: correctAnswers,
                total_anomalies: totalQuestions
            };
            
            await window.authClient.submitScore(scoreData);
            
            // Disparar evento de completado
            window.dispatchEvent(new CustomEvent('level-completed', {
                detail: {
                    levelType: 'cervical',
                    score: this.score,
                    success: true
                }
            }));
            
            // Notificar al sistema de progresión
            if (window.levelProgressionManager) {
                window.levelProgressionManager.onLevelCompleted('cervical', this.score);
            }
            
            console.log('✅ Puntuación guardada exitosamente');
        } catch (error) {
            // Registrar error solo en consola, no mostrar al usuario
            console.error('❌ Error al guardar puntuación:', error.message);
        }
    }
}

// Inicializar juego cuando cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    window.cervicalGame = new CervicalCancerGame();
});
