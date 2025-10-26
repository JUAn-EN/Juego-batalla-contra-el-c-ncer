// Prostate Cancer Level Game Logic
class ProstateCancerGame {
    constructor() {
        console.log('🎮 INICIALIZANDO ProstateCancerGame...');
        
        this.currentPhase = 'intro';
        this.score = 0;
        this.lives = 3;
        this.gameTime = 360; // 6 minutos
        this.tutorialStep = 0;
        this.currentQuestion = 0;
        this.currentExamType = 'psa';
        this.hintsUsed = 0;
        this.accuracy = 0;
        this.isPaused = false;
        this.gameStartTime = null;
        this.timer = null;
        this.achievements = [];
        this.selectedAnswer = null;
        
        // Inicializar interfaz
        this.init();
        
        // Tutorial data específico para próstata
        this.tutorialSteps = [
            {
                title: "🎯 Entendiendo el Cáncer de Próstata",
                content: `
                    <p>El cáncer de próstata es el <span class="highlight">segundo cáncer más común en hombres</span>. 
                    La detección temprana es clave para un tratamiento exitoso.</p>
                    <p><strong>📊 Datos importantes:</strong></p>
                    <ul>
                        <li>🔍 1 de cada 9 hombres será diagnosticado en su vida</li>
                        <li>🎯 Más común después de los 50 años</li>
                        <li>📈 Las tasas de supervivencia son altas con detección temprana</li>
                        <li>🏥 Exámenes regulares pueden salvar vidas</li>
                    </ul>
                `,
                diagram: 'introduction'
            },
            {
                title: "⚠️ Factores de Riesgo Principales",
                content: `
                    <p>Conocer los factores de riesgo te ayuda a tomar decisiones informadas:</p>
                    <div class="risk-factors">
                        <div class="risk-high">
                            <h4>🔴 Alto Riesgo:</h4>
                            <ul>
                                <li>👴 Edad (especialmente +65 años)</li>
                                <li>🧬 Historial familiar directo</li>
                                <li>🌍 Origen étnico (afroamericanos)</li>
                            </ul>
                        </div>
                        <div class="risk-moderate">
                            <h4>🟡 Riesgo Modificable:</h4>
                            <ul>
                                <li>🍔 Dieta alta en grasas</li>
                                <li>🏃‍♂️ Sedentarismo</li>
                                <li>⚖️ Obesidad</li>
                            </ul>
                        </div>
                    </div>
                `,
                diagram: 'risk_factors'
            },
            {
                title: "🩺 Examen PSA (Antígeno Prostático Específico)",
                content: `
                    <p>El <span class="highlight">PSA es una proteína</span> producida por la próstata. Niveles elevados pueden indicar problemas.</p>
                    <div class="psa-levels">
                        <div class="level-normal">
                            <h4>✅ Normal: 0-4 ng/mL</h4>
                            <p>Generalmente indica próstata saludable</p>
                        </div>
                        <div class="level-borderline">
                            <h4>⚠️ Límite: 4-10 ng/mL</h4>
                            <p>Requiere evaluación adicional</p>
                        </div>
                        <div class="level-high">
                            <h4>🔴 Elevado: >10 ng/mL</h4>
                            <p>Mayor probabilidad de cáncer</p>
                        </div>
                    </div>
                    <p><strong>📝 Importante:</strong> El PSA puede elevarse por otras causas (infección, agrandamiento benigno)</p>
                `,
                diagram: 'psa_test'
            },
            {
                title: "👩‍⚕️ Tacto Rectal Digital (DRE)",
                content: `
                    <p>El médico examina la próstata a través del recto para detectar:</p>
                    <div class="dre-findings">
                        <div class="finding-normal">
                            <h4>✅ Normal:</h4>
                            <ul>
                                <li>🤏 Tamaño apropiado</li>
                                <li>🟢 Textura suave</li>
                                <li>📏 Bordes regulares</li>
                            </ul>
                        </div>
                        <div class="finding-abnormal">
                            <h4>⚠️ Señales de Alerta:</h4>
                            <ul>
                                <li>🔴 Nódulos duros</li>
                                <li>📐 Asimetría marcada</li>
                                <li>🗻 Textura irregular</li>
                            </ul>
                        </div>
                    </div>
                    <p><strong>💡 Dato:</strong> Solo puede detectar tumores en la parte posterior de la próstata</p>
                `,
                diagram: 'dre_exam'
            },
            {
                title: "🚨 Síntomas y Señales de Alerta",
                content: `
                    <p>El cáncer de próstata temprano <span class="highlight">raramente causa síntomas</span>, pero debes estar atento a:</p>
                    <div class="symptoms-grid">
                        <div class="symptom-category">
                            <h4>🚽 Síntomas Urinarios:</h4>
                            <ul>
                                <li>💧 Dificultad para iniciar la micción</li>
                                <li>⏳ Flujo débil o interrumpido</li>
                                <li>🔄 Frecuencia aumentada (especialmente de noche)</li>
                                <li>🩸 Sangre en la orina</li>
                            </ul>
                        </div>
                        <div class="symptom-category">
                            <h4>⚡ Otros Síntomas:</h4>
                            <ul>
                                <li>🦴 Dolor en huesos (espalda, caderas)</li>
                                <li>💊 Disfunción eréctil</li>
                                <li>🩸 Sangre en el semen</li>
                                <li>😣 Dolor al eyacular</li>
                            </ul>
                        </div>
                    </div>
                    <p><strong>⚠️ Importante:</strong> Estos síntomas pueden tener otras causas. ¡Consulta siempre a tu médico!</p>
                `,
                diagram: 'symptoms'
            }
        ];
        
        console.log('✅ ProstateCancerGame inicializado correctamente');
        console.log('🎯 Fase inicial:', this.currentPhase);
    }
    
