// ============================================
// DATOS DEL NIVEL DE CÁNCER CERVICAL
// ============================================

const CERVICAL_DATA = {
    // Datos de vacunación VPH
    vaccinationTimeline: [
        {
            id: 1,
            description: "Primera dosis recomendada",
            correctAge: 11,
            ageRange: "9-12 años",
            info: "La vacuna VPH es más efectiva cuando se administra antes del inicio de la actividad sexual",
            points: 200
        },
        {
            id: 2,
            description: "Edad mínima para vacunación",
            correctAge: 9,
            ageRange: "9 años",
            info: "Se puede iniciar desde los 9 años en casos especiales",
            points: 150
        },
        {
            id: 3,
            description: "Límite superior edad óptima",
            correctAge: 26,
            ageRange: "Hasta 26 años",
            info: "La vacuna puede administrarse hasta los 26 años con beneficios significativos",
            points: 200
        },
        {
            id: 4,
            description: "Segunda dosis (si inició a 9-14 años)",
            correctAge: 12,
            ageRange: "6-12 meses después",
            info: "Si se inicia entre 9-14 años, solo se necesitan 2 dosis",
            points: 150
        },
        {
            id: 5,
            description: "Vacunación de refuerzo (15+ años)",
            correctAge: 16,
            ageRange: "15-26 años",
            info: "Si se inicia después de los 15 años, se requieren 3 dosis",
            points: 200
        }
    ],

    // Muestras de células para el simulador de Papanicolaou
    cellSamples: [
        {
            id: 1,
            type: "normal",
            description: "Células escamosas normales",
            characteristics: "Núcleo pequeño, uniforme, citoplasma abundante",
            image: "normal-cells-1",
            difficulty: "easy",
            points: 150
        },
        {
            id: 2,
            type: "normal",
            description: "Células columnares normales",
            characteristics: "Células cilíndricas, núcleo basal",
            image: "normal-cells-2",
            difficulty: "medium",
            points: 200
        },
        {
            id: 3,
            type: "abnormal",
            description: "Células con cambios por VPH",
            characteristics: "Coilocitos, núcleo irregular, halos perinucleares",
            image: "abnormal-hpv",
            difficulty: "medium",
            points: 250
        },
        {
            id: 4,
            type: "abnormal",
            description: "Displasia leve (CIN 1)",
            characteristics: "Leve aumento núcleo/citoplasma, hipercromasia",
            image: "cin1",
            difficulty: "medium",
            points: 300
        },
        {
            id: 5,
            type: "normal",
            description: "Células metaplásicas",
            characteristics: "Cambio normal de células, núcleo regular",
            image: "metaplasia",
            difficulty: "hard",
            points: 250
        },
        {
            id: 6,
            type: "abnormal",
            description: "Displasia moderada (CIN 2)",
            characteristics: "Aumento significativo núcleo/citoplasma",
            image: "cin2",
            difficulty: "hard",
            points: 350
        },
        {
            id: 7,
            type: "abnormal",
            description: "Displasia severa (CIN 3)",
            characteristics: "Células muy anormales, núcleos grandes e irregulares",
            image: "cin3",
            difficulty: "hard",
            points: 400
        },
        {
            id: 8,
            type: "normal",
            description: "Células endocervicales",
            characteristics: "Células cilíndricas normales del canal cervical",
            image: "endocervical",
            difficulty: "easy",
            points: 150
        }
    ],

    // Factores de riesgo y hábitos saludables
    riskFactors: [
        // FACTORES DE RIESGO (danger)
        {
            id: "risk1",
            name: "Fumar cigarrillos",
            type: "danger",
            icon: "🚬",
            explanation: "El tabaco duplica el riesgo de cáncer cervical",
            points: 100
        },
        {
            id: "risk2",
            name: "Múltiples parejas sexuales",
            type: "danger",
            icon: "👥",
            explanation: "Aumenta exposición a VPH",
            points: 100
        },
        {
            id: "risk3",
            name: "No usar preservativo",
            type: "danger",
            icon: "🚫",
            explanation: "Mayor riesgo de infección por VPH",
            points: 100
        },
        {
            id: "risk4",
            name: "Sistema inmune debilitado",
            type: "danger",
            icon: "🦠",
            explanation: "Dificulta eliminar infecciones por VPH",
            points: 100
        },
        {
            id: "risk5",
            name: "Inicio temprano actividad sexual",
            type: "danger",
            icon: "⚠️",
            explanation: "Antes de los 18 años aumenta riesgo",
            points: 100
        },
        {
            id: "risk6",
            name: "No hacerse Papanicolaou",
            type: "danger",
            icon: "❌",
            explanation: "Prevención es detección temprana",
            points: 150
        },

        // HÁBITOS SALUDABLES (healthy)
        {
            id: "health1",
            name: "Vacuna contra VPH",
            type: "healthy",
            icon: "💉",
            explanation: "Protege contra tipos de VPH que causan cáncer",
            points: 150
        },
        {
            id: "health2",
            name: "Papanicolaou regular",
            type: "healthy",
            icon: "🔬",
            explanation: "Cada 3 años detecta cambios tempranos",
            points: 150
        },
        {
            id: "health3",
            name: "Uso de preservativo",
            type: "healthy",
            icon: "🛡️",
            explanation: "Reduce riesgo de VPH y otras ITS",
            points: 100
        },
        {
            id: "health4",
            name: "No fumar",
            type: "healthy",
            icon: "🚭",
            explanation: "Protege el sistema inmune",
            points: 100
        },
        {
            id: "health5",
            name: "Alimentación saludable",
            type: "healthy",
            icon: "🥗",
            explanation: "Fortalece el sistema inmunológico",
            points: 100
        },
        {
            id: "health6",
            name: "Ejercicio regular",
            type: "healthy",
            icon: "🏃‍♀️",
            explanation: "Mejora salud general e inmunidad",
            points: 100
        }
    ],

    // Mitos y realidades
    mythsAndFacts: [
        {
            id: 1,
            statement: "Solo las mujeres con múltiples parejas sexuales pueden contraer VPH",
            isMyth: true,
            explanation: "MITO: El VPH es tan común que casi todos los adultos sexualmente activos lo contraen en algún momento",
            points: 150
        },
        {
            id: 2,
            statement: "La vacuna VPH previene la mayoría de los casos de cáncer cervical",
            isMyth: false,
            explanation: "REALIDAD: La vacuna protege contra los tipos de VPH que causan 90% de los cánceres cervicales",
            points: 150
        },
        {
            id: 3,
            statement: "El VPH siempre causa síntomas visibles",
            isMyth: true,
            explanation: "MITO: La mayoría de las infecciones por VPH no causan síntomas y desaparecen solas",
            points: 150
        },
        {
            id: 4,
            statement: "El Papanicolaou puede detectar cambios antes de que se desarrolle cáncer",
            isMyth: false,
            explanation: "REALIDAD: El Papanicolaou detecta células anormales antes de que se vuelvan cancerosas",
            points: 150
        },
        {
            id: 5,
            statement: "Las mujeres mayores de 65 años no necesitan hacerse Papanicolaou",
            isMyth: true,
            explanation: "MITO: Depende del historial de detección. Consulta con tu médico",
            points: 200
        },
        {
            id: 6,
            statement: "El cáncer cervical es uno de los más prevenibles",
            isMyth: false,
            explanation: "REALIDAD: Con vacunación y detección regular, es altamente prevenible",
            points: 150
        },
        {
            id: 7,
            statement: "La vacuna VPH solo funciona en mujeres vírgenes",
            isMyth: true,
            explanation: "MITO: La vacuna es efectiva aunque hayas iniciado actividad sexual",
            points: 200
        },
        {
            id: 8,
            statement: "El VPH puede transmitirse por contacto piel con piel genital",
            isMyth: false,
            explanation: "REALIDAD: El VPH se transmite principalmente por contacto genital directo",
            points: 150
        },
        {
            id: 9,
            statement: "Si tienes VPH, definitivamente desarrollarás cáncer",
            isMyth: true,
            explanation: "MITO: La mayoría de las infecciones por VPH desaparecen sin causar problemas",
            points: 200
        },
        {
            id: 10,
            statement: "El tabaco aumenta el riesgo de cáncer cervical",
            isMyth: false,
            explanation: "REALIDAD: Fumar duplica el riesgo de desarrollar cáncer cervical",
            points: 150
        }
    ],

    // Escenarios de calendario de prevención
    calendarScenarios: [
        {
            id: 1,
            patientAge: 21,
            previousPap: "nunca",
            riskFactors: [],
            correctSchedule: {
                firstPap: "ahora",
                nextPap: "3 años después",
                hpvTest: "no necesario",
                vaccine: "recomendado"
            },
            points: 300
        },
        {
            id: 2,
            patientAge: 30,
            previousPap: "hace 2 años - normal",
            riskFactors: [],
            correctSchedule: {
                firstPap: "1 año",
                nextPap: "3 años después",
                hpvTest: "co-testing disponible",
                vaccine: "considerar"
            },
            points: 300
        },
        {
            id: 3,
            patientAge: 25,
            previousPap: "nunca",
            riskFactors: ["fumadora", "inicio temprano"],
            correctSchedule: {
                firstPap: "ahora",
                nextPap: "1 año",
                hpvTest: "recomendado",
                vaccine: "urgente"
            },
            points: 400
        }
    ],

    // Logros desbloqueables
    achievements: [
        {
            id: "perfect_timeline",
            name: "Cronólogo Experto",
            description: "Completó la línea de vacunación sin errores",
            icon: "📅",
            condition: "timeline_perfect"
        },
        {
            id: "master_cytologist",
            name: "Citólogo Maestro",
            description: "Identificó correctamente todas las muestras celulares",
            icon: "🔬",
            condition: "pap_perfect"
        },
        {
            id: "risk_eliminator",
            name: "Eliminador de Riesgos",
            description: "Clasificó todos los factores correctamente",
            icon: "🛡️",
            condition: "risks_perfect"
        },
        {
            id: "myth_buster",
            name: "Cazador de Mitos",
            description: "Separó todos los mitos de las realidades",
            icon: "💡",
            condition: "myths_perfect"
        },
        {
            id: "speed_demon",
            name: "Velocista Médico",
            description: "Completó el nivel en menos de 4 minutos",
            icon: "⚡",
            condition: "time_under_4min"
        },
        {
            id: "flawless_victory",
            name: "Victoria Impecable",
            description: "Completó sin perder vidas",
            icon: "👑",
            condition: "no_lives_lost"
        }
    ],

    // Puntos de aprendizaje clave
    learningPoints: [
        "La vacuna VPH previene el 90% de los cánceres cervicales",
        "El Papanicolaou debe realizarse cada 3 años a partir de los 21 años",
        "El VPH es muy común pero generalmente desaparece solo",
        "La detección temprana hace que el cáncer cervical sea altamente tratable",
        "Fumar duplica el riesgo de cáncer cervical",
        "El uso de preservativo reduce significativamente el riesgo de VPH",
        "La mayoría de las infecciones por VPH no causan síntomas",
        "La vacuna VPH es efectiva incluso después del inicio de actividad sexual"
    ]
};

// Configuración del juego
const GAME_CONFIG = {
    totalTime: 420, // 7 minutos
    phases: [
        { id: 'timeline', name: 'Línea de Tiempo VPH', maxScore: 900 },
        { id: 'pap', name: 'Simulador Papanicolaou', maxScore: 2000 },
        { id: 'risks', name: 'Factores de Riesgo', maxScore: 1200 },
        { id: 'myths', name: 'Mitos vs Realidades', maxScore: 1700 },
        { id: 'calendar', name: 'Calendario Prevención', maxScore: 1200 }
    ],
    maxScore: 7000,
    passingScore: 4500,
    lives: 3,
    bonusMultiplier: {
        perfect: 2.0,
        fast: 1.5,
        noMistakes: 1.3
    }
};
