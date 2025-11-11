// ============================================
// DATOS DEL NIVEL DE CÁNCER DE COLON
// ============================================

const COLON_DATA = {
    // Factores de riesgo y protección
    riskFactors: [
        // PROTECCIÓN
        {
            id: "protect1",
            name: "Dieta rica en fibra",
            type: "protection",
            icon: "🌾",
            explanation: "La fibra ayuda a mantener el colon limpio y saludable",
            points: 150
        },
        {
            id: "protect2",
            name: "Ejercicio regular",
            type: "protection",
            icon: "🏃",
            explanation: "30 minutos diarios reducen el riesgo en 50%",
            points: 150
        },
        {
            id: "protect3",
            name: "Colonoscopías regulares",
            type: "protection",
            icon: "🔬",
            explanation: "La detección temprana salva vidas",
            points: 200
        },
        {
            id: "protect4",
            name: "Consumo de vegetales",
            type: "protection",
            icon: "🥦",
            explanation: "Vegetales crucíferos protegen el colon",
            points: 150
        },
        {
            id: "protect5",
            name: "Mantener peso saludable",
            type: "protection",
            icon: "⚖️",
            explanation: "Obesidad aumenta el riesgo en 30%",
            points: 150
        },
        {
            id: "protect6",
            name: "Limitar alcohol",
            type: "protection",
            icon: "🚫",
            explanation: "Máximo 1-2 bebidas al día",
            points: 150
        },

        // RIESGO
        {
            id: "risk1",
            name: "Dieta alta en carnes rojas",
            type: "danger",
            icon: "🥩",
            explanation: "Carnes procesadas aumentan riesgo en 18%",
            points: 150
        },
        {
            id: "risk2",
            name: "Sedentarismo",
            type: "danger",
            icon: "🛋️",
            explanation: "Falta de ejercicio duplica el riesgo",
            points: 150
        },
        {
            id: "risk3",
            name: "Tabaquismo",
            type: "danger",
            icon: "🚬",
            explanation: "Fumar aumenta pólipos precancerosos",
            points: 150
        },
        {
            id: "risk4",
            name: "Consumo excesivo de alcohol",
            type: "danger",
            icon: "🍺",
            explanation: "Más de 3 bebidas diarias aumentan riesgo",
            points: 150
        },
        {
            id: "risk5",
            name: "Edad mayor a 50 años",
            type: "danger",
            icon: "📅",
            explanation: "90% de casos ocurren después de los 50",
            points: 100
        },
        {
            id: "risk6",
            name: "No hacerse screening",
            type: "danger",
            icon: "❌",
            explanation: "Detección tardía reduce supervivencia",
            points: 200
        }
    ],

    // Secciones del colon para colonoscopía virtual
    colonSections: [
        {
            id: 1,
            name: "Ciego",
            description: "Inicio del intestino grueso, conexión con intestino delgado",
            healthStatus: "normal",
            findings: "Mucosa rosada y lisa, sin lesiones",
            points: 200
        },
        {
            id: 2,
            name: "Colon Ascendente",
            description: "Sube por el lado derecho del abdomen",
            healthStatus: "normal",
            findings: "Tejido sano, vascularización normal",
            points: 200
        },
        {
            id: 3,
            name: "Colon Transverso",
            description: "Cruza horizontalmente el abdomen",
            healthStatus: "polyp",
            findings: "Pólipo pequeño detectado (5mm)",
            points: 300
        },
        {
            id: 4,
            name: "Colon Descendente",
            description: "Baja por el lado izquierdo del abdomen",
            healthStatus: "normal",
            findings: "Sin anomalías detectadas",
            points: 200
        },
        {
            id: 5,
            name: "Colon Sigmoide",
            description: "Curva en forma de S antes del recto",
            healthStatus: "inflammation",
            findings: "Leve inflamación, monitoreo recomendado",
            points: 250
        }
    ],

    // Tipos de pólipos
    polyps: [
        {
            id: 1,
            name: "Pólipo Hiperplásico",
            type: "benign",
            size: "< 5mm",
            characteristics: "Pequeño, liso, color claro",
            risk: "Muy bajo riesgo de malignidad",
            action: "Monitoreo cada 10 años",
            points: 200
        },
        {
            id: 2,
            name: "Adenoma Tubular",
            type: "precancerous",
            size: "5-10mm",
            characteristics: "Superficie irregular, pedunculado",
            risk: "Bajo riesgo, puede volverse canceroso",
            action: "Remoción y seguimiento cada 3-5 años",
            points: 300
        },
        {
            id: 3,
            name: "Adenoma Velloso",
            type: "precancerous",
            size: "> 10mm",
            characteristics: "Grande, superficie aterciopelada",
            risk: "Alto riesgo de transformación maligna",
            action: "Remoción inmediata, seguimiento anual",
            points: 350
        },
        {
            id: 4,
            name: "Adenoma Tubulovelloso",
            type: "precancerous",
            size: "8-15mm",
            characteristics: "Combinación tubular y velloso",
            risk: "Riesgo moderado-alto",
            action: "Remoción, colonoscopia en 3 años",
            points: 300
        },
        {
            id: 5,
            name: "Pólipo Sésil Serrado",
            type: "precancerous",
            size: "6-12mm",
            characteristics: "Plano, difícil de detectar",
            risk: "Riesgo moderado, crecimiento rápido",
            action: "Remoción completa, seguimiento estrecho",
            points: 350
        },
        {
            id: 6,
            name: "Carcinoma in Situ",
            type: "malignant",
            size: "> 15mm",
            characteristics: "Masa irregular, ulcerada, sangrado",
            risk: "Cáncer temprano, no invasivo aún",
            action: "Cirugía inmediata",
            points: 400
        },
        {
            id: 7,
            name: "Adenocarcinoma",
            type: "malignant",
            size: "> 20mm",
            characteristics: "Gran masa, obstrucción, necrosis",
            risk: "Cáncer invasivo",
            action: "Tratamiento oncológico urgente",
            points: 400
        },
        {
            id: 8,
            name: "Pólipo Inflamatorio",
            type: "benign",
            size: "3-8mm",
            characteristics: "Enrojecido, edematoso",
            risk: "Benigno, relacionado con inflamación",
            action: "Tratar inflamación, revisar en 1 año",
            points: 200
        }
    ],

    // Alimentos para dieta saludable
    foods: [
        // VEGETALES
        {
            id: "veg1",
            name: "Brócoli",
            category: "vegetables",
            icon: "🥦",
            benefit: "Alto en fibra y sulforafano",
            healthScore: 100,
            points: 100
        },
        {
            id: "veg2",
            name: "Espinaca",
            category: "vegetables",
            icon: "🥬",
            benefit: "Rica en folato y antioxidantes",
            healthScore: 95,
            points: 100
        },
        {
            id: "veg3",
            name: "Zanahoria",
            category: "vegetables",
            icon: "🥕",
            benefit: "Beta-caroteno protector",
            healthScore: 90,
            points: 100
        },
        {
            id: "veg4",
            name: "Col rizada",
            category: "vegetables",
            icon: "🥬",
            benefit: "Crucífera con propiedades anticáncer",
            healthScore: 100,
            points: 100
        },

        // PROTEÍNAS
        {
            id: "prot1",
            name: "Pescado",
            category: "proteins",
            icon: "🐟",
            benefit: "Omega-3 antiinflamatorio",
            healthScore: 90,
            points: 100
        },
        {
            id: "prot2",
            name: "Legumbres",
            category: "proteins",
            icon: "🫘",
            benefit: "Fibra y proteína vegetal",
            healthScore: 95,
            points: 100
        },
        {
            id: "prot3",
            name: "Pollo sin piel",
            category: "proteins",
            icon: "🍗",
            benefit: "Proteína magra saludable",
            healthScore: 80,
            points: 80
        },
        {
            id: "prot4",
            name: "Carne roja",
            category: "proteins",
            icon: "🥩",
            benefit: "Limitar consumo",
            healthScore: 30,
            points: -50
        },
        {
            id: "prot5",
            name: "Carnes procesadas",
            category: "proteins",
            icon: "🌭",
            benefit: "Evitar - aumentan riesgo",
            healthScore: 10,
            points: -100
        },

        // GRANOS
        {
            id: "grain1",
            name: "Avena integral",
            category: "grains",
            icon: "🌾",
            benefit: "Fibra soluble excelente",
            healthScore: 100,
            points: 100
        },
        {
            id: "grain2",
            name: "Arroz integral",
            category: "grains",
            icon: "🍚",
            benefit: "Granos enteros protectores",
            healthScore: 90,
            points: 100
        },
        {
            id: "grain3",
            name: "Pan blanco",
            category: "grains",
            icon: "🍞",
            benefit: "Bajo en fibra",
            healthScore: 40,
            points: 20
        },
        {
            id: "grain4",
            name: "Quinoa",
            category: "grains",
            icon: "🌾",
            benefit: "Proteína completa y fibra",
            healthScore: 95,
            points: 100
        },

        // FRUTAS
        {
            id: "fruit1",
            name: "Manzana",
            category: "fruits",
            icon: "🍎",
            benefit: "Pectina y fibra soluble",
            healthScore: 90,
            points: 100
        },
        {
            id: "fruit2",
            name: "Arándanos",
            category: "fruits",
            icon: "🫐",
            benefit: "Antioxidantes potentes",
            healthScore: 100,
            points: 100
        },
        {
            id: "fruit3",
            name: "Naranja",
            category: "fruits",
            icon: "🍊",
            benefit: "Vitamina C y fibra",
            healthScore: 90,
            points: 100
        }
    ],

    // Casos de síntomas
    symptomCases: [
        {
            id: 1,
            age: 65,
            gender: "masculino",
            symptoms: ["Sangre en heces", "Cambio en hábitos intestinales", "Pérdida de peso"],
            duration: "2 meses",
            familyHistory: true,
            correctAction: "urgent",
            urgencyLevel: "high",
            explanation: "Síntomas de alarma en edad de riesgo requieren evaluación inmediata",
            points: 300
        },
        {
            id: 2,
            age: 45,
            gender: "femenino",
            symptoms: ["Estreñimiento ocasional"],
            duration: "1 semana",
            familyHistory: false,
            correctAction: "screening",
            urgencyLevel: "medium",
            explanation: "Edad para iniciar screening, síntomas leves",
            points: 200
        },
        {
            id: 3,
            age: 72,
            gender: "femenino",
            symptoms: ["Anemia", "Fatiga", "Dolor abdominal persistente"],
            duration: "3 meses",
            familyHistory: false,
            correctAction: "urgent",
            urgencyLevel: "high",
            explanation: "Anemia inexplicada en adulto mayor es señal de alarma",
            points: 300
        },
        {
            id: 4,
            age: 38,
            gender: "masculino",
            symptoms: ["Hinchazón abdominal leve"],
            duration: "Ocasional",
            familyHistory: false,
            correctAction: "normal",
            urgencyLevel: "low",
            explanation: "Síntoma común y benigno en adulto joven sin otros factores",
            points: 200
        },
        {
            id: 5,
            age: 55,
            gender: "masculino",
            symptoms: ["Diarrea crónica", "Sangre oculta en heces"],
            duration: "4 meses",
            familyHistory: true,
            correctAction: "urgent",
            urgencyLevel: "high",
            explanation: "Combinación de síntomas con historial familiar",
            points: 300
        },
        {
            id: 6,
            age: 50,
            gender: "femenino",
            symptoms: ["Ninguno"],
            duration: "N/A",
            familyHistory: false,
            correctAction: "screening",
            urgencyLevel: "medium",
            explanation: "Edad para colonoscopía de screening preventivo",
            points: 200
        },
        {
            id: 7,
            age: 42,
            gender: "masculino",
            symptoms: ["Pólipos removidos hace 3 años"],
            duration: "N/A",
            familyHistory: true,
            correctAction: "monitoring",
            urgencyLevel: "medium",
            explanation: "Seguimiento por pólipos previos e historial familiar",
            points: 250
        },
        {
            id: 8,
            age: 60,
            gender: "femenino",
            symptoms: ["Heces delgadas persistentes", "Sensación de evacuación incompleta"],
            duration: "6 semanas",
            familyHistory: false,
            correctAction: "urgent",
            urgencyLevel: "high",
            explanation: "Cambios persistentes en forma de heces son señal de alarma",
            points: 300
        },
        {
            id: 9,
            age: 35,
            gender: "masculino",
            symptoms: ["Gases", "Hinchazón después de comer"],
            duration: "Variable",
            familyHistory: false,
            correctAction: "normal",
            urgencyLevel: "low",
            explanation: "Síntomas digestivos comunes sin señales de alarma",
            points: 200
        },
        {
            id: 10,
            age: 58,
            gender: "femenino",
            symptoms: ["Última colonoscopía normal hace 10 años"],
            duration: "N/A",
            familyHistory: false,
            correctAction: "screening",
            urgencyLevel: "medium",
            explanation: "Tiempo para colonoscopía de seguimiento rutinaria",
            points: 200
        }
    ],

    // Escenarios de screening
    screeningScenarios: [
        {
            id: 1,
            age: 45,
            familyHistory: false,
            previousPolyps: false,
            riskFactors: [],
            correctSchedule: {
                firstScreening: "ahora",
                frequency: "10-años",
                additionalTests: "ninguna",
                specialMonitoring: "estandar"
            },
            points: 300
        },
        {
            id: 2,
            age: 40,
            familyHistory: true,
            previousPolyps: false,
            riskFactors: ["historial-familiar"],
            correctSchedule: {
                firstScreening: "ahora",
                frequency: "5-años",
                additionalTests: "sangre-oculta",
                specialMonitoring: "historial-familiar"
            },
            points: 400
        },
        {
            id: 3,
            age: 52,
            familyHistory: false,
            previousPolyps: true,
            riskFactors: ["polipos-previos"],
            correctSchedule: {
                firstScreening: "ahora",
                frequency: "3-años",
                additionalTests: "colonoscopia-virtual",
                specialMonitoring: "polipos-previos"
            },
            points: 400
        }
    ],

    // Logros desbloqueables
    achievements: [
        {
            id: "risk_master",
            name: "Maestro de Prevención",
            description: "Clasificó todos los factores de riesgo correctamente",
            icon: "🛡️",
            condition: "risks_perfect"
        },
        {
            id: "colonoscopy_expert",
            name: "Endoscopista Experto",
            description: "Completó la colonoscopía virtual sin errores",
            icon: "🔬",
            condition: "colonoscopy_perfect"
        },
        {
            id: "polyp_hunter",
            name: "Cazador de Pólipos",
            description: "Identificó y clasificó todos los pólipos correctamente",
            icon: "🎯",
            condition: "polyps_perfect"
        },
        {
            id: "nutrition_guru",
            name: "Gurú de la Nutrición",
            description: "Creó el plato perfecto para la prevención",
            icon: "🍎",
            condition: "diet_perfect"
        },
        {
            id: "symptom_detective",
            name: "Detective de Síntomas",
            description: "Diagnosticó correctamente todos los casos",
            icon: "🕵️",
            condition: "symptoms_perfect"
        },
        {
            id: "screening_planner",
            name: "Planificador Experto",
            description: "Programó todos los screenings correctamente",
            icon: "📅",
            condition: "screening_perfect"
        },
        {
            id: "speed_champion",
            name: "Campeón Velocista",
            description: "Completó el nivel en menos de 6 minutos",
            icon: "⚡",
            condition: "time_under_6min"
        },
        {
            id: "perfect_game",
            name: "Juego Perfecto",
            description: "Completó sin perder ninguna vida",
            icon: "👑",
            condition: "no_lives_lost"
        }
    ],

    // Puntos de aprendizaje clave
    learningPoints: [
        "El 90% de los casos de cáncer colorrectal se pueden prevenir con screening regular",
        "La colonoscopía después de los 45 años puede salvar tu vida",
        "Dieta alta en fibra y baja en carnes rojas reduce el riesgo en 50%",
        "Los pólipos tardan 10-15 años en volverse cancerosos, permitiendo detección temprana",
        "Ejercicio regular reduce el riesgo de cáncer de colon en 50%",
        "Sangre en heces, cambios intestinales persistentes y pérdida de peso son señales de alarma",
        "El cáncer colorrectal detectado temprano tiene 90% de tasa de curación",
        "Historial familiar aumenta el riesgo, requiriendo screening más temprano y frecuente",
        "Mantener peso saludable es crucial para la prevención",
        "La mayoría de los casos ocurren después de los 50 años"
    ]
};