    init() {
        console.log('🎮 Inicializando Prostate Cancer Game...');
        this.updateHUD();
        this.showScreen('intro-screen');
    }
    
    startMission() {
        console.log('🚀 INICIANDO MISIÓN DE PRÓSTATA...');
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
            console.log('📺 Pantalla mostrada:', screenId);
        }
    }
    
    updateHUD() {
        document.getElementById('current-score').textContent = this.score;
        
        // Actualizar timer si está corriendo
        if (this.timer && this.gameStartTime) {
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
        if (this.timer) clearInterval(this.timer);
        
        this.timer = setInterval(() => {
            if (!this.isPaused) {
                this.updateHUD();
            }
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
        this.endGame('timeout');
    }
    
    loadTutorialStep() {
        const step = this.tutorialSteps[this.tutorialStep];
        if (!step) return;
        
        // Actualizar contenido
        const instructionCard = document.getElementById('instruction-card');
        instructionCard.innerHTML = `
            <h3>${step.title}</h3>
            <div class="tutorial-content">
                ${step.content}
            </div>
        `;
        
        // Actualizar progreso
        const progress = ((this.tutorialStep + 1) / this.tutorialSteps.length) * 100;
        const progressFill = document.getElementById('tutorial-progress');
        if (progressFill) {
            progressFill.style.width = `${progress}%`;
        }
        
        // Actualizar contadores
        document.getElementById('current-step').textContent = this.tutorialStep + 1;
        document.getElementById('total-steps').textContent = this.tutorialSteps.length;
        
        // Actualizar botones
        const btnPrevious = document.getElementById('btn-prev');
        const btnNext = document.getElementById('btn-next');
        
        if (btnPrevious) btnPrevious.disabled = this.tutorialStep === 0;
        
        if (btnNext) {
            if (this.tutorialStep === this.tutorialSteps.length - 1) {
                btnNext.innerHTML = '<i class="fas fa-stethoscope"></i> Ir a Exámenes';
                btnNext.onclick = () => this.startExamination();
            } else {
                btnNext.innerHTML = 'Siguiente <i class="fas fa-arrow-right"></i>';
                btnNext.onclick = () => this.nextStep();
            }
        }
        
        console.log('📖 Tutorial paso cargado:', this.tutorialStep + 1);
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
    
    startExamination() {
        console.log('🩺 Iniciando simulación de exámenes');
        this.currentPhase = 'examination';
        this.showScreen('examination-screen');
        this.showExamType('psa');
        this.addScore(100); // Bonus por completar tutorial
    }
    
    showExamType(examType) {
        this.currentExamType = examType;
        
        // Actualizar tabs
        document.querySelectorAll('.tab-button').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[onclick="prostateCancerGame.showExamType('${examType}')"]`).classList.add('active');
        
        const examContent = document.getElementById('exam-content');
        
        if (examType === 'psa') {
            examContent.innerHTML = `
                <div class="psa-simulation">
                    <h3>🧪 Simulación de Examen PSA</h3>
                    <div class="psa-scenario">
                        <p><strong>Escenario:</strong> Hombre de 55 años, sin síntomas, chequeo preventivo</p>
                        <div class="psa-result-simulator">
                            <div class="lab-report">
                                <h4>📋 Reporte de Laboratorio</h4>
                                <div class="psa-value-display">
                                    <span class="test-name">PSA Total:</span>
                                    <span class="test-value" id="psa-value">3.2</span>
                                    <span class="test-unit">ng/mL</span>
                                </div>
                                <div class="reference-range">
                                    Rango de referencia: 0.0 - 4.0 ng/mL
                                </div>
                            </div>
                            <div class="interpretation-question">
                                <p><strong>🤔 ¿Cómo interpretarías este resultado?</strong></p>
                                <div class="exam-options">
                                    <button class="option-btn" onclick="prostateCancerGame.selectExamAnswer('psa', 'normal')">
                                        ✅ Normal - No requiere acción inmediata
                                    </button>
                                    <button class="option-btn" onclick="prostateCancerGame.selectExamAnswer('psa', 'borderline')">
                                        ⚠️ Límite - Repetir en 6 meses
                                    </button>
                                    <button class="option-btn" onclick="prostateCancerGame.selectExamAnswer('psa', 'high')">
                                        🔴 Elevado - Biopsia inmediata
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (examType === 'dre') {
            examContent.innerHTML = `
                <div class="dre-simulation">
                    <h3>👩‍⚕️ Simulación de Tacto Rectal Digital</h3>
                    <div class="dre-scenario">
                        <p><strong>Escenario:</strong> Durante el examen físico, el médico realiza el DRE</p>
                        <div class="dre-visualization">
                            <div class="prostate-diagram">
                                <h4>🔍 Hallazgos del Examen</h4>
                                <div class="prostate-model">
                                    <div class="prostate-zones">
                                        <div class="zone normal" data-zone="left">Lóbulo Izquierdo</div>
                                        <div class="zone suspicious" data-zone="right">Lóbulo Derecho</div>
                                    </div>
                                    <p class="exam-findings">
                                        <strong>Hallazgos:</strong> Lóbulo izquierdo normal, 
                                        lóbulo derecho con nódulo firme de ~1cm
                                    </p>
                                </div>
                            </div>
                            <div class="interpretation-question">
                                <p><strong>🤔 ¿Cuál sería el siguiente paso?</strong></p>
                                <div class="exam-options">
                                    <button class="option-btn" onclick="prostateCancerGame.selectExamAnswer('dre', 'wait')">
                                        ⏳ Observar y repetir en 1 año
                                    </button>
                                    <button class="option-btn" onclick="prostateCancerGame.selectExamAnswer('dre', 'psa')">
                                        🧪 Solicitar PSA adicional
                                    </button>
                                    <button class="option-btn" onclick="prostateCancerGame.selectExamAnswer('dre', 'biopsy')">
                                        🎯 Referir para biopsia
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    }
    
    selectExamAnswer(examType, answer) {
        // Remover selección anterior
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Marcar nueva selección
        event.target.classList.add('selected');
        
        let feedback = '';
        let isCorrect = false;
        
        if (examType === 'psa' && answer === 'normal') {
            feedback = '✅ ¡Correcto! PSA de 3.2 ng/mL está dentro del rango normal. Continúa con chequeos anuales.';
            isCorrect = true;
        } else if (examType === 'dre' && answer === 'biopsy') {
            feedback = '✅ ¡Excelente! Un nódulo firme detectado en DRE requiere evaluación con biopsia.';
            isCorrect = true;
        } else {
            feedback = '❌ No es la mejor opción. Revisa la información del tutorial.';
        }
        
        // Mostrar feedback
        const existingFeedback = document.querySelector('.exam-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = 'exam-feedback';
        feedbackDiv.innerHTML = `<p>${feedback}</p>`;
        document.querySelector('.exam-options').appendChild(feedbackDiv);
        
        if (isCorrect) {
            this.addScore(50);
        }
        
        console.log('🩺 Respuesta de examen:', examType, answer, isCorrect);
    }
    
    addScore(points) {
        this.score = Math.max(0, this.score + points);
        this.updateHUD();
        
        // Animación de puntuación
        if (points > 0) {
            this.showScoreAnimation(points);
        }
    }
    
    showScoreAnimation(points) {
        const scoreElement = document.getElementById('current-score');
        if (!scoreElement) return;
        
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
    
    continueToQuiz() {
        console.log('🧠 Iniciando quiz');
        this.currentPhase = 'quiz';
        this.showScreen('quiz-screen');
        this.loadQuestion();
        this.addScore(200); // Bonus por completar exámenes
    }
    
    loadQuestion() {
        const question = window.prostateCancerQuestions[this.currentQuestion];
        if (!question) {
            this.endGame('completed');
            return;
        }
        
        // Actualizar contador
        document.getElementById('current-question').textContent = this.currentQuestion + 1;
        document.getElementById('total-questions').textContent = window.prostateCancerQuestions.length;
        
        // Cargar pregunta
        document.getElementById('question-text').textContent = question.question;
        
        // Cargar respuestas
        const answersContainer = document.getElementById('answers-container');
        answersContainer.innerHTML = '';
        
        question.answers.forEach((answer, index) => {
            const answerDiv = document.createElement('div');
            answerDiv.className = 'answer-option';
            answerDiv.innerHTML = `
                <input type="radio" id="answer_${index}" name="answer" value="${index}">
                <label for="answer_${index}">${answer}</label>
            `;
            answerDiv.addEventListener('click', () => {
                document.getElementById(`answer_${index}`).checked = true;
                this.selectedAnswer = index;
                document.getElementById('btn-submit').disabled = false;
            });
            answersContainer.appendChild(answerDiv);
        });
        
        // Limpiar feedback anterior
        document.getElementById('question-feedback').innerHTML = '';
        
        // Reset botones
        document.getElementById('btn-submit').disabled = true;
        document.getElementById('btn-submit').style.display = 'inline-block';
        document.getElementById('btn-next').style.display = 'none';
        
        this.selectedAnswer = null;
        console.log('❓ Pregunta cargada:', this.currentQuestion + 1);
    }
    
    submitAnswer() {
        if (this.selectedAnswer === null) return;
        
        const question = window.prostateCancerQuestions[this.currentQuestion];
        const isCorrect = this.selectedAnswer === question.correctAnswer;
        
        // Mostrar feedback
        const feedbackDiv = document.getElementById('question-feedback');
        feedbackDiv.innerHTML = `
            <div class="feedback ${isCorrect ? 'correct' : 'incorrect'}">
                <p>${isCorrect ? '✅ ¡Correcto!' : '❌ Incorrecto'}</p>
                <p class="explanation">${question.explanation}</p>
            </div>
        `;
        
        // Marcar respuestas
        document.querySelectorAll('.answer-option').forEach((option, index) => {
            if (index === question.correctAnswer) {
                option.classList.add('correct');
            } else if (index === this.selectedAnswer && !isCorrect) {
                option.classList.add('incorrect');
            }
            option.style.pointerEvents = 'none';
        });
        
        // Actualizar puntuación
        if (isCorrect) {
            this.addScore(100);
        }
        
        // Cambiar botones
        document.getElementById('btn-submit').style.display = 'none';
        document.getElementById('btn-next').style.display = 'inline-block';
        
        console.log('📝 Respuesta enviada:', isCorrect, 'Puntuación:', this.score);
    }
    
    nextQuestion() {
        this.currentQuestion++;
        this.loadQuestion();
    }
    
    endGame(reason) {
        console.log('🏁 Fin del juego:', reason);
        this.currentPhase = 'results';
        
        this.stopTimer();
        
        // Calcular estadísticas
        const totalQuestions = window.prostateCancerQuestions ? window.prostateCancerQuestions.length : 10;
        const correctAnswers = Math.floor(this.score / 100);
        this.accuracy = Math.round((correctAnswers / totalQuestions) * 100);
        
        // Calcular tiempo transcurrido
        const totalTime = this.gameStartTime ? Math.floor((new Date() - this.gameStartTime) / 1000) : 0;
        const minutes = Math.floor(totalTime / 60);
        const seconds = totalTime % 60;
        
        // Mostrar resultados
        this.showScreen('results-screen');
        
        // Actualizar elementos de resultados
        const finalScoreElement = document.getElementById('final-score');
        const accuracyStatElement = document.getElementById('accuracy-score');
        const timeStatElement = document.getElementById('completion-time');
        
        if (finalScoreElement) finalScoreElement.textContent = this.score;
        if (accuracyStatElement) accuracyStatElement.textContent = `${this.accuracy}%`;
        if (timeStatElement) timeStatElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Calcular logros
        this.loadAchievements();
        
        // Guardar progreso
        this.saveProgress();
        
        // Enviar puntuación al servidor si el usuario está autenticado
        if (window.authClient && window.authClient.isAuthenticated() && reason === 'completed') {
            this.submitScore();
        }
    }
    
    loadAchievements() {
        const achievements = [];
        
        if (this.accuracy >= 90) {
            achievements.push({ icon: '🎯', title: 'Experto en Salud', description: 'Precisión superior al 90%' });
        }
        
        if (this.score >= 500) {
            achievements.push({ icon: '🏆', title: 'Detective Destacado', description: 'Puntuación alta' });
        }
        
        if (this.gameTime > 120) {
            achievements.push({ icon: '⚡', title: 'Eficiencia', description: 'Completado con tiempo sobran' });
        }
        
        const achievementsGrid = document.getElementById('achievements-grid');
        achievementsGrid.innerHTML = achievements.map(achievement => `
            <div class="achievement">
                <div class="achievement-icon">${achievement.icon}</div>
                <h4>${achievement.title}</h4>
                <p>${achievement.description}</p>
            </div>
        `).join('');
        
        this.achievements = achievements;
    }
    
    saveProgress() {
        const progress = {
            level: 'prostate-cancer',
            completed: true,
            score: this.score,
            accuracy: this.accuracy,
            achievements: this.achievements,
            completionTime: new Date().toISOString()
        };
        
        const existingProgress = JSON.parse(localStorage.getItem('vitaGuardProgress') || '{}');
        existingProgress.prostateCancer = progress;
        localStorage.setItem('vitaGuardProgress', JSON.stringify(existingProgress));
    }
    
    saveScore() {
        console.log('💾 Guardando puntuación...');
        
        if (!window.authClient || !window.authClient.isAuthenticated()) {
            console.log('❌ Usuario no autenticado');
            alert('¡Inicia sesión para guardar tu puntuación!');
            return;
        }
        
        // Enviar puntuación al servidor
        this.submitScore();
    }
    
    async submitScore() {
        try {
            const totalQuestions = window.prostateCancerQuestions ? window.prostateCancerQuestions.length : 10;
            const correctAnswers = Math.floor(this.score / 100);
            
            const scoreData = {
                level_type: 'prostata',
                score: this.score,
                time_taken: this.gameStartTime ? Math.floor((new Date() - this.gameStartTime) / 1000) : 0,
                anomalies_found: correctAnswers,
                total_anomalies: totalQuestions
            };
            
            console.log('📊 Enviando puntuación:', scoreData);
            
            const result = await window.authClient.submitScore(scoreData);
            
            console.log('✅ Puntuación enviada exitosamente:', result);
            alert('¡Puntuación guardada exitosamente!');
            
        } catch (error) {
            console.error('❌ Error al enviar puntuación:', error);
            alert('Error al guardar la puntuación. Inténtalo nuevamente.');
        }
    }
    
    playAgain() {
        console.log('🔄 Reiniciando juego');
        window.location.reload();
    }
    
    goToMainMenu() {
        console.log('🏠 Volviendo al menú principal');
        window.location.href = 'index.html';
    }
    
    goBack() {
        console.log('⬅️ Volviendo al menú');
        window.location.href = 'index.html';
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        const pauseOverlay = document.getElementById('pause-overlay');
        
        if (this.isPaused) {
            pauseOverlay.classList.remove('hidden');
            console.log('⏸️ Juego pausado');
        } else {
            pauseOverlay.classList.add('hidden');
            console.log('▶️ Juego reanudado');
        }
    }
    
    resumeGame() {
        this.togglePause();
    }
    
    restartLevel() {
        console.log('🔄 Reiniciando nivel');
        window.location.reload();
    }
}

// Inicialización automática cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
    if (typeof window.prostateCancerQuestions === 'undefined') {
        console.warn('⚠️ Datos del quiz no cargados aún');
    }
});