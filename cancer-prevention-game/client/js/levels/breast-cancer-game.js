// Breast Cancer Level Game Logic
class BreastCancerGame {
    constructor() {
        console.log('🎮 INICIALIZANDO BreastCancerGame...');
        
        this.currentPhase = 'intro';
        this.score = 0;
        this.lives = 3;
        this.gameTime = 300; // 5 minutos
        this.tutorialStep = 0;
        this.currentQuestion = 0;
        this.detectedAnomalies = 0;
        this.totalAnomalies = 3; // Solo hay 3 anomalías reales en el juego
        this.hintsUsed = 0;
        this.accuracy = 0;
        this.isPaused = false;
        this.gameStartTime = null;
        this.timer = null;
        this.achievements = [];
        
        console.log('✅ BreastCancerGame inicializado correctamente');
        console.log('🎯 Fase inicial:', this.currentPhase);
        
        // Tutorial data
        this.tutorialSteps = [
            {
                title: "🎯 Preparación para la Autoexploración",
                content: `
                    <p>La autoexploración mamaria es una técnica fundamental para la detección temprana. 
                    <span class="highlight">Realízala mensualmente</span> entre el 7º y 10º día después de la menstruación.</p>
                    <p><strong>📅 Momento ideal:</strong> Cuando los senos están menos sensibles</p>
                    <p><strong>🏠 Lugar:</strong> Frente a un espejo en un lugar privado</p>
                    <p><strong>⏰ Duración:</strong> Solo necesitas 10-15 minutos</p>
                `,
                diagram: 'preparation'
            },
            {
                title: "👀 Inspección Visual - Parte 1",
                content: `
                    <p>Colócate frente al espejo con los brazos a los lados. Observa cuidadosamente:</p>
                    <ul>
                        <li>🔍 <span class="highlight">Forma y tamaño</span> de ambos senos</li>
                        <li>🔍 <span class="highlight">Simetría</span> general</li>
                        <li>🔍 <span class="highlight">Color de la piel</span></li>
                        <li>🔍 <span class="highlight">Textura de la superficie</span></li>
                    </ul>
                    <p><strong>⚠️ Busca:</strong> Cambios en el contorno, hundimientos o protuberancias inusuales</p>
                `,
                diagram: 'visual1'
            },
            {
                title: "👀 Inspección Visual - Parte 2",
                content: `
                    <p>Ahora eleva los brazos por encima de la cabeza y repite la observación:</p>
                    <ul>
                        <li>🔍 <span class="highlight">Movimiento</span> de los senos al levantar los brazos</li>
                        <li>🔍 <span class="highlight">Retracciones</span> de la piel</li>
                        <li>🔍 <span class="highlight">Cambios en los pezones</span></li>
                    </ul>
                    <p><strong>💡 Tip:</strong> Los movimientos normales son suaves y simétricos</p>
                `,
                diagram: 'visual2'
            },
            {
                title: "🤲 Palpación Manual - Técnica",
                content: `
                    <p>Usa las <span class="highlight">yemas de los dedos</span> (no las puntas) de tu mano opuesta:</p>
                    <ul>
                        <li>✋ <span class="highlight">Presión ligera:</span> Para tejido superficial</li>
                        <li>✋ <span class="highlight">Presión media:</span> Para tejido intermedio</li>
                        <li>✋ <span class="highlight">Presión firme:</span> Para tejido profundo cerca del pecho</li>
                    </ul>
                    <p><strong>🔄 Patrón:</strong> Movimientos circulares del tamaño de una moneda</p>
                `,
                diagram: 'palpation'
            },
            {
                title: "🗺️ Zonas de Exploración",
                content: `
                    <p>Examina <span class="highlight">toda el área</span> desde:</p>
                    <ul>
                        <li>📐 <span class="highlight">Arriba:</span> Clavícula</li>
                        <li>📐 <span class="highlight">Abajo:</span> Debajo del seno</li>
                        <li>📐 <span class="highlight">Lado:</span> Axila</li>
                        <li>📐 <span class="highlight">Centro:</span> Esternón</li>
                    </ul>
                    <p><strong>⚠️ Importante:</strong> No olvides examinar la axila y el área entre el seno y el brazo</p>
                    <p><strong>🎯 Busca:</strong> Bultos, engrosamientos o cambios en la textura</p>
                `,
                diagram: 'zones'
            }
        ];
        
        // Quiz questions
        this.quizQuestions = [
            {
                question: "¿Cuál es el mejor momento para realizar la autoexploración mamaria?",
                options: [
                    "Durante la menstruación",
                    "Entre el 7º y 10º día después de la menstruación",
                    "Justo antes de la menstruación",
                    "No importa el momento"
                ],
                correct: 1,
                explanation: "Es mejor realizarla entre el 7º y 10º día después de la menstruación, cuando los senos están menos sensibles y los cambios hormonales son mínimos."
            },
            {
                question: "¿Qué parte de los dedos debes usar para la palpación?",
                options: [
                    "Las puntas de los dedos",
                    "Las yemas de los dedos",
                    "La palma de la mano",
                    "Los nudillos"
                ],
                correct: 1,
                explanation: "Las yemas de los dedos son más sensibles y permiten detectar mejor los cambios en el tejido mamario."
            },
            {
                question: "¿Con qué frecuencia se debe realizar la autoexploración?",
                options: [
                    "Semanalmente",
                    "Mensualmente",
                    "Cada 3 meses",
                    "Solo cuando hay síntomas"
                ],
                correct: 1,
                explanation: "La autoexploración debe realizarse mensualmente para familiarizarse con el tejido normal y detectar cambios temprano."
            },
            {
                question: "¿Qué debes hacer si encuentras algo inusual?",
                options: [
                    "Esperar a ver si desaparece",
                    "Intentar masajearlo",
                    "Consultar con un médico inmediatamente",
                    "Hacer ejercicio para que se reduzca"
                ],
                correct: 2,
                explanation: "Cualquier cambio inusual debe ser evaluado por un profesional médico lo antes posible. La detección temprana es clave."
            },
            {
                question: "¿Qué áreas deben incluirse en la exploración?",
                options: [
                    "Solo el área del pezón",
                    "Solo el seno",
                    "Seno, axila y área entre el seno y el brazo",
                    "Solo donde se sienta dolor"
                ],
                correct: 2,
                explanation: "La exploración debe incluir todo el seno, la axila y el área entre el seno y el brazo, ya que el tejido mamario se extiende a estas zonas."
            }
        ];
        
        // Detection zones for the game - POSICIONES ANATÓMICAMENTE CORRECTAS
        // El seno está centrado (50%, 50%) con 300x280px
        this.detectionZones = [
            // ZONAS NORMALES dentro del tejido mamario - Exploración sistemática
            { id: 1, x: 42, y: 32, size: 35, type: 'normal', description: '✅ Cuadrante superior externo - Tejido normal suave' },
            { id: 2, x: 58, y: 32, size: 35, type: 'normal', description: '✅ Cuadrante superior interno - Sin irregularidades' },
            { id: 3, x: 42, y: 58, size: 35, type: 'normal', description: '✅ Cuadrante inferior externo - Textura normal' },
            { id: 4, x: 58, y: 58, size: 35, type: 'normal', description: '✅ Cuadrante inferior interno - Área sin cambios' },
            { id: 5, x: 50, y: 45, size: 28, type: 'normal', description: '✅ Área central y areola - Tejido normal' },
            
            // ANOMALÍAS IMPORTANTES - Dentro del tejido mamario y áreas de extensión
            { id: 6, x: 46, y: 38, size: 22, type: 'anomaly', description: '⚠️ NÓDULO: Masa firme de 1cm - CONSULTAR MÉDICO INMEDIATAMENTE' },
            { id: 7, x: 32, y: 45, size: 25, type: 'anomaly', description: '⚠️ AXILA: Ganglio linfático inflamado - EVALUACIÓN URGENTE' },
            { id: 8, x: 54, y: 52, size: 24, type: 'anomaly', description: '⚠️ IRREGULARIDAD: Engrosamiento sospechoso - ATENCIÓN MÉDICA' }
        ];
        
        this.foundZones = new Set();
        this.selectedAnswer = null;
        
        this.init();
    }
    