// Configuración del juego
const COLON_GAME_CONFIG = {
    totalTime: 480, // 8 minutos (el nivel más largo)
    phases: [
        { id: 'risk-factors', name: 'Factores de Riesgo', maxScore: 1800 },
        { id: 'colonoscopy', name: 'Colonoscopía Virtual', maxScore: 1000 },
        { id: 'polyps', name: 'Detector de Pólipos', maxScore: 2400 },
        { id: 'diet', name: 'Nutrición Preventiva', maxScore: 1500 },
        { id: 'symptoms', name: 'Identificador de Síntomas', maxScore: 2500 },
        { id: 'screening', name: 'Calendario Screening', maxScore: 1200 }
    ],
    maxScore: 10400, // El puntaje más alto de todos los niveles
    passingScore: 6500,
    lives: 3,
    bonusMultiplier: {
        perfect: 2.5,
        fast: 2.0,
        noMistakes: 1.5
    },
    ranks: [
        { min: 10000, name: "Médico Legendario", color: "#ffd700" },
        { min: 9000, name: "Especialista Maestro", color: "#c0c0c0" },
        { min: 7500, name: "Gastroenterólogo", color: "#cd7f32" },
        { min: 6500, name: "Médico Competente", color: "#4a90e2" },
        { min: 0, name: "En Entrenamiento", color: "#95a5a6" }
    ]
};
