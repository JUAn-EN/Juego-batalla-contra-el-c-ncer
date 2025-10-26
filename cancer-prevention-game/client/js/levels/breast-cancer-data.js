// Breast Cancer Educational Data and Resources
const BreastCancerData = {
    // Información médica validada
    medicalInfo: {
        statistics: {
            prevalence: "1 de cada 8 mujeres desarrollará cáncer de mama a lo largo de su vida",
            survivalRate: "La tasa de supervivencia a 5 años es del 90% cuando se detecta temprano",
            ageGroup: "Más común después de los 50 años, pero puede ocurrir a cualquier edad",
            riskFactors: [
                "Edad avanzada",
                "Antecedentes familiares",
                "Mutaciones genéticas (BRCA1, BRCA2)",
                "Historial reproductivo",
                "Densidad mamaria",
                "Exposición a radiación",
                "Estilo de vida (alcohol, obesidad)"
            ]
        },
        
        warningSignsDetailed: {
            physical: [
                {
                    sign: "Bulto o masa",
                    description: "Cualquier bulto nuevo o cambio en un bulto existente",
                    urgency: "alta",
                    action: "Consultar médico inmediatamente"
                },
                {
                    sign: "Cambios en la piel",
                    description: "Enrojecimiento, descamación, hoyuelos o textura de naranja",
                    urgency: "alta",
                    action: "Evaluación médica urgente"
                },
                {
                    sign: "Retracción del pezón",
                    description: "Pezón que se hunde hacia adentro de forma nueva",
                    urgency: "alta",
                    action: "Consultar especialista"
                },
                {
                    sign: "Secreción del pezón",
                    description: "Especialmente si es sanguinolenta o unilateral",
                    urgency: "media",
                    action: "Evaluación médica"
                },
                {
                    sign: "Cambio de tamaño o forma",
                    description: "Asimetría nueva o cambio notable en la forma",
                    urgency: "media",
                    action: "Consultar con médico"
                },
                {
                    sign: "Dolor persistente",
                    description: "Dolor que no está relacionado con el ciclo menstrual",
                    urgency: "baja",
                    action: "Observar y consultar si persiste"
                }
            ],
            
            lymphNodes: [
                {
                    location: "Axila",
                    description: "Ganglios inflamados o endurecidos en la axila",
                    significance: "Puede indicar propagación del cáncer"
                },
                {
                    location: "Clavícula",
                    description: "Inflamación cerca o debajo de la clavícula",
                    significance: "Requiere evaluación inmediata"
                }
            ]
        },
        
        selfExamTechnique: {
            frequency: "Mensual, entre el 7º y 10º día después de la menstruación",
            bestTime: "Cuando los senos están menos sensibles",
            duration: "10-15 minutos",
            positions: [
                {
                    name: "De pie frente al espejo",
                    description: "Inspección visual con brazos a los lados y luego elevados",
                    focus: "Forma, simetría, cambios en la piel"
                },
                {
                    name: "Acostada",
                    description: "Palpación sistemática con el brazo elevado",
                    focus: "Detección de bultos o cambios en el tejido"
                },
                {
                    name: "En la ducha",
                    description: "Palpación con la piel húmeda y jabonosa",
                    focus: "Los dedos se deslizan fácilmente sobre la piel"
                }
            ],
            
            palpationTechnique: {
                fingers: "Yemas de los dedos (no las puntas)",
                pressure: ["Ligera - tejido superficial", "Media - tejido intermedio", "Firme - tejido profundo"],
                pattern: "Movimientos circulares del tamaño de una moneda",
                coverage: "Desde la clavícula hasta debajo del seno, desde la axila hasta el esternón"
            }
        },
        
        preventionStrategies: {
            lifestyle: [
                {
                    factor: "Ejercicio regular",
                    recommendation: "Al menos 150 minutos de actividad moderada por semana",
                    impact: "Reduce el riesgo en un 10-20%"
                },
                {
                    factor: "Mantener peso saludable",
                    recommendation: "IMC entre 18.5 y 24.9",
                    impact: "Especialmente importante después de la menopausia"
                },
                {
                    factor: "Limitar el alcohol",
                    recommendation: "No más de 1 bebida al día",
                    impact: "Cada bebida adicional aumenta el riesgo en 7%"
                },
                {
                    factor: "Evitar el tabaco",
                    recommendation: "No fumar",
                    impact: "Reduce múltiples riesgos de cáncer"
                },
                {
                    factor: "Dieta saludable",
                    recommendation: "Rica en frutas, verduras y granos integrales",
                    impact: "Antioxidantes y fibra protectores"
                }
            ],
            
            medicalPreventive: [
                {
                    method: "Mamografía de detección",
                    ageStart: "40-50 años (según factores de riesgo)",
                    frequency: "Anual",
                    effectiveness: "Reduce mortalidad en 20-40%"
                },
                {
                    method: "Examen clínico de mamas",
                    ageStart: "20 años",
                    frequency: "Anual a partir de los 40",
                    effectiveness: "Complementa la autoexploración"
                },
                {
                    method: "Resonancia magnética",
                    indication: "Alto riesgo genético",
                    frequency: "Anual",
                    effectiveness: "Muy sensible para detección temprana"
                },
                {
                    method: "Asesoramiento genético",
                    indication: "Antecedentes familiares fuertes",
                    process: "Evaluación y posible testing genético",
                    effectiveness: "Permite estrategias preventivas personalizadas"
                }
            ]
        }
    },
    
    // Recursos educativos
    educationalResources: {
        myths: [
            {
                myth: "Solo las mujeres con antecedentes familiares desarrollan cáncer de mama",
                fact: "Aproximadamente el 85% de las mujeres con cáncer de mama NO tienen antecedentes familiares"
            },
            {
                myth: "El cáncer de mama siempre se presenta como un bulto",
                fact: "Puede manifestarse como cambios en la piel, forma del seno, o secreción del pezón"
            },
            {
                myth: "Los hombres no pueden tener cáncer de mama",
                fact: "Aunque es raro, aproximadamente 1% de los casos de cáncer de mama ocurre en hombres"
            },
            {
                myth: "Los sostenes con varillas causan cáncer de mama",
                fact: "No hay evidencia científica que respalde esta afirmación"
            },
            {
                myth: "El cáncer de mama es siempre hereditario",
                fact: "Solo 5-10% de los casos se deben a mutaciones genéticas heredadas"
            }
        ],
        
        terminology: {
            "Autoexploración": "Examen personal regular de los senos para detectar cambios",
            "Mamografía": "Radiografía especializada de la mama",
            "Biopsia": "Extracción de una pequeña muestra de tejido para análisis",
            "BRCA1/BRCA2": "Genes que, cuando están mutados, aumentan el riesgo de cáncer",
            "Densidad mamaria": "Proporción de tejido glandular vs. tejido graso",
            "Carcinoma ductal": "Tipo más común de cáncer de mama",
            "Carcinoma lobular": "Segundo tipo más común de cáncer de mama",
            "Metástasis": "Propagación del cáncer a otras partes del cuerpo"
        },
        
        supportResources: [
            {
                type: "Líneas de ayuda",
                name: "Liga Contra el Cáncer",
                contact: "800-2652-623",
                description: "Apoyo e información gratuita"
            },
            {
                type: "Organizaciones",
                name: "Fundación Cáncer de Mama",
                website: "www.cancerdemama.org",
                description: "Recursos educativos y apoyo"
            },
            {
                type: "Grupos de apoyo",
                name: "Grupos locales de sobrevivientes",
                access: "A través de hospitales y centros oncológicos",
                description: "Apoyo emocional y experiencias compartidas"
            }
        ]
    },
    
    // Datos para gamificación
    gameElements: {
        achievements: [
            {
                id: "knowledge_master",
                name: "Maestro del Conocimiento",
                description: "Responder correctamente todas las preguntas",
                icon: "fas fa-brain",
                condition: "accuracy === 100"
            },
            {
                id: "early_detector",
                name: "Detector Temprano",
                description: "Encontrar todas las anomalías en menos de 3 minutos",
                icon: "fas fa-search-plus",
                condition: "allAnomaliesFound && timeUnder180"
            },
            {
                id: "perfect_explorer",
                name: "Explorador Perfecto",
                description: "Completar sin usar pistas ni perder vidas",
                icon: "fas fa-star",
                condition: "hintsUsed === 0 && lives === 3"
            },
            {
                id: "speed_learner",
                name: "Aprendiz Veloz",
                description: "Completar el tutorial en menos de 5 minutos",
                icon: "fas fa-clock",
                condition: "tutorialTimeUnder300"
            },
            {
                id: "prevention_champion",
                name: "Campeón de la Prevención",
                description: "Obtener puntuación máxima en el nivel",
                icon: "fas fa-trophy",
                condition: "score >= 2000"
            }
        ],
        
        scoringSystem: {
            tutorialStep: 50,
            tutorialComplete: 100,
            normalZoneFound: 100,
            anomalyFound: 200,
            correctAnswer: 150,
            timeBonus: 2, // por segundo restante
            lifeBonus: 100, // por vida restante
            noHintBonus: 200,
            hintPenalty: -25,
            speedBonus: 300 // por completar rápido
        },
        
        difficultyLevels: {
            beginner: {
                name: "Principiante",
                description: "Introducción básica con guía paso a paso",
                lives: 5,
                time: 600, // 10 minutos
                hintsAvailable: 5,
                anomaliesCount: 3
            },
            intermediate: {
                name: "Intermedio",
                description: "Práctica con menos ayuda",
                lives: 3,
                time: 300, // 5 minutos
                hintsAvailable: 3,
                anomaliesCount: 5
            },
            expert: {
                name: "Experto",
                description: "Desafío para conocedores avanzados",
                lives: 1,
                time: 180, // 3 minutos
                hintsAvailable: 1,
                anomaliesCount: 7
            }
        }
    },
    
    // Contenido multimedia
    multimedia: {
        animations: [
            {
                name: "selfExamDemo",
                description: "Demostración animada de autoexploración",
                duration: 30,
                keyframes: ["preparation", "inspection", "palpation", "zones"]
            },
            {
                name: "anatomyExplorer",
                description: "Explorador interactivo de anatomía mamaria",
                features: ["layers", "zoom", "labels", "navigation"]
            }
        ],
        
        sounds: {
            success: "Sonido de éxito al encontrar zona normal",
            anomaly: "Alerta suave al detectar anomalía",
            correct: "Confirmación de respuesta correcta",
            wrong: "Sonido suave de respuesta incorrecta",
            complete: "Melodía de nivel completado",
            achievement: "Sonido especial de logro desbloqueado"
        }
    }
};

