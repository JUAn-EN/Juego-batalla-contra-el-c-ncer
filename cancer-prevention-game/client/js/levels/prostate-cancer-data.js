// Datos educativos para el nivel de Cáncer de Próstata
window.prostateCancerQuestions = [
    {
        question: "¿Cuál es la edad recomendada para comenzar las conversaciones sobre detección de cáncer de próstata?",
        answers: [
            "40 años para todos los hombres",
            "50 años para riesgo promedio, 45 para alto riesgo",
            "60 años para todos los hombres",
            "Solo cuando aparezcan síntomas"
        ],
        correctAnswer: 1,
        explanation: "Los hombres con riesgo promedio deben hablar con su médico a los 50 años, mientras que aquellos con alto riesgo (historial familiar, origen afroamericano) deben hacerlo a los 45 años."
    },
    {
        question: "¿Qué significa PSA en términos médicos?",
        answers: [
            "Proteína Específica Avanzada",
            "Antígeno Prostático Específico",
            "Prueba de Salud Andina",
            "Proceso de Síntesis Abdominal"
        ],
        correctAnswer: 1,
        explanation: "PSA significa Antígeno Prostático Específico, una proteína producida por las células de la próstata que se mide en un análisis de sangre."
    },
    {
        question: "¿Cuál es el rango normal de PSA en la mayoría de los hombres?",
        answers: [
            "0-2 ng/mL",
            "0-4 ng/mL",
            "0-10 ng/mL",
            "2-8 ng/mL"
        ],
        correctAnswer: 1,
        explanation: "El rango normal de PSA es generalmente de 0-4 ng/mL, aunque puede variar según la edad y otros factores. Niveles superiores requieren evaluación adicional."
    },
    {
        question: "¿Cuál NO es un factor de riesgo para el cáncer de próstata?",
        answers: [
            "Edad avanzada",
            "Historial familiar de cáncer de próstata",
            "Ser de origen afroamericano",
            "Ser zurdo"
        ],
        correctAnswer: 3,
        explanation: "Ser zurdo no tiene relación con el cáncer de próstata. Los principales factores de riesgo son la edad, historial familiar y origen étnico."
    },
    {
        question: "¿Qué puede causar una elevación temporal del PSA además del cáncer?",
        answers: [
            "Ejercicio intenso reciente",
            "Infección de próstata",
            "Agrandamiento benigno de próstata",
            "Todas las anteriores"
        ],
        correctAnswer: 3,
        explanation: "El PSA puede elevarse por múltiples causas benignas: ejercicio, ciclismo, infecciones, hiperplasia benigna de próstata, o incluso el tacto rectal reciente."
    },
    {
        question: "¿Cuándo debe un hombre considerar hacerse el tacto rectal digital (DRE)?",
        answers: [
            "Solo si tiene síntomas urinarios",
            "Como parte del chequeo preventivo anual después de los 50",
            "Solo si el PSA está elevado",
            "Nunca es necesario si el PSA es normal"
        ],
        correctAnswer: 1,
        explanation: "El DRE debe ser parte del chequeo preventivo porque puede detectar anormalidades que el PSA no detecta, especialmente en la parte posterior de la próstata."
    },
    {
        question: "¿Cuál es el síntoma MÁS común del cáncer de próstata temprano?",
        answers: [
            "Dolor al orinar",
            "Sangre en la orina",
            "Ningún síntoma",
            "Dificultad para orinar"
        ],
        correctAnswer: 2,
        explanation: "El cáncer de próstata en etapas tempranas generalmente NO causa síntomas, por eso la detección preventiva es tan importante."
    },
    {
        question: "¿Qué porcentaje aproximado de hombres desarrollará cáncer de próstata en su vida?",
        answers: [
            "1 de cada 20 (5%)",
            "1 de cada 9 (11%)",
            "1 de cada 4 (25%)",
            "1 de cada 2 (50%)"
        ],
        correctAnswer: 1,
        explanation: "Aproximadamente 1 de cada 9 hombres será diagnosticado con cáncer de próstata durante su vida, siendo más común después de los 65 años."
    },
    {
        question: "¿Cuál es la tasa de supervivencia a 5 años para el cáncer de próstata detectado temprano?",
        answers: [
            "Menos del 50%",
            "Aproximadamente 70%",
            "Aproximadamente 85%",
            "Cerca del 100%"
        ],
        correctAnswer: 3,
        explanation: "Cuando se detecta en etapas tempranas (antes de que se extienda fuera de la próstata), la tasa de supervivencia a 5 años es cercana al 100%."
    },
    {
        question: "¿Qué factor de estilo de vida puede ayudar a reducir el riesgo de cáncer de próstata?",
        answers: [
            "Consumir más tomates (licopeno)",
            "Hacer ejercicio regularmente",
            "Mantener un peso saludable",
            "Todas las anteriores"
        ],
        correctAnswer: 3,
        explanation: "Una dieta rica en licopeno (tomates), ejercicio regular y mantener un peso saludable pueden ayudar a reducir el riesgo de cáncer de próstata."
    }
];