    init() {
        console.log('🎮 Inicializando Breast Cancer Game...');
        this.updateHUD();
        this.showScreen('intro-screen');
    }
    
    startMission() {
        console.log('🚀 INICIANDO MISIÓN DE CÁNCER DE MAMA');
        console.log('📍 Estado actual:', this.currentPhase);
        console.log('🎮 Objeto del juego:', this);
        
        this.currentPhase = 'tutorial';
        this.gameStartTime = new Date();
        this.showScreen('tutorial-screen');
        this.startTimer();
        this.loadTutorialStep();
        
        console.log('✅ Misión iniciada - Fase:', this.currentPhase);
    }
    
    showScreen(screenId) {
        // Ocultar todas las pantallas
        document.querySelectorAll('.game-screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Mostrar la pantalla solicitada
        const screen = document.getElementById(screenId);
        if (screen) {
            screen.classList.add('active');
        }
    }
    
    loadTutorialStep() {
        const step = this.tutorialSteps[this.tutorialStep];
        if (!step) return;
        
        // Actualizar contenido
        const instructionCard = document.getElementById('instruction-card');
        instructionCard.innerHTML = `
            <h3>${step.title}</h3>
            ${step.content}
        `;
        
        // Actualizar diagrama
        this.updateDiagram(step.diagram);
        
        // Actualizar progreso
        const progress = ((this.tutorialStep + 1) / this.tutorialSteps.length) * 100;
        document.getElementById('tutorial-progress').style.width = `${progress}%`;
        document.getElementById('current-step').textContent = this.tutorialStep + 1;
        document.getElementById('total-steps').textContent = this.tutorialSteps.length;
        
        // Actualizar botones
        const btnPrev = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        
        btnPrev.disabled = this.tutorialStep === 0;
        
        if (this.tutorialStep === this.tutorialSteps.length - 1) {
            btnNext.innerHTML = '<i class="fas fa-arrow-right"></i> Comenzar Práctica';
            btnNext.onclick = () => this.startDetectionGame();
        } else {
            btnNext.innerHTML = 'Siguiente <i class="fas fa-chevron-right"></i>';
            btnNext.onclick = () => this.nextStep();
        }
        
        // Animación de entrada
        instructionCard.style.opacity = '0';
        instructionCard.style.transform = 'translateX(20px)';
        setTimeout(() => {
            instructionCard.style.transition = 'all 0.3s ease';
            instructionCard.style.opacity = '1';
            instructionCard.style.transform = 'translateX(0)';
        }, 100);
    }
    
    updateDiagram(type) {
        const diagram = document.getElementById('anatomy-diagram');
        let content = '';
        
        switch(type) {
            case 'preparation':
                content = `
                    <div style="text-align: center; color: var(--breast-cancer-primary);">
                        <i class="fas fa-mirror" style="font-size: 4rem; margin-bottom: 20px;"></i>
                        <h3>Preparación</h3>
                        <p>Frente al espejo<br>en un lugar privado</p>
                        <div style="margin-top: 20px;">
                            <i class="fas fa-calendar-alt" style="font-size: 1.5rem; color: var(--breast-cancer-accent);"></i>
                            <p style="margin-top: 10px; font-size: 0.9rem;">7º-10º día post-menstruación</p>
                        </div>
                    </div>
                `;
                break;
            case 'visual1':
                content = `
                    <div style="position: relative; width: 200px; height: 200px; margin: 0 auto;">
                        <div style="width: 100%; height: 60%; background: linear-gradient(135deg, #ffeaa7, #fab1a0); border-radius: 50px 50px 40px 40px; position: relative;">
                            <div style="position: absolute; top: 20%; left: 30%; width: 10px; height: 10px; background: #d63031; border-radius: 50%;"></div>
                            <div style="position: absolute; top: 20%; right: 30%; width: 10px; height: 10px; background: #d63031; border-radius: 50%;"></div>
                        </div>
                        <div style="text-align: center; margin-top: 20px; color: var(--breast-cancer-primary);">
                            <p style="font-size: 0.9rem;">👀 Brazos a los lados</p>
                            <p style="font-size: 0.8rem;">Observar forma, tamaño y simetría</p>
                        </div>
                    </div>
                `;
                break;
            case 'visual2':
                content = `
                    <div style="position: relative; width: 200px; height: 250px; margin: 0 auto;">
                        <div style="position: absolute; top: 0; left: 20%; right: 20%; height: 30px; background: linear-gradient(90deg, #fab1a0, #ffeaa7); border-radius: 15px;"></div>
                        <div style="width: 100%; height: 60%; background: linear-gradient(135deg, #ffeaa7, #fab1a0); border-radius: 50px 50px 40px 40px; position: relative; margin-top: 40px;">
                            <div style="position: absolute; top: 20%; left: 30%; width: 10px; height: 10px; background: #d63031; border-radius: 50%;"></div>
                            <div style="position: absolute; top: 20%; right: 30%; width: 10px; height: 10px; background: #d63031; border-radius: 50%;"></div>
                        </div>
                        <div style="text-align: center; margin-top: 20px; color: var(--breast-cancer-primary);">
                            <p style="font-size: 0.9rem;">🙌 Brazos elevados</p>
                            <p style="font-size: 0.8rem;">Buscar retracciones o cambios</p>
                        </div>
                    </div>
                `;
                break;
            case 'palpation':
                content = `
                    <div style="text-align: center;">
                        <div style="position: relative; width: 150px; height: 150px; margin: 0 auto 20px;">
                            <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #ffeaa7, #fab1a0); border-radius: 50%; position: relative;">
                                <div style="position: absolute; top: 30%; left: 50%; width: 40px; height: 40px; background: rgba(255,255,255,0.3); border-radius: 50%; transform: translate(-50%, -50%); border: 2px dashed var(--breast-cancer-primary);"></div>
                                <div style="position: absolute; top: 30%; left: 80%; font-size: 2rem; color: var(--detection-blue);">
                                    <i class="fas fa-hand-paper"></i>
                                </div>
                            </div>
                        </div>
                        <div style="color: var(--breast-cancer-primary);">
                            <p style="font-size: 0.9rem;">🔄 Movimientos circulares</p>
                            <div style="display: flex; justify-content: space-around; margin-top: 15px; font-size: 0.8rem;">
                                <span>Ligera</span>
                                <span>Media</span>
                                <span>Firme</span>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'zones':
                content = `
                    <div style="position: relative; width: 200px; height: 200px; margin: 0 auto;">
                        <div style="width: 100%; height: 100%; background: linear-gradient(135deg, #ffeaa7, #fab1a0); border-radius: 50%; position: relative;">
                            <div style="position: absolute; top: 0; left: 0; width: 50%; height: 50%; border: 2px solid var(--breast-cancer-primary); border-radius: 50% 0 0 0;"></div>
                            <div style="position: absolute; top: 0; right: 0; width: 50%; height: 50%; border: 2px solid var(--breast-cancer-primary); border-radius: 0 50% 0 0;"></div>
                            <div style="position: absolute; bottom: 0; left: 0; width: 50%; height: 50%; border: 2px solid var(--breast-cancer-primary); border-radius: 0 0 0 50%;"></div>
                            <div style="position: absolute; bottom: 0; right: 0; width: 50%; height: 50%; border: 2px solid var(--breast-cancer-primary); border-radius: 0 0 50% 0;"></div>
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 20px; height: 20px; background: var(--danger-red); border-radius: 50%;"></div>
                        </div>
                        <div style="text-align: center; margin-top: 20px; color: var(--breast-cancer-primary);">
                            <p style="font-size: 0.9rem;">🗺️ Cuatro cuadrantes</p>
                            <p style="font-size: 0.8rem;">+ Axila y área central</p>
                        </div>
                    </div>
                `;
                break;
        }
        
        diagram.innerHTML = content;
    }
    
    nextStep() {
        if (this.tutorialStep < this.tutorialSteps.length - 1) {
            this.tutorialStep++;
            this.loadTutorialStep();
            this.addScore(50); // Puntos por completar paso del tutorial
        }
    }
    
    previousStep() {
        if (this.tutorialStep > 0) {
            this.tutorialStep--;
            this.loadTutorialStep();
        }
    }
    
    startDetectionGame() {
        console.log('🔍 Iniciando juego de detección...');
        this.currentPhase = 'detection';
        this.showScreen('detection-game-screen');
        this.setupDetectionZones();
        this.addScore(100); // Bonus por completar tutorial
    }
    
    setupDetectionZones() {
        const model = document.getElementById('examination-model');
        const zonesContainer = model.querySelector('.detection-zones');
        zonesContainer.innerHTML = '';
        
        this.detectionZones.forEach(zone => {
            const zoneElement = document.createElement('div');
            zoneElement.className = 'detection-zone';
            zoneElement.style.left = `${zone.x}%`;
            zoneElement.style.top = `${zone.y}%`;
            zoneElement.style.width = `${zone.size}px`;
            zoneElement.style.height = `${zone.size}px`;
            zoneElement.dataset.zoneId = zone.id;
            zoneElement.dataset.type = zone.type;
            zoneElement.dataset.description = zone.description;
            
            zoneElement.addEventListener('click', (e) => this.onZoneClick(e, zone));
            zonesContainer.appendChild(zoneElement);
        });
        
        // Configurar el movimiento de la mano
        this.setupHandMovement();
    }
    
    setupHandMovement() {
        const model = document.getElementById('examination-model');
        const hand = document.getElementById('scanning-hand');
        
        model.addEventListener('mousemove', (e) => {
            const rect = model.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            hand.style.left = `${x - 15}px`;
            hand.style.top = `${y - 15}px`;
            hand.style.opacity = '0.8';
        });
        
        model.addEventListener('mouseleave', () => {
            hand.style.opacity = '0.3';
        });
    }
    
    onZoneClick(event, zone) {
        const zoneElement = event.target;
        
        if (this.foundZones.has(zone.id)) {
            this.showFeedback('Ya examinaste esta zona', 'neutral');
            return;
        }
        
        this.foundZones.add(zone.id);
        
        if (zone.type === 'anomaly') {
            zoneElement.classList.add('anomaly');
            this.detectedAnomalies++;
            this.addScore(200);
            this.showFeedback(`¡Anomalía detectada! ${zone.description}`, 'negative');
            this.addFinding(zone.description, 'anomaly');
        } else {
            zoneElement.classList.add('found');
            this.addScore(100);
            this.showFeedback(`Zona normal examinada: ${zone.description}`, 'positive');
            this.addFinding(zone.description, 'normal');
        }
        
        // Verificar si se encontraron todas las anomalías (condición principal de victoria)
        if (this.detectedAnomalies === this.totalAnomalies) {
            this.showFeedback(`¡Excelente! Has encontrado todas las anomalías importantes (${this.detectedAnomalies}/${this.totalAnomalies})`, 'positive');
            this.addScore(500); // Bonus por encontrar todas las anomalías
            setTimeout(() => this.completeDetectionPhase(), 2000);
        }
        // Condición secundaria: si se examinaron todas las zonas pero no se encontraron todas las anomalías
        else if (this.foundZones.size === this.detectionZones.length) {
            if (this.detectedAnomalies < this.totalAnomalies) {
                this.showFeedback(`Completaste el examen, pero te faltaron ${this.totalAnomalies - this.detectedAnomalies} anomalías importantes`, 'neutral');
            }
            setTimeout(() => this.completeDetectionPhase(), 1500);
        }
    }
    
    showFeedback(message, type) {
        const feedback = document.getElementById('detection-feedback');
        feedback.textContent = message;
        feedback.className = `detection-feedback ${type} show`;
        
        setTimeout(() => {
            feedback.classList.remove('show');
        }, 3000);
    }
    
    addFinding(description, type) {
        const findingsList = document.getElementById('findings-list');
        const finding = document.createElement('div');
        finding.className = `finding-item ${type}`;
        finding.innerHTML = `
            <i class="fas fa-${type === 'anomaly' ? 'exclamation-triangle' : 'check'}"></i>
            ${description}
        `;
        findingsList.appendChild(finding);
        
        // Agregar indicador de progreso si es una anomalía
        if (type === 'anomaly') {
            const progressFinding = document.createElement('div');
            progressFinding.className = 'finding-item progress';
            progressFinding.innerHTML = `
                <i class="fas fa-search"></i>
                <strong>Progreso: ${this.detectedAnomalies}/${this.totalAnomalies} anomalías encontradas</strong>
                ${this.detectedAnomalies === this.totalAnomalies ? ' ¡COMPLETO!' : ''}
            `;
            findingsList.appendChild(progressFinding);
        }
        
        // Scroll al final
        findingsList.scrollTop = findingsList.scrollHeight;
    }
    
    showHint() {
        if (this.hintsUsed >= 3) {
            document.getElementById('hint-display').innerHTML = '<p>No hay más pistas disponibles</p>';
            document.querySelector('.btn-hint').disabled = true;
            return;
        }
        
        this.hintsUsed++;
        const remainingAnomalies = this.totalAnomalies - this.detectedAnomalies;
        const hints = [
            `Examina sistemáticamente cada cuadrante. Te faltan ${remainingAnomalies} anomalías por encontrar.`,
            "Presta especial atención a las áreas cerca de la axila y los bordes externos",
            `Los cambios en la textura y protuberancias son señales importantes. Quedan ${remainingAnomalies} por detectar.`
        ];
        
        document.getElementById('hint-display').innerHTML = `<p>💡 ${hints[this.hintsUsed - 1]}</p>`;
        this.addScore(-25); // Penalización por usar pista
    }
    
    completeDetectionPhase() {
        console.log('✅ Fase de detección completada');
        
        // Bonus adicional si se encontraron todas las anomalías
        if (this.detectedAnomalies === this.totalAnomalies) {
            console.log('🎯 ¡Todas las anomalías encontradas!');
            this.addScore(500); // Bonus extra por detección perfecta
        } else {
            console.log(`⚠️ Se encontraron ${this.detectedAnomalies}/${this.totalAnomalies} anomalías`);
        }
        
        this.currentPhase = 'quiz';
        this.showScreen('quiz-screen');
        this.loadQuizQuestion();
        this.addScore(300); // Bonus base por completar detección
    }
    
    loadQuizQuestion() {
        const question = this.quizQuestions[this.currentQuestion];
        if (!question) {
            this.completeQuiz();
            return;
        }
        
        // Actualizar header
        document.getElementById('question-number').textContent = this.currentQuestion + 1;
        document.getElementById('total-questions').textContent = this.quizQuestions.length;
        
        const progress = ((this.currentQuestion + 1) / this.quizQuestions.length) * 100;
        document.getElementById('quiz-progress').style.width = `${progress}%`;
        
        // Cargar pregunta
        document.getElementById('question-card').innerHTML = `<h3>${question.question}</h3>`;
        
        // Cargar opciones
        const optionsContainer = document.getElementById('answer-options');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'answer-option';
            optionElement.innerHTML = `
                <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                <span>${option}</span>
            `;
            
            optionElement.addEventListener('click', () => this.selectAnswer(index, optionElement));
            optionsContainer.appendChild(optionElement);
        });
        
        // Reset estado
        this.selectedAnswer = null;
        document.getElementById('btn-submit').disabled = true;
        document.getElementById('quiz-feedback').classList.remove('show');
    }
    
    selectAnswer(index, element) {
        // Limpiar selección anterior
        document.querySelectorAll('.answer-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Seleccionar nueva opción
        element.classList.add('selected');
        this.selectedAnswer = index;
        document.getElementById('btn-submit').disabled = false;
    }
    
    submitAnswer() {
        if (this.selectedAnswer === null) return;
        
        const question = this.quizQuestions[this.currentQuestion];
        const isCorrect = this.selectedAnswer === question.correct;
        
        // Mostrar resultado
        const options = document.querySelectorAll('.answer-option');
        options.forEach((option, index) => {
            if (index === question.correct) {
                option.classList.add('correct');
            } else if (index === this.selectedAnswer && !isCorrect) {
                option.classList.add('incorrect');
            }
            option.style.pointerEvents = 'none';
        });
        
        // Mostrar feedback
        const feedback = document.getElementById('quiz-feedback');
        feedback.innerHTML = `
            <h4>${isCorrect ? '✅ ¡Correcto!' : '❌ Incorrecto'}</h4>
            <p>${question.explanation}</p>
        `;
        feedback.className = `quiz-feedback ${isCorrect ? 'correct' : 'incorrect'} show`;
        
        // Actualizar puntuación
        if (isCorrect) {
            this.addScore(150);
        } else {
            this.loseLife();
        }
        
        // Continuar después de un momento
        setTimeout(() => {
            this.currentQuestion++;
            this.loadQuizQuestion();
        }, 3000);
    }
    
    completeQuiz() {
        console.log('🎓 Quiz completado');
        this.currentPhase = 'completed';
        this.calculateResults();
        this.showResults();
    }
    
    calculateResults() {
        const totalTime = Math.floor((new Date() - this.gameStartTime) / 1000);
        const remainingTime = Math.max(0, this.gameTime - totalTime);
        
        // Calcular precisión
        const correctAnswers = this.quizQuestions.length - (3 - this.lives);
        this.accuracy = Math.round((correctAnswers / this.quizQuestions.length) * 100);
        
        // Bonus por tiempo restante
        this.addScore(remainingTime * 2);
        
        // Bonus por vidas restantes
        this.addScore(this.lives * 100);
        
        // Determinar logros
        this.determineAchievements();
    }
    
    determineAchievements() {
        this.achievements = [];
        
        if (this.accuracy >= 80) {
            this.achievements.push({
                icon: 'fas fa-brain',
                title: 'Experto en Conocimiento',
                description: 'Respondió correctamente el 80% o más de las preguntas'
            });
        }
        
        if (this.detectedAnomalies === this.totalAnomalies) {
            this.achievements.push({
                icon: 'fas fa-search',
                title: 'Detective Experto',
                description: `Detectó las ${this.totalAnomalies} anomalías importantes`
            });
        } else if (this.detectedAnomalies >= 2) {
            this.achievements.push({
                icon: 'fas fa-search-plus',
                title: 'Buen Observador',
                description: `Detectó ${this.detectedAnomalies} de ${this.totalAnomalies} anomalías`
            });
        }
        
        if (this.hintsUsed === 0) {
            this.achievements.push({
                icon: 'fas fa-star',
                title: 'Explorador Independiente',
                description: 'Completó el nivel sin usar pistas'
            });
        }
        
        if (this.lives === 3) {
            this.achievements.push({
                icon: 'fas fa-heart',
                title: 'Perfección Total',
                description: 'Completó el nivel sin perder vidas'
            });
        }
        
        if (this.score >= 1500) {
            this.achievements.push({
                icon: 'fas fa-trophy',
                title: 'Maestro de la Prevención',
                description: 'Obtuvo una puntuación excepcional'
            });
        }
    }
    
    showResults() {
        this.showScreen('results-screen');
        this.stopTimer();
        
        // Actualizar estadísticas
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('accuracy-score').textContent = `${this.accuracy}%`;
        
        const totalTime = Math.floor((new Date() - this.gameStartTime) / 1000);
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        document.getElementById('completion-time').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Mostrar logros
        const achievementsContainer = document.getElementById('achievements-earned');
        achievementsContainer.innerHTML = '';
        
        this.achievements.forEach(achievement => {
            const achievementElement = document.createElement('div');
            achievementElement.className = 'achievement-badge';
            achievementElement.innerHTML = `
                <div class="achievement-icon">
                    <i class="${achievement.icon}"></i>
                </div>
                <div class="achievement-title">${achievement.title}</div>
                <div class="achievement-desc">${achievement.description}</div>
            `;
            achievementsContainer.appendChild(achievementElement);
        });
        
        if (this.achievements.length === 0) {
            achievementsContainer.innerHTML = '<p>Sigue practicando para desbloquear logros</p>';
        }
        
        // Guardar progreso
        this.saveProgress();
        
        // Enviar puntuación al servidor
        console.log('🚀 ANTES DE LLAMAR submitScore - Score:', this.score);
        this.submitScore(totalTime);
        console.log('🚀 DESPUÉS DE LLAMAR submitScore');
    }
    
    // Función para enviar puntuación al servidor
    async submitScore(timeTaken) {
        console.log('🎮 =====INICIANDO SUBMIT SCORE=====');
        console.log('🔑 AuthClient existe:', !!window.authClient);
        console.log('👤 Usuario autenticado:', window.authClient ? window.authClient.isAuthenticated() : 'N/A');
        
        if (!window.authClient || !window.authClient.isAuthenticated()) {
            console.log('❌ Usuario no autenticado, no se enviará la puntuación');
            return;
        }
        
        try {
            const scoreData = {
                level_type: 'mama',
                score: this.score,
                time_taken: timeTaken,
                anomalies_found: this.detectedAnomalies,
                total_anomalies: this.totalAnomalies
            };
            
            console.log('Enviando puntuación:', scoreData);
            
            const result = await window.authClient.submitScore(scoreData);
            
            console.log('Puntuación enviada exitosamente:', result);
            
            // Notificaciones removidas por solicitud del usuario
            
        } catch (error) {
            console.error('Error al enviar puntuación:', error);
            
            // Notificaciones removidas por solicitud del usuario
        }
    }
    
    saveProgress() {
        const progress = {
            level: 'breast-cancer',
            completed: true,
            score: this.score,
            accuracy: this.accuracy,
            achievements: this.achievements,
            completionTime: new Date().toISOString()
        };
        
        const existingProgress = JSON.parse(localStorage.getItem('vitaGuardProgress') || '{}');
        existingProgress.breastCancer = progress;
        localStorage.setItem('vitaGuardProgress', JSON.stringify(existingProgress));
    }
    
    addScore(points) {
        this.score = Math.max(0, this.score + points);
        this.updateHUD();
        
        // Animación de puntuación
        if (points > 0) {
            this.showScoreAnimation(points);
        }
    }
    
    loseLife() {
        if (this.lives > 0) {
            this.lives--;
            this.updateHUD();
            
            // Animación de pérdida de vida
            const heart = document.getElementById(`heart${this.lives + 1}`);
            if (heart) {
                heart.classList.add('lost');
                heart.style.animation = 'none';
            }
            
            if (this.lives === 0) {
                this.gameOver();
            }
        }
    }
    
    showScoreAnimation(points) {
        const scoreElement = document.getElementById('current-score');
        const animation = document.createElement('div');
        animation.style.position = 'absolute';
        animation.style.top = '0';
        animation.style.right = '0';
        animation.style.color = 'var(--health-green)';
        animation.style.fontWeight = 'bold';
        animation.style.fontSize = '1.2rem';
        animation.style.pointerEvents = 'none';
        animation.style.animation = 'scoreUp 1s ease-out forwards';
        animation.textContent = `+${points}`;
        
        scoreElement.parentElement.style.position = 'relative';
        scoreElement.parentElement.appendChild(animation);
        
        setTimeout(() => animation.remove(), 1000);
    }
    
    updateHUD() {
        document.getElementById('current-score').textContent = this.score;
        
        // Actualizar timer si está corriendo
        if (this.timer) {
            const elapsed = Math.floor((new Date() - this.gameStartTime) / 1000);
            const remaining = Math.max(0, this.gameTime - elapsed);
            const minutes = Math.floor(remaining / 60);
            const seconds = remaining % 60;
            document.getElementById('game-timer').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (remaining === 0) {
                this.timeUp();
            }
        }
    }
    
    startTimer() {
        this.timer = setInterval(() => {
            this.updateHUD();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
    
    timeUp() {
        console.log('⏰ Tiempo agotado');
        this.stopTimer();
        this.currentPhase = 'completed';
        this.calculateResults();
        this.showResults();
    }
    
    gameOver() {
        console.log('💀 Game Over');
        this.stopTimer();
        this.showScreen('results-screen');
        document.getElementById('results-title').textContent = '¡Inténtalo de nuevo!';
        document.getElementById('results-subtitle').textContent = 'La práctica hace al maestro';
        document.getElementById('completion-badge').innerHTML = '<i class="fas fa-redo"></i>';
    }
    
    togglePause() {
        const overlay = document.getElementById('pause-overlay');
        if (this.isPaused) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }
    
    pauseGame() {
        this.isPaused = true;
        this.stopTimer();
        document.getElementById('pause-overlay').classList.remove('hidden');
    }
    
    resumeGame() {
        this.isPaused = false;
        this.startTimer();
        document.getElementById('pause-overlay').classList.add('hidden');
    }
    
    restartLevel() {
        window.location.reload();
    }
    
    exitLevel() {
        // Redirigir al menú principal SIN recargar la página
        if (window.authClient && window.authClient.isAuthenticated()) {
            window.location.href = '/index.html';
        } else {
            window.location.href = '/index.html';
        }
    }
    
    goBack() {
        // Redirigir al menú principal SIN recargar la página
        if (window.authClient && window.authClient.isAuthenticated()) {
            window.location.href = '/index.html';
        } else {
            window.location.href = '/index.html';
        }
    }
    
    continueToNextLevel() {
        // Ir al siguiente nivel (por implementar)
        console.log('Continuando al siguiente nivel...');
        if (window.authClient && window.authClient.isAuthenticated()) {
            window.location.href = '/index.html';
        } else {
            window.location.href = '/index.html';
        }
    }
    
    replayLevel() {
        window.location.reload();
    }
    
    goToMenu() {
        // Redirigir al menú principal SIN cerrar sesión
        console.log('🏠 Redirigiendo al menú principal...');
        if (window.authClient && window.authClient.isAuthenticated()) {
            console.log('👤 Usuario autenticado, redirigiendo a menú principal');
            window.location.href = '/index.html';
        } else {
            console.log('👤 Usuario NO autenticado, redirigiendo a index');
            window.location.href = '/index.html';
        }
    }
}

// Agregar estilos adicionales dinámicamente
const additionalStyles = `
@keyframes scoreUp {
    0% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
    100% {
        transform: translateY(-50px) scale(1.2);
        opacity: 0;
    }
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

console.log('🎮 Breast Cancer Game Class loaded successfully!');