// Funciones utilitarias para el juego
const BreastCancerUtils = {
    // Validar si una edad requiere mamografías regulares
    requiresMammography(age, riskFactors = []) {
        if (age >= 50) return true;
        if (age >= 40 && riskFactors.includes('family_history')) return true;
        if (riskFactors.includes('genetic_mutation')) return true;
        return false;
    },
    
    // Calcular riesgo relativo basado en factores
    calculateRiskLevel(factors) {
        let riskScore = 1.0; // Riesgo base
        
        const riskMultipliers = {
            age_over_50: 1.5,
            family_history: 2.0,
            genetic_mutation: 5.0,
            previous_cancer: 3.0,
            dense_breasts: 1.5,
            late_menopause: 1.3,
            early_menstruation: 1.2,
            no_children: 1.1,
            first_child_after_30: 1.1,
            hormone_therapy: 1.3,
            alcohol_daily: 1.1,
            obesity_postmenopausal: 1.3
        };
        
        factors.forEach(factor => {
            if (riskMultipliers[factor]) {
                riskScore *= riskMultipliers[factor];
            }
        });
        
        if (riskScore < 1.5) return 'bajo';
        if (riskScore < 2.5) return 'moderado';
        if (riskScore < 4.0) return 'alto';
        return 'muy_alto';
    },
    
    // Generar recomendaciones personalizadas
    generateRecommendations(age, riskLevel, lastExam = null) {
        const recommendations = [];
        
        // Autoexploración
        recommendations.push({
            type: 'autoexamen',
            frequency: 'mensual',
            priority: 'alta',
            description: 'Continúa realizando autoexploración mensual'
        });
        
        // Examen clínico
        if (age >= 20) {
            recommendations.push({
                type: 'examen_clinico',
                frequency: age >= 40 ? 'anual' : 'cada_3_años',
                priority: 'alta',
                description: 'Examen clínico de mamas por profesional'
            });
        }
        
        // Mamografía
        if (age >= 40 || riskLevel === 'alto' || riskLevel === 'muy_alto') {
            recommendations.push({
                type: 'mamografia',
                frequency: 'anual',
                priority: 'crítica',
                description: 'Mamografía de detección anual'
            });
        }
        
        // RM si alto riesgo
        if (riskLevel === 'muy_alto') {
            recommendations.push({
                type: 'resonancia',
                frequency: 'anual',
                priority: 'crítica',
                description: 'Resonancia magnética adicional'
            });
        }
        
        // Asesoramiento genético
        if (riskLevel === 'alto' || riskLevel === 'muy_alto') {
            recommendations.push({
                type: 'asesoramiento_genetico',
                frequency: 'una_vez',
                priority: 'alta',
                description: 'Evaluación genética con especialista'
            });
        }
        
        return recommendations;
    },
    
    // Formatear información educativa para mostrar
    formatEducationalContent(topic) {
        const content = BreastCancerData.medicalInfo;
        
        switch(topic) {
            case 'warning_signs':
                return content.warningSignsDetailed.physical.map(sign => ({
                    title: sign.sign,
                    description: sign.description,
                    urgency: sign.urgency,
                    action: sign.action
                }));
                
            case 'prevention':
                return content.preventionStrategies.lifestyle.map(strategy => ({
                    factor: strategy.factor,
                    recommendation: strategy.recommendation,
                    impact: strategy.impact
                }));
                
            case 'self_exam':
                return {
                    technique: content.selfExamTechnique,
                    frequency: content.selfExamTechnique.frequency,
                    positions: content.selfExamTechnique.positions
                };
                
            default:
                return null;
        }
    }
};

// Exportar para uso en el juego
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BreastCancerData, BreastCancerUtils };
} else {
    window.BreastCancerData = BreastCancerData;
    window.BreastCancerUtils = BreastCancerUtils;
}

console.log('📚 Breast Cancer educational data loaded successfully!');