// Información adicional sobre cáncer de próstata
window.prostateCancerInfo = {
    statistics: {
        prevalence: "1 de cada 9 hombres será diagnosticado",
        ageRisk: "Riesgo aumenta significativamente después de los 50",
        survivalRate: "Casi 100% de supervivencia cuando se detecta temprano",
        ethnicRisk: "Los hombres afroamericanos tienen mayor riesgo"
    },
    
    riskFactors: {
        unmodifiable: [
            "Edad (especialmente +65 años)",
            "Historial familiar directo",
            "Origen étnico afroamericano",
            "Ciertas mutaciones genéticas (BRCA2)"
        ],
        modifiable: [
            "Dieta alta en grasas saturadas",
            "Obesidad",
            "Sedentarismo",
            "Exposición a ciertos químicos"
        ]
    },
    
    preventionTips: [
        "Mantener una dieta rica en frutas y verduras",
        "Ejercitarse regularmente (al menos 150 min/semana)",
        "Mantener un peso corporal saludable",
        "Limitar el consumo de grasas saturadas",
        "Considerar alimentos ricos en licopeno (tomates)",
        "Conversar con el médico sobre chequeos preventivos"
    ],
    
    warningSymptoms: [
        "Dificultad para iniciar o detener la micción",
        "Flujo urinario débil o interrumpido",
        "Necesidad frecuente de orinar, especialmente de noche",
        "Sangre en la orina o semen",
        "Dolor o ardor al orinar",
        "Dolor en la espalda baja, cadera o pelvis",
        "Disfunción eréctil"
    ],
    
    screeningGuidelines: {
        averageRisk: {
            startAge: 50,
            frequency: "Anual o según recomendación médica",
            tests: ["PSA", "Tacto rectal digital (DRE)"]
        },
        highRisk: {
            startAge: 45,
            riskFactors: ["Historial familiar", "Origen afroamericano"],
            frequency: "Anual",
            tests: ["PSA", "Tacto rectal digital (DRE)"]
        },
        veryHighRisk: {
            startAge: 40,
            riskFactors: ["Múltiples familiares afectados", "Mutaciones BRCA2"],
            frequency: "Según recomendación médica especializada",
            tests: ["PSA", "DRE", "Posible resonancia magnética"]
        }
    },
    
    psaInterpretation: {
        normal: {
            range: "0-4 ng/mL",
            action: "Continuar con chequeos regulares",
            note: "El nivel puede variar según la edad"
        },
        borderline: {
            range: "4-10 ng/mL",
            action: "Evaluación adicional requerida",
            note: "Podría ser cáncer u otra condición"
        },
        elevated: {
            range: ">10 ng/mL",
            action: "Evaluación urológica inmediata",
            note: "Mayor probabilidad de cáncer"
        }
    },
    
    mythsAndFacts: [
        {
            myth: "El cáncer de próstata solo afecta a hombres mayores",
            fact: "Aunque es más común en mayores de 65, puede ocurrir en hombres más jóvenes, especialmente con factores de riesgo."
        },
        {
            myth: "Un PSA elevado siempre significa cáncer",
            fact: "El PSA puede elevarse por infecciones, agrandamiento benigno, ejercicio o ciclismo reciente."
        },
        {
            myth: "Si no hay síntomas, no hay problema",
            fact: "El cáncer de próstata temprano raramente causa síntomas, por eso la detección preventiva es crucial."
        },
        {
            myth: "El tacto rectal es suficiente para detectar cáncer",
            fact: "El DRE solo puede detectar tumores en la parte posterior de la próstata y tumores ya considerables."
        },
        {
            myth: "El cáncer de próstata siempre es mortal",
            fact: "Con detección temprana, las tasas de supervivencia son excelentes, cerca del 100% a 5 años."
        }
    ]
};

// Recursos educativos adicionales
window.prostateCancerResources = {
    organizations: [
        {
            name: "Sociedad Americana del Cáncer",
            website: "cancer.org",
            description: "Información completa sobre cáncer de próstata"
        },
        {
            name: "Fundación del Cáncer de Próstata",
            website: "pcf.org", 
            description: "Investigación y recursos para pacientes"
        },
        {
            name: "Instituto Nacional del Cáncer",
            website: "cancer.gov",
            description: "Información médica autorizada"
        }
    ],
    
    supportGroups: [
        "Grupos de apoyo para hombres con cáncer de próstata",
        "Programas de bienestar y ejercicio específicos",
        "Grupos familiares para cuidadores",
        "Comunidades en línea de sobrevivientes"
    ]
};

console.log('📚 Datos educativos de cáncer de próstata cargados exitosamente');
console.log('🎯 Total de preguntas:', window.prostateCancerQuestions.length);