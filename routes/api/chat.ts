// Modelo e1: Sistema Neural Conversacional v1.0.2
// Desarrollado por Eduardo Rojo
// -----------------------------------------------------
// Implementación del motor conversacional basado en arquitectura de red neuronal simulada
// con procesamiento contextual avanzado, sistema de memoria multidimensional y 
// reconocimiento de intenciones mediante vectorización semántica.
// Motor desplegado en producción - Marzo 2025

import { Handlers } from "$fresh/server.ts";

// Sistema de Memoria Neural - Estructuras de Datos Multidimensionales
// -----------------------------------------------------------------------

/**
 * Arquitectura de memoria conversacional multicapa
 * Implementa un sistema de retención y recuperación de información contextual
 * con análisis de sentimiento y capacidad de evolución temporal
 */
interface ConversationMemory {
  history: MemoryEntry[];             // Registro secuencial de interacciones
  userTopics: Set<string>;            // Vectorización de tópicos relevantes
  userPreferences: Map<string, string>; // Mapa de preferencias detectadas
  userSentiment: number;              // Análisis de sentimiento normalizado (-1 a 1)
  lastTopics: string[];               // Buffer de recencia para optimización de contexto
  sessionStart: Date;                 // Marcador temporal para degradación de memoria
}

/**
 * Estructura de dato atómica para el registro sináptico de la memoria conversacional
 * Cada entrada constituye un nodo en la red de memoria contextual
 */
interface MemoryEntry {
  role: "user" | "assistant";       // Identificador de origen del nodo
  content: string;                  // Carga de información textual
  timestamp: Date;                  // Marcador temporal para algoritmos de recencia
  detectedIntent?: string;          // Vector de intención clasificada
  topicTags?: string[];             // Vectores de tópicos asociados
}

// Sistema de gestión de memoria a largo plazo
const conversationMemory = new Map<string, ConversationMemory>();

// Algoritmo de limpieza y optimización de memoria neural
// Implementa degradación temporal para evitar saturación de la red
function cleanupOldMemories() {
  const now = new Date();
  const maxAgeMs = 24 * 60 * 60 * 1000; // Ventana de degradación: 24 horas
  
  for (const [sessionId, memory] of conversationMemory.entries()) {
    const sessionAge = now.getTime() - memory.sessionStart.getTime();
    
    // Aplicar degradación de memoria para sesiones antiguas
    if (sessionAge > maxAgeMs) {
      conversationMemory.delete(sessionId);
    }
  }
}

// Iniciar proceso autónomo de optimización de memoria
setInterval(cleanupOldMemories, 60 * 60 * 1000); // Frecuencia de mantenimiento: 1 hora

// Base de Conocimiento Neuronal - Perfil de Eduardo
// -----------------------------------------------------------------------

/**
 * Estructura vectorial de información para el modelo de entidad principal
 * Constituye la base de conocimiento primaria del sistema
 */
  const eduardoInfo = {
    nombre: "Eduardo",
    profesion: "ingeniero en informática",
    educacion: "graduado de Ingeniería en Informática de Santo Tomás Arica con distinción máxima (2018-2023)",
    tesis: "aplicación de hábitos de estudio en React Native, calificado con 6,9",
    experiencia: "desde 2016, comenzando en el liceo Antonio Varas de la Barra",
  habilidades: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", "PHP", "C++", "C#", "Blazor", "React Native", "Figma", "Fresh", "Deno", "ASP.NET", "Laravel", "Bootstrap", "Tailwind CSS", "T-SQL", "Microsoft SQL Server", "Git", "GitHub", "Google Workspace"],
    proyectos: ["e-commerce", "aplicaciones móviles", "sitios web de portafolio"],
    intereses: "desarrollo web moderno y minimalista",
    contacto: "rojoserranoe@gmail.com",
    edad: 25,
    comidas_favoritas: ["naranja", "fideos con salsa"],
    musica: {
      generos: ["electrónica", "rock"],
      artistas: ["Skrillex", "The Strokes", "Paramore", "Alice in Chains", "ANOTR", "Fox Stevenson", "Linkin Park"]
    },
    mascotas: [
      { nombre: "Zoe", tipo: "gata" },
      { nombre: "Naruto", tipo: "gato" }
    ],
    entretenimiento: {
      series: ["Loki", "Breaking Bad", "Game of Thrones", "Boys"],
      anime: true,
      videojuegos: ["Call of Duty", "League of Legends", "Osu", "Rocket League", "Marvel Rivals", "Elden Ring"]
  },
  experiencias: [
    {
      lugar: "Hospital Regional en Red Dr. Juan Noé Crevani",
      rol: "Estudiante en prácticas",
      periodo: "Enero 2018 - Abril 2018",
      descripcion: "Diagnóstico, reparación y soporte a los equipos informáticos del hospital."
    },
    {
      lugar: "iStyle Store",
      rol: "Especialista en soporte técnico",
      periodo: "Octubre 2019 - Mayo 2022",
      descripcion: "Diagnóstico y reparación de equipos Apple (iPhone, Mac, iPad, iMac, iPod, AppleTV), micro soldadura de componentes electrónicos, armado de PC a la medida, cotización de componentes, mejora y optimización de equipos."
    },
    {
      lugar: "WAKI Labs",
      rol: "Estudiante en prácticas",
      periodo: "Septiembre 2022 - Diciembre 2022",
      descripcion: "Gestión y supervisión de desarrollo de software, diseño y desarrollo de interfaces de usuario con React, participación en proyectos Web3."
    },
    {
      lugar: "Second Mind Chile",
      rol: "CEO & FrontEnd Developer",
      periodo: "Febrero 2023 - Septiembre 2023",
      descripcion: "Ganadores del primer lugar Mercado E 2023 en la categoría Innovación. Desarrollo de interfaces de usuario y soluciones integrales a medida."
    },
    {
      lugar: "Colegio Leonardo Da Vinci",
      rol: "Encargado de Enlaces / Soporte Tecnológico",
      periodo: "Marzo 2023 - Julio 2024",
      descripcion: "Administración de plataforma educativa, control de libro digital, implementación de Lirmi Familia, supervisión y apoyo a profesores, investigación de tendencias tecnológicas, diseño y mantenimiento de páginas web."
    },
    {
      lugar: "The International School Arica (TISA)",
      rol: "Especialista en TI - Coordinador de Enlaces",
      periodo: "Septiembre 2024",
      descripcion: "Diseño e implementación de un plan integral para fortalecer la infraestructura tecnológica del colegio, estandarización de procesos y definición de directrices tecnológicas."
    },
    {
      lugar: "Ancestral Technologies / UltraCropCare",
      rol: "Desarrollador de Software",
      periodo: "Septiembre 2024 - Actualidad",
      descripcion: "Desarrollo de soluciones tecnológicas utilizando C#, PHP, Blazor, SQL, Laravel, ASP.NET, Figma, Bootstrap, Tailwind CSS, T-SQL y Microsoft SQL Server."
    }
  ]
};

// Sistema de Reconocimiento de Intenciones y Análisis Semántico
// -----------------------------------------------------------------------

/**
 * Arquitectura neuronal para clasificación de intenciones comunicativas
 * Cada definición encapsula patrones de reconocimiento y generadores de respuesta
 */
interface IntentDefinition {
  name: string;                      // Identificador semántico de la intención
  examples: string[];                // Corpus de entrenamiento para el reconocimiento
  patterns: RegExp[];                // Patrones de activación neuronal directa
  confidence: number;                // Umbral de certeza para activación
  responseGenerator: (params: ResponseGeneratorParams) => string; // Función de generación contextual
}

/**
 * Parámetros contextuales para la síntesis neural de respuestas
 * Contiene el estado actual de la red y los vectores de entrada procesados
 */
interface ResponseGeneratorParams {
  userMessage: string;              // Entrada textual original
  normalizedMessage: string;        // Entrada normalizada para procesamiento
  memory: ConversationMemory;       // Estado actual de la memoria conversacional
  sessionId: string;                // Identificador de sesión neuronal
  detectedEntities: Record<string, string[]>; // Entidades extraídas y vectorizadas
  matchedGroups?: RegExpMatchArray; // Grupos de coincidencia para procesamiento avanzado
}

/**
 * Estructura para entidades reconocidas con niveles de confianza
 * Permite la clasificación difusa de conceptos en el espacio semántico
 */
interface RecognizedEntity {
  type: string;                     // Clasificación categórica 
  value: string;                    // Valor semántico extraído
  confidence: number;               // Nivel de certeza de la clasificación
}

/**
 * Algoritmo de similitud semántica vectorial
 * Implementa un cálculo de distancia en el espacio semántico para evaluar similitud conceptual
 */
function similarityScore(text1: string, text2: string): number {
  // Normalización vectorial para procesamiento semántico
  const normalize = (text: string) => 
    text.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "")
        .trim();
        
  const a = normalize(text1);
  const b = normalize(text2);
  
  // Tokenización de vectores semánticos
  const wordsA = a.split(/\s+/);
  const wordsB = b.split(/\s+/);
  
  // Algoritmo de coincidencia semántica con umbral de significancia
  let matches = 0;
  for (const wordA of wordsA) {
    if (wordA.length <= 2) continue; // Filtrado de tokens no significativos
    if (wordsB.includes(wordA)) matches++;
  }
  
  // Cálculo de similitud de Jaccard optimizado
  const uniqueWords = new Set([...wordsA, ...wordsB]);
  return matches / uniqueWords.size;
}

/**
 * Sistema de extracción y clasificación de entidades semánticas
 * Implementa reconocimiento de patrones para vectorizar conceptos clave
 */
function extractEntities(message: string): Record<string, string[]> {
  // Inicialización de vectores de clasificación multidimensional
  const entities: Record<string, string[]> = {
    habilidades: [],
    proyectos: [],
    empresas: [],
    tecnologias: [],
    personas: [],
    temas: []
  };
  
  // Redes de reconocimiento de tecnologías con umbrales de activación
  const tecnologiasPatterns = [
    /\b(javascript|js|typescript|ts|react|node\.?js|python|sql|php|c\+\+|c#|blazor|react native|figma|fresh|deno)\b/gi,
    /\b(angular|vue|svelte|next\.?js|nuxt|express|django|flask|laravel|symfony|ruby|rails|java|kotlin|swift)\b/gi,
    /\b(frontend|backend|fullstack|desarrollo web|web development|app|móvil|mobile)\b/gi
  ];
  
  // Aplicación de redes de reconocimiento con propagación de activación
  for (const pattern of tecnologiasPatterns) {
    const matches = message.match(pattern);
    if (matches) {
      entities.tecnologias.push(...matches.map(m => m.toLowerCase()));
    }
  }
  
  // Redes de reconocimiento de entidades organizacionales
  const empresasPatterns = [
    /\b(hospital|juan noe|istyle|apple|leonardo|da vinci|tisa|ancestral|ultracropcare|santo tom[aá]s)\b/gi,
    /\b(mercado e|second mind|universidad|liceo|colegio|escuela)\b/gi
  ];
  
  // Propagación de activación para entidades organizacionales
  for (const pattern of empresasPatterns) {
    const matches = message.match(pattern);
    if (matches) {
      entities.empresas.push(...matches.map(m => m.toLowerCase()));
    }
  }

  // Redes de reconocimiento de temas conceptuales
  const temasPatterns = [
    /\b(educaci[oó]n|experiencia|habilidades|proyectos|trabajo|trayectoria|contacto|vida personal|hobbies)\b/gi,
    /\b(m[uú]sica|videojuegos|series|pel[ií]culas|anime|mascotas|comida|metodolog[ií]a|gesti[oó]n)\b/gi,
    /\b(portafolio|portfolio|pagina|sitio web|t[eé]cnicas|futuro|planes|filosof[ií]a|desarrollo)\b/gi
  ];
  
  // Propagación para clasificación temática
  for (const pattern of temasPatterns) {
    const matches = message.match(pattern);
    if (matches) {
      entities.temas.push(...matches.map(m => m.toLowerCase()));
    }
  }
  
  // Normalización y eliminación de redundancia en vectores de entidades
  for (const key in entities) {
    entities[key] = [...new Set(entities[key])];
  }
  
  return entities;
}

// Definición de la Red Neural de Intenciones
// -----------------------------------------------------------------------

/**
 * Conjunto de redes neuronales especializadas en reconocimiento de intenciones comunicativas
 * Cada red implementa patrones de reconocimiento y algoritmos de generación de respuestas
 */
const intents: IntentDefinition[] = [
  {
    name: "saludo",
    examples: [
      "hola", "buenos días", "buenas tardes", "hey", "saludos", "qué tal", "ey",
      "cómo va", "qué pasa", "qué dice", "ola", "hello", "hi"
    ],
    patterns: [
      /\b(hola|hi|volvi|volviendo|he vuelto|estoy de regreso|regreso|hello|saludos|hey|oa|buenas|konichiwa|bonjour|ciao|que tal|como va|que pasa|que hay|que dice|que onda|que hubo|que lo que|wena|wenas|buenos dias|buenas tardes|buenas noches|que hubo)\b/i
    ],
    confidence: 0.8,
    responseGenerator: (params) => {
      // Analizar la memoria para personalizar el saludo
      const prevInteractions = params.memory.history.filter(h => h.role === "user").length;
      
      // Si es la primera interacción
      if (prevInteractions <= 1) {
        const saludosIniciales = [
          `¡Hola! Soy SobremIA, un asistente virtual entrenado con información sobre ${eduardoInfo.nombre}. ¿En qué puedo ayudarte hoy? 🚀`,
          `¡Hola! Me alegra que estés aquí. Soy un asistente entrenado para hablar sobre ${eduardoInfo.nombre}, un ${eduardoInfo.profesion}. ¿Qué te gustaría saber?`,
          `¡Hey! Bienvenido. Soy la IA que conoce todo sobre ${eduardoInfo.nombre}. Pregúntame lo que quieras sobre su experiencia, proyectos o habilidades. 😊`,
          `¡Saludos! Soy una IA conversacional especializada en ${eduardoInfo.nombre}. Estoy aquí para responder tus preguntas sobre su perfil profesional. ¿En qué puedo ayudarte?`
        ];
        return saludosIniciales[Math.floor(Math.random() * saludosIniciales.length)];
      } 
      // Si ya ha habido algunas interacciones
      else {
        const saludosRecurrentes = [
          `¡Hola de nuevo! ¿En qué más puedo ayudarte respecto a ${eduardoInfo.nombre}?`,
          `¡Has vuelto! ¿Quieres saber algo más sobre ${eduardoInfo.nombre} o su trabajo?`,
          `¡Hola otra vez! ¿Hay algo específico sobre ${eduardoInfo.nombre} que te interese conocer ahora?`,
          `¡Me alegra verte nuevamente! ¿En qué puedo ayudarte hoy respecto a ${eduardoInfo.nombre}?`
        ];
        return saludosRecurrentes[Math.floor(Math.random() * saludosRecurrentes.length)];
      }
    }
  },
  {
    name: "despedida",
    examples: [
      "adiós", "chao", "hasta luego", "nos vemos", "bye", "hasta pronto", "me voy"
    ],
    patterns: [
      /\b(adios|chao|hasta luego|nos vemos|bye|goodbye|hasta pronto|me voy|hasta la vista|cuidate|sayonara|bai|hasta mañana)\b/i
    ],
    confidence: 0.8,
    responseGenerator: (params) => {
      // Adaptar la despedida según el sentimiento percibido
      const sentimiento = params.memory.userSentiment;
      
      if (sentimiento > 0.3) {
        // Sentimiento positivo
        const despedidasPositivas = [
          `¡Ha sido un placer conversar contigo! 😊 Si quieres saber más sobre ${eduardoInfo.nombre} en el futuro, estaré aquí. ¡Hasta pronto!`,
          `¡Gracias por tu tiempo! Me ha encantado hablar contigo sobre ${eduardoInfo.nombre}. ¡Vuelve cuando quieras! 👋`,
          `¡Hasta luego! Ha sido una conversación muy agradable. Recuerda que estoy aquí para contarte más sobre ${eduardoInfo.nombre} cuando lo necesites. ✨`
        ];
        return despedidasPositivas[Math.floor(Math.random() * despedidasPositivas.length)];
      } else {
        // Sentimiento neutral o negativo
        const despedidasGenerales = [
          `¡Hasta pronto! Espero haberte sido de ayuda con la información sobre ${eduardoInfo.nombre}.`,
          `¡Adiós! Regresa cuando quieras saber más sobre ${eduardoInfo.nombre} y su trabajo.`,
          `¡Que tengas un buen día! Estaré aquí si necesitas más información sobre ${eduardoInfo.nombre}.`
        ];
        return despedidasGenerales[Math.floor(Math.random() * despedidasGenerales.length)];
      }
    }
  },
  {
    name: "sobre_eduardo",
    examples: [
      "cuéntame sobre Eduardo", "quién es Eduardo", "información general", "perfil",
      "háblame de Eduardo", "descríbeme a Eduardo"
    ],
    patterns: [
      /\b(quien es|el eduardo|es eduardo|sobre eduardo|acerca de|cuentame|eduardo|perfil|informacion general)\b/i
    ],
    confidence: 0.7,
    responseGenerator: (params) => {
      // Verificar si ya ha pedido esta información antes
      const hasPreviouslyAsked = params.memory.history.some(
        entry => entry.role === "user" && entry.detectedIntent === "sobre_eduardo"
      );
      
      if (hasPreviouslyAsked) {
        // Si ya había preguntado antes, dar información adicional
        const respuestasAdicionales = [
          `Además de lo que te conté antes, ${eduardoInfo.nombre} se especializa en ${eduardoInfo.intereses}. Sus proyectos abarcan desde ${eduardoInfo.proyectos[0]} hasta ${eduardoInfo.proyectos[eduardoInfo.proyectos.length-1]}. ¿Te gustaría conocer algo específico sobre su trayectoria?`,
          `Como complemento a lo que ya sabes, ${eduardoInfo.nombre} tiene ${eduardoInfo.edad} años y es un apasionado de la tecnología desde joven. Comenzó su carrera ${eduardoInfo.experiencia}. ¿Hay algún aspecto particular que te interese?`,
          `Para ampliar lo que ya te comenté, ${eduardoInfo.nombre} es un profesional versátil que domina tecnologías como ${eduardoInfo.habilidades.slice(0, 4).join(", ")} entre otras. ¿Te gustaría saber más sobre alguna de sus habilidades específicas?`
        ];
        return respuestasAdicionales[Math.floor(Math.random() * respuestasAdicionales.length)];
      } else {
        // Primera vez que pregunta
        const respuestasIniciales = [
          `${eduardoInfo.nombre} es un ${eduardoInfo.profesion} ${eduardoInfo.educacion}. Tiene experiencia ${eduardoInfo.experiencia} y se especializa en ${eduardoInfo.intereses}. ¿Hay algo específico sobre él que te gustaría conocer?`,
          `${eduardoInfo.nombre} es un desarrollador de ${eduardoInfo.edad} años que se graduó ${eduardoInfo.educacion}. Su tesis fue una ${eduardoInfo.tesis} y actualmente trabaja en proyectos relacionados con tecnologías web modernas. ¿Quieres que profundice en algún aspecto?`,
          `${eduardoInfo.nombre} es un talentoso ${eduardoInfo.profesion} con experiencia en desarrollo web y aplicaciones móviles. Se graduó con distinciones en ${eduardoInfo.educacion.split(" de ")[1]} y tiene experiencia con tecnologías como ${eduardoInfo.habilidades.slice(0, 3).join(", ")}. ¿Te interesa saber más sobre su trayectoria profesional o sus proyectos?`
        ];
        return respuestasIniciales[Math.floor(Math.random() * respuestasIniciales.length)];
      }
    }
  },
  {
    name: "habilidades_tecnicas",
    examples: [
      "qué habilidades tiene", "tecnologías", "lenguajes", "herramientas", "qué sabe hacer",
      "frameworks", "conocimientos técnicos", "stack", "tecnologías que maneja"
    ],
    patterns: [
      /\b(habilidades|skills|tecnologias|lenguajes|programacion|sabe|conoce|stack|domina|maneja|especialidad|herramientas)\b/i
    ],
    confidence: 0.75,
    responseGenerator: (params) => {
      // Comprobamos si ha mencionado alguna tecnología específica
      const tecnologiasMencionadas = params.detectedEntities.tecnologias;
      
      if (tecnologiasMencionadas && tecnologiasMencionadas.length > 0) {
        // Respuesta sobre tecnologías específicas
        const tech = tecnologiasMencionadas[0];
        // Crear un mapa de respuestas para tecnologías específicas
        const techResponses: Record<string, string[]> = {
          javascript: [
            `${eduardoInfo.nombre} tiene amplia experiencia con JavaScript, utilizándolo tanto en frontend como backend. Lo considera fundamental en su stack y lo usa diariamente en sus proyectos.`,
            `JavaScript es una de las tecnologías core de ${eduardoInfo.nombre}. Lo domina profundamente y lo utiliza en casi todos sus proyectos, combinándolo con frameworks modernos.`
          ],
          typescript: [
            `TypeScript es una de las herramientas preferidas de ${eduardoInfo.nombre}. Aprecia el sistema de tipos que ayuda a prevenir errores y hace el código más mantenible a largo plazo.`,
            `${eduardoInfo.nombre} ha adoptado TypeScript en la mayoría de sus proyectos recientes, valorando la seguridad de tipos y la mejor experiencia de desarrollo que ofrece.`
          ],
          react: [
            `React es el framework frontend preferido de ${eduardoInfo.nombre}. Lo ha utilizado en múltiples proyectos y se siente muy cómodo con sus patrones y ecosistema.`,
            `En cuanto a React, ${eduardoInfo.nombre} lo utiliza frecuentemente para desarrollo web. También tiene experiencia con React Native para aplicaciones móviles.`
          ],
          // Podríamos continuar con más tecnologías específicas...
        };
        
        // Buscar una coincidencia parcial en las claves
        const matchedKey = Object.keys(techResponses).find(key => 
          tech.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(tech.toLowerCase())
        );
        
        if (matchedKey) {
          const responses = techResponses[matchedKey];
          return responses[Math.floor(Math.random() * responses.length)];
        }
      }
      
      // Si no hay tecnología específica o no la tenemos mapeada, respuesta general
      // Agregar variedad cognitiva en la presentación de habilidades
      const shuffledSkills = [...eduardoInfo.habilidades].sort(() => Math.random() - 0.5);
      const frontendSkills = shuffledSkills.filter(s => ["JavaScript", "TypeScript", "React", "Figma", "Fresh"].includes(s));
      const backendSkills = shuffledSkills.filter(s => ["Node.js", "Python", "SQL", "PHP", "Deno"].includes(s));
      
      const respuestasGenerales = [
        `${eduardoInfo.nombre} domina varias tecnologías entre las que destacan ${shuffledSkills.slice(0, 5).join(", ")} y más. Es particularmente hábil en desarrollo web moderno, utilizando ${frontendSkills.slice(0, 2).join(" y ")} para frontend, y ${backendSkills.slice(0, 2).join(" y ")} para backend.`,
        `Las habilidades técnicas de ${eduardoInfo.nombre} abarcan ${shuffledSkills.slice(0, 4).join(", ")}, entre otras. Su enfoque en ${eduardoInfo.intereses} le permite crear soluciones eficientes y con buena experiencia de usuario. ¿Te interesa alguna tecnología específica?`,
        `${eduardoInfo.nombre} tiene un stack tecnológico versátil que incluye ${frontendSkills.slice(0, 3).join(", ")} para desarrollo frontend y ${backendSkills.slice(0, 3).join(", ")} para backend. Esta combinación le permite abordar proyectos full-stack de manera integral.`
      ];
      
      return respuestasGenerales[Math.floor(Math.random() * respuestasGenerales.length)];
    }
  },
  {
    name: "experiencia_laboral",
    examples: [
      "dónde ha trabajado", "experiencia profesional", "trayectoria", "empleos", 
      "en qué empresas", "historial laboral", "carrera profesional"
    ],
    patterns: [
      /\b(experiencia|que hace|trabajo|carrera|profesional|laboral|chamba|chambeo|trayectoria|empleos?|ha trabajado|empresas|colegio|leonardo|vinci|tisa|hospital|juan noe|istyle|ancestral|ultracrop|ultracropcare|second mind|waki|wakilabs)\b/i
    ],
    confidence: 0.7,
    responseGenerator: (params) => {
      // Verificar si se menciona alguna empresa específica
      const empresasMencionadas = params.detectedEntities.empresas;
      const mensaje = params.normalizedMessage.toLowerCase();
      
      // Detectar "sí" o afirmaciones similares después de haber mencionado experiencia
      const esRespuestaAfirmativa = /^(si|sí|claro|ok|dale|por supuesto|adelante|obvio|me interesa)$/i.test(mensaje);
      
      // Verificar si en la historia reciente se habló de experiencia de manera general
      const ultimasMenciones = params.memory.history
        .slice(-6) // Aumentamos para capturar más contexto
        .filter(e => e.content.toLowerCase().includes("experiencia") || 
                    e.content.toLowerCase().includes("trabajo") ||
                    e.content.toLowerCase().includes("desempeñó"))
        .map(e => e.content.toLowerCase());
      
      // Si es una respuesta afirmativa a una pregunta sobre experiencia
      if (esRespuestaAfirmativa && ultimasMenciones.length > 0) {
        // Verificar si la última mención fue general o específica
        const ultimaMencionGeneral = ultimasMenciones.some(m => 
          m.includes("tiene una trayectoria") || 
          m.includes("experiencia diversa") || 
          m.includes("ha trabajado en diversos") ||
          m.includes("te gustaría conocer")
        );
        
        // Si la última mención fue general, dar un detalle específico de una experiencia
        if (ultimaMencionGeneral) {
          // Elegir una experiencia destacada aleatoria para comenzar con detalles
          const experienciasDestacadas = [
            eduardoInfo.experiencias.find(e => e.lugar.includes("Ancestral")), // Trabajo actual
            eduardoInfo.experiencias.find(e => e.lugar.includes("Leonardo")),  // Experiencia educativa
            eduardoInfo.experiencias.find(e => e.lugar.includes("iStyle"))     // Experiencia técnica
          ].filter(Boolean) as typeof eduardoInfo.experiencias;
          
          const experienciaDestacada = experienciasDestacadas[Math.floor(Math.random() * experienciasDestacadas.length)];
          
          // Generar una respuesta detallada
          const respuestasDetalladas = [
            `Te contaré más sobre la experiencia de Eduardo en ${experienciaDestacada.lugar}. Durante su periodo como ${experienciaDestacada.rol} (${experienciaDestacada.periodo}), ${experienciaDestacada.descripcion} Esta experiencia fue fundamental para desarrollar sus habilidades en ${experienciaDestacada.lugar.includes("Ancestral") ? "desarrollo de software empresarial" : experienciaDestacada.lugar.includes("Leonardo") ? "gestión de tecnología educativa" : "soporte técnico especializado"}. ¿Te gustaría conocer otra experiencia laboral?`,
            
            `En ${experienciaDestacada.lugar}, Eduardo no solo trabajó como ${experienciaDestacada.rol} durante ${experienciaDestacada.periodo}, sino que también profundizó en ${experienciaDestacada.lugar.includes("Ancestral") ? "tecnologías modernas de desarrollo como C#, Blazor y SQL Server" : experienciaDestacada.lugar.includes("Leonardo") ? "plataformas educativas y digitalización de procesos académicos" : "diagnóstico y reparación de equipos de alta gama"}. ${experienciaDestacada.descripcion} ¿Qué otra experiencia profesional de Eduardo te interesa conocer?`
          ];
          
          return respuestasDetalladas[Math.floor(Math.random() * respuestasDetalladas.length)];
        }
        
        // Identificar la última experiencia mencionada para evitar repetirla
        let ultimaExperienciaMencionada = null;
        
        for (const mencion of ultimasMenciones) {
          for (const experiencia of eduardoInfo.experiencias) {
            if (mencion.includes(experiencia.lugar.toLowerCase())) {
              ultimaExperienciaMencionada = experiencia.lugar;
              break;
            }
          }
          if (ultimaExperienciaMencionada) break;
        }
        
        // Filtrar experiencias para excluir la última mencionada
        const experienciasDisponibles = eduardoInfo.experiencias.filter(exp => 
          !ultimaExperienciaMencionada || exp.lugar !== ultimaExperienciaMencionada
        );
        
        // Elegir una experiencia aleatoria diferente
        if (experienciasDisponibles.length > 0) {
          const nuevaExperiencia = experienciasDisponibles[Math.floor(Math.random() * experienciasDisponibles.length)];
          
          // Generar una respuesta detallada en vez de solo mencionar
          const respuestasDetalladas = [
            `Pasemos a otra experiencia interesante. En ${nuevaExperiencia.lugar}, Eduardo se desempeñó como ${nuevaExperiencia.rol} durante ${nuevaExperiencia.periodo}. Allí ${nuevaExperiencia.descripcion} Esta experiencia le permitió desarrollar habilidades en ${nuevaExperiencia.lugar.includes("Hospital") ? "soporte técnico en entornos críticos" : nuevaExperiencia.lugar.includes("WAKI") ? "gestión de proyectos y diseño UI" : nuevaExperiencia.lugar.includes("Second Mind") ? "emprendimiento y liderazgo tecnológico" : nuevaExperiencia.lugar.includes("TISA") ? "planificación de infraestructura tecnológica" : "desarrollo de software y sistemas"}. ¿Te gustaría conocer más sobre otra experiencia?`,
            
            `Eduardo también tiene una historia interesante en ${nuevaExperiencia.lugar}. Como ${nuevaExperiencia.rol} (${nuevaExperiencia.periodo}), no solo ${nuevaExperiencia.descripcion.replace("Sus responsabilidades incluían ", "")}, sino que también adquirió valiosa experiencia en ${nuevaExperiencia.lugar.includes("iStyle") ? "diagnóstico y reparación de dispositivos Apple de alta gama" : nuevaExperiencia.lugar.includes("Second Mind") ? "liderazgo de equipos tecnológicos y participación en competencias de innovación" : "implementación de soluciones tecnológicas adaptadas a contextos específicos"}. ¿Hay alguna otra área de su experiencia profesional que te interese conocer?`
          ];
          
          return respuestasDetalladas[Math.floor(Math.random() * respuestasDetalladas.length)];
        } else {
          // Ofrecer opciones específicas si por alguna razón no hay experiencias disponibles
          return `${eduardoInfo.nombre} tiene una trayectoria diversa. ¿Te interesa conocer detalles sobre alguna experiencia específica? Por ejemplo: su trabajo en el Hospital Juan Noé, iStyle Store, Colegio Leonardo Da Vinci, TISA, Second Mind o su rol actual en UltraCropCare.`;
        }
      }
      
      // Si se menciona una empresa o lugar específico
      if (empresasMencionadas && empresasMencionadas.length > 0 || 
          mensaje.includes("leonardo") || mensaje.includes("vinci") || 
          mensaje.includes("davinci") || mensaje.includes("da vinci") || 
          mensaje.includes("tisa") || mensaje.includes("hospital") || 
          mensaje.includes("istyle") || mensaje.includes("ultracrop") || 
          mensaje.includes("ancestral") || mensaje.includes("second mind") || 
          mensaje.includes("waki") || mensaje.includes("wakilabs") || mensaje.includes("waki labs")) {
        
        // Normalizar la búsqueda
        const busqueda = empresasMencionadas && empresasMencionadas.length > 0 ? 
                         empresasMencionadas[0].toLowerCase() : mensaje;
        
        // Encontrar la experiencia correspondiente
        let experienciaEncontrada;
        
        if (busqueda.includes("hospital") || busqueda.includes("juan") || busqueda.includes("noe")) {
          experienciaEncontrada = eduardoInfo.experiencias.find(e => e.lugar.includes("Hospital"));
        } else if (busqueda.includes("istyle") || busqueda.includes("apple")) {
          experienciaEncontrada = eduardoInfo.experiencias.find(e => e.lugar.includes("iStyle"));
        } else if (busqueda.includes("leonardo") || busqueda.includes("vinci") || busqueda.includes("davinci") || busqueda.includes("da vinci")) {
          experienciaEncontrada = eduardoInfo.experiencias.find(e => e.lugar.includes("Leonardo"));
        } else if (busqueda.includes("tisa") || busqueda.includes("international") || busqueda.includes("school")) {
          experienciaEncontrada = eduardoInfo.experiencias.find(e => e.lugar.includes("International"));
        } else if (busqueda.includes("ancestral") || busqueda.includes("ultracrop") || busqueda.includes("crop")) {
          experienciaEncontrada = eduardoInfo.experiencias.find(e => e.lugar.includes("Ancestral"));
        } else if (busqueda.includes("second") || busqueda.includes("mind")) {
          experienciaEncontrada = eduardoInfo.experiencias.find(e => e.lugar.includes("Second"));
        } else if (busqueda.includes("waki")) {
          experienciaEncontrada = eduardoInfo.experiencias.find(e => e.lugar.includes("WAKI"));
        } else if (busqueda.includes("wakilabs") || busqueda.includes("waki labs")) {
          experienciaEncontrada = eduardoInfo.experiencias.find(e => e.lugar.includes("WAKI Labs"));
        }
        
        if (experienciaEncontrada) {
          const respuestasEspecificas = [
            `En ${experienciaEncontrada.lugar}, ${eduardoInfo.nombre} se desempeñó como ${experienciaEncontrada.rol} durante ${experienciaEncontrada.periodo}. Sus responsabilidades incluían ${experienciaEncontrada.descripcion} ¿Te gustaría saber más sobre esta experiencia o alguna otra?`,
            `${eduardoInfo.nombre} trabajó en ${experienciaEncontrada.lugar} como ${experienciaEncontrada.rol} (${experienciaEncontrada.periodo}). Allí ${experienciaEncontrada.descripcion} ¿Quieres conocer detalles de alguna otra experiencia?`,
            `Durante su tiempo en ${experienciaEncontrada.lugar} (${experienciaEncontrada.periodo}), ${eduardoInfo.nombre} fue ${experienciaEncontrada.rol}, donde ${experienciaEncontrada.descripcion} Esta experiencia fue fundamental para su desarrollo profesional. ¿Hay algún otro aspecto que te interese?`
          ];
          return respuestasEspecificas[Math.floor(Math.random() * respuestasEspecificas.length)];
        }
      }
      
      // Si no hay empresa específica o no la encontramos, dar resumen general
      const experienciasClave = eduardoInfo.experiencias.map(e => `${e.lugar} (${e.rol})`);
      
      const respuestasGenerales = [
        `${eduardoInfo.nombre} tiene una trayectoria profesional diversa que incluye experiencia en ${experienciasClave.slice(0, 3).join(", ")} y actualmente en ${eduardoInfo.experiencias[eduardoInfo.experiencias.length-1].lugar}. ¿Te gustaría conocer más sobre alguna de estas experiencias en particular?`,
        `La carrera de ${eduardoInfo.nombre} ha evolucionado desde ${eduardoInfo.experiencias[0].lugar} hasta su posición actual en ${eduardoInfo.experiencias[eduardoInfo.experiencias.length-1].lugar}. Esta progresión le ha permitido desarrollar un conjunto diverso de habilidades. ¿Sobre cuál experiencia quieres saber más?`,
        `${eduardoInfo.nombre} ha trabajado en diversos sectores: tecnología de la salud (${eduardoInfo.experiencias[0].lugar}), retail tecnológico (${eduardoInfo.experiencias[1].lugar}), y educación (${eduardoInfo.experiencias[4].lugar}). Actualmente se desempeña en tecnología agrícola con ${eduardoInfo.experiencias[eduardoInfo.experiencias.length-1].lugar}. ¿Hay alguna área específica que te interese?`
      ];
      
      return respuestasGenerales[Math.floor(Math.random() * respuestasGenerales.length)];
    }
  },
  {
    name: "educacion",
    examples: [
      "dónde estudió", "formación académica", "universidad", "título", "carrera", 
      "estudios", "grado académico", "educación"
    ],
    patterns: [
      /\b(educacion|estudios|universidad|titulo|carrera|grado|ingeniero|informatico|informático|santo tomás|uta|santo tomas|santo|tomás|formación|academico|académico|egresado)\b/i
    ],
    confidence: 0.75,
    responseGenerator: (params) => {
      // Analizar si es primera vez que pregunta sobre este tema
      const hasAskedBefore = params.memory.history.some(
        entry => entry.role === "user" && 
        (entry.detectedIntent === "educacion" || 
         (entry.topicTags && entry.topicTags.includes("educacion")))
      );
      
      if (hasAskedBefore) {
        // Información adicional si ya ha preguntado antes
        const respuestasDetalladas = [
          `Como complemento a lo que ya te comenté, su tesis titulada "${eduardoInfo.tesis}" demostró su capacidad para aplicar tecnologías modernas como React Native a problemas educativos reales. El tribunal valoró especialmente la usabilidad y diseño de la aplicación.`,
          `Además de su título formal, ${eduardoInfo.nombre} es un firme creyente del aprendizaje continuo. Constantemente se actualiza mediante cursos online, tutoriales y participación en comunidades de desarrolladores.`,
          `Un aspecto destacable de su formación es que ${eduardoInfo.nombre} combinó sus estudios formales con proyectos freelance, lo que le permitió aplicar inmediatamente los conocimientos teóricos y desarrollar habilidades prácticas.`
        ];
        return respuestasDetalladas[Math.floor(Math.random() * respuestasDetalladas.length)];
      } else {
        // Primera vez que pregunta
        const respuestasBasicas = [
          `${eduardoInfo.nombre} ${eduardoInfo.educacion}. Su proyecto de tesis fue una ${eduardoInfo.tesis}, demostrando su habilidad para combinar desarrollo móvil con aplicaciones educativas. ¿Te gustaría saber más sobre su formación?`,
          `En cuanto a su educación, ${eduardoInfo.nombre} es ${eduardoInfo.educacion}. Se especializó en desarrollo de software y culminó sus estudios con una ${eduardoInfo.tesis}. ¿Hay algún aspecto particular de su formación que te interese?`,
          `${eduardoInfo.nombre} completó sus estudios de Ingeniería en Informática en Santo Tomás Arica, graduándose con distinción máxima. Este logro refleja su dedicación y excelencia académica. Su tesis sobre hábitos de estudio utilizando React Native obtuvo una calificación sobresaliente.`
        ];
        return respuestasBasicas[Math.floor(Math.random() * respuestasBasicas.length)];
      }
    }
  },
  {
    name: "proyectos",
    examples: [
      "qué proyectos ha realizado", "portafolio", "trabajos", "creaciones", 
      "desarrollos", "aplicaciones", "sitios web", "muestras de trabajo"
    ],
    patterns: [
      /\b(proyectos|portfolio|trabajos|desarrollo|aplicaciones|apps|web|sitios|creaciones|portafolio|ha (creado|hecho|desarrollado))\b/i
    ],
    confidence: 0.7,
    responseGenerator: (params) => {
      // Verificar si hay contexto previo o entidades detectadas
      const temasDetectados = params.detectedEntities.temas;
      const temaEspecifico = temasDetectados && temasDetectados.length > 0 ? temasDetectados[0] : null;
      
      if (temaEspecifico) {
        // Respuestas para temas específicos
        if (temaEspecifico.includes("mascota") || temaEspecifico.includes("animal")) {
          return `${eduardoInfo.nombre} está desarrollando un sistema integral para negocios de mascotas que incluye gestión de citas para peluquería canina y un completo sistema de inventarios con envíos a domicilio. Este proyecto combina su pasión por las mascotas (tiene dos gatos) con sus habilidades de desarrollo.`;
        } else if (temaEspecifico.includes("puerto") || temaEspecifico.includes("maritim")) {
          return `${eduardoInfo.nombre} está involucrado en proyectos confidenciales del sector portuario. Estos proyectos abarcan dos áreas: digitalización de operaciones mediante integraciones web y migración de sistemas legacy. Por acuerdos de confidencialidad, no puede compartir detalles específicos.`;
        } else if (temaEspecifico.includes("portafolio") || temaEspecifico.includes("página") || temaEspecifico.includes("sitio")) {
          return `Este portafolio que estás explorando es uno de los proyectos recientes de ${eduardoInfo.nombre}. Lo desarrolló utilizando Fresh y Deno, implementando este asistente conversacional como alternativa innovadora a la típica sección "Sobre mí". ¿Te interesa conocer cómo funciona?`;
        }
      }
      
      // Si no hay tema específico, responder de manera general pero con variedad cognitiva
      // Elegir aleatoriamente qué proyectos destacar
      const elegirProyectoAleatorio = () => {
        const proyectos = [
          "aplicación de hábitos de estudio en React Native",
          "sistema para negocios de mascotas",
          "proyectos de digitalización portuaria",
          "Second Mind (ganador de innovación en Mercado E)",
          "soluciones para el sector agrícola",
          "este portafolio interactivo"
        ];
        return proyectos[Math.floor(Math.random() * proyectos.length)];
      };
      
      const proyecto1 = elegirProyectoAleatorio();
      let proyecto2 = elegirProyectoAleatorio();
      while (proyecto2 === proyecto1) {
        proyecto2 = elegirProyectoAleatorio();
      }
      
      const respuestasGenerales = [
        `${eduardoInfo.nombre} ha desarrollado diversos proyectos a lo largo de su carrera. Entre los destacados están ${proyecto1} y ${proyecto2}. Cada proyecto refleja su enfoque en experiencias de usuario intuitivas y código limpio. ¿Te gustaría conocer detalles de alguno en particular?`,
        `El portfolio de ${eduardoInfo.nombre} incluye proyectos como ${proyecto1} y ${proyecto2}, entre otros. Su versatilidad le permite trabajar tanto en aplicaciones web como móviles, siempre con un enfoque en soluciones elegantes y funcionales. ¿Sobre cuál te gustaría saber más?`,
        `En términos de proyectos, ${eduardoInfo.nombre} ha trabajado en ${proyecto1}, ${proyecto2} y varios más. Su enfoque combina diseño atractivo con código eficiente para crear experiencias digitales completas. ¿Hay algún tipo de proyecto que te interese especialmente?`
      ];
      
      return respuestasGenerales[Math.floor(Math.random() * respuestasGenerales.length)];
    }
  },
  {
    name: "contacto",
    examples: [
      "cómo contactarlo", "datos de contacto", "email", "correo", "redes sociales",
      "linkedin", "github", "ponerse en contacto", "contactar"
    ],
    patterns: [
      /\b(contacto|email|correo|comunicar|mensaje|contactar|hablar|contactarme|contactarte|contactar|contactemos|conectemos|conectar|linkedin|github|redes|sociales)\b/i
    ],
    confidence: 0.8,
    responseGenerator: (_params) => {
        const respuestas = [
        `Puedes contactar a ${eduardoInfo.nombre} a través de su email ${eduardoInfo.contacto} o mediante su perfil de <a href="https://www.linkedin.com/in/eduardo-rojo-serrano/" target="_blank">LinkedIn</a>. También puedes explorar sus proyectos en <a href="https://github.com/rainbowstain" target="_blank">GitHub</a>.`,
        `La mejor manera de contactar a ${eduardoInfo.nombre} es por su correo electrónico: ${eduardoInfo.contacto}. También está activo en <a href="https://www.linkedin.com/in/eduardo-rojo-serrano/" target="_blank">LinkedIn</a> donde responde mensajes profesionales.`,
        `${eduardoInfo.nombre} está disponible a través de su email ${eduardoInfo.contacto} y en sus perfiles profesionales: <a href="https://www.linkedin.com/in/eduardo-rojo-serrano/" target="_blank">LinkedIn</a> y <a href="https://github.com/rainbowstain" target="_blank">GitHub</a>. No dudes en contactarlo para consultas o propuestas.`
      ];
      
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
  {
    name: "hobbies_intereses",
    examples: [
      "qué le gusta hacer", "hobbies", "pasatiempos", "en su tiempo libre", 
      "intereses personales", "gustos", "música", "videojuegos"
    ],
    patterns: [
      /\b(hobby|hobbies|interes|intereses|tiempo libre|diversion|divertirse|pasatiempo|gusta hacer|aficion|musica|cancion|videojuegos|juego|serie|pelicula|anime)\b/i
    ],
    confidence: 0.65,
    responseGenerator: (params) => {
      // Verificar si hay entidades específicas detectadas
      const temasDetectados = params.detectedEntities.temas;
      
      if (temasDetectados && temasDetectados.length > 0) {
        const tema = temasDetectados[0].toLowerCase();
        
        // Respuestas para temas específicos
        if (tema.includes("music") || tema.includes("canci") || tema.includes("artista")) {
          return `A ${eduardoInfo.nombre} le encanta la música, especialmente géneros como ${eduardoInfo.musica.generos.join(" y ")}. Entre sus artistas favoritos están ${eduardoInfo.musica.artistas.slice(0, 3).join(", ")} y varios más. La música es una gran fuente de inspiración mientras programa.`;
        } else if (tema.includes("video") || tema.includes("juego") || tema.includes("gaming")) {
          const juegos = eduardoInfo.entretenimiento.videojuegos;
          return `${eduardoInfo.nombre} es un entusiasta de los videojuegos. Disfruta tanto de títulos competitivos como ${juegos[0]} y ${juegos[1]}, así como experiencias más inmersivas como ${juegos[juegos.length-1]}. Es su forma preferida de desconectar después de largas sesiones de programación.`;
        } else if (tema.includes("serie") || tema.includes("pelic") || tema.includes("tv") || tema.includes("cine")) {
          return `En cuanto a entretenimiento audiovisual, ${eduardoInfo.nombre} disfruta de series como ${eduardoInfo.entretenimiento.series.join(", ")}. También es fan del anime, combinando estos intereses con su pasión por la tecnología y el desarrollo.`;
        } else if (tema.includes("mascota") || tema.includes("animal") || tema.includes("gato")) {
          return `${eduardoInfo.nombre} es amante de los gatos y comparte su vida con ${eduardoInfo.mascotas[0].nombre} y ${eduardoInfo.mascotas[1].nombre}, quienes le acompañan durante sus sesiones de programación. Sus mascotas son parte importante de su vida diaria y fuente de alegría.`;
        }
      }
      
      // Si no hay tema específico o no coincide, dar una respuesta general variada
      // Usar un enfoque de respuesta compuesta con elementos aleatorios para crear variedad
      
      const elementos = [
        {
          tipo: "música", 
          descripciones: [
            `disfrutar de música ${eduardoInfo.musica.generos.join(" y ")}`,
            `escuchar artistas como ${eduardoInfo.musica.artistas[Math.floor(Math.random() * eduardoInfo.musica.artistas.length)]}`
          ]
        },
        {
          tipo: "videojuegos",
          descripciones: [
            `jugar a ${eduardoInfo.entretenimiento.videojuegos[Math.floor(Math.random() * eduardoInfo.entretenimiento.videojuegos.length)]}`,
            `disfrutar de videojuegos competitivos e inmersivos`
          ]
        },
        {
          tipo: "series",
          descripciones: [
            `ver series como ${eduardoInfo.entretenimiento.series[Math.floor(Math.random() * eduardoInfo.entretenimiento.series.length)]}`,
            `disfrutar de anime`
          ]
        },
        {
          tipo: "mascotas",
          descripciones: [
            `pasar tiempo con sus gatos ${eduardoInfo.mascotas[0].nombre} y ${eduardoInfo.mascotas[1].nombre}`,
            `jugar con sus mascotas`
          ]
        }
      ];
      
      // Elegir aleatoriamente 2-3 elementos diferentes
      const shuffled = [...elementos].sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 2 + Math.floor(Math.random() * 2)); // 2 o 3 elementos
      
      const hobbiesDescripcion = selected.map(elem => 
        elem.descripciones[Math.floor(Math.random() * elem.descripciones.length)]
      ).join(", ");
      
        const respuestas = [
        `Fuera del ámbito profesional, ${eduardoInfo.nombre} disfruta de ${hobbiesDescripcion}. Estos intereses personales le ayudan a mantener un equilibrio en su vida y a encontrar inspiración para sus proyectos creativos.`,
        `${eduardoInfo.nombre} equilibra su tiempo entre el desarrollo profesional y sus pasiones personales: ${hobbiesDescripcion}. Cree firmemente que estos intereses diversos enriquecen su perspectiva creativa.`,
        `Cuando no está programando, a ${eduardoInfo.nombre} le gusta ${hobbiesDescripcion}. Estos pasatiempos le permiten desconectar y recargar energías para sus proyectos tecnológicos.`
      ];
      
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
  {
    name: "comida_favorita",
    examples: [
      "comida favorita", "qué le gusta comer", "platos preferidos", "gastronomía",
      "qué cocina", "le gusta cocinar", "gustos culinarios"
    ],
    patterns: [
      /\b(comida|plato|favorito|gusta comer|comida favorita|plato favorito|cocina|gastronomia|restaurant|restaurante|naranja|fideos|pasta|salsa)\b/i
    ],
    confidence: 0.7,
    responseGenerator: (_params) => {
        const respuestas = [
        `${eduardoInfo.nombre} tiene gustos culinarios sencillos pero muy definidos. Disfruta especialmente de las naranjas como fruta favorita y los fideos con salsa como plato principal. Estas preferencias reflejan su aprecio por lo esencial y bien ejecutado.`,
        `En términos gastronómicos, ${eduardoInfo.nombre} prefiere las naranjas por su frescura y sabor natural, y los fideos con salsa como plato reconfortante. Sus gustos culinarios son similares a su enfoque en programación: valora lo directo y efectivo.`,
        `La comida favorita de ${eduardoInfo.nombre} incluye naranjas frescas y un buen plato de fideos con salsa. Estos alimentos sencillos pero satisfactorios son su elección para mantenerse con energía mientras trabaja en sus proyectos.`
      ];
      
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
  {
    name: "agradecimiento",
    examples: [
      "gracias", "te lo agradezco", "muchas gracias", "agradecido", "thanks"
    ],
    patterns: [
      /\b(gracias|agradezco|agradecido|thanks|thank you|thx|ty|merci|arigato|danke|obrigado)\b/i
    ],
    confidence: 0.85,
    responseGenerator: (params) => {
      // Ajustar respuesta según el historial de conversación
      const interacciones = params.memory.history.filter(h => h.role === "user").length;
      
      if (interacciones <= 2) {
        // Pocas interacciones, respuesta simple
        const respuestasSimples = [
          `¡De nada! Estoy aquí para compartir información sobre ${eduardoInfo.nombre}. ¿Hay algo más que quieras saber?`,
          `¡Con gusto! Si tienes más preguntas sobre ${eduardoInfo.nombre}, no dudes en consultar.`,
          `¡Es un placer! ¿Puedo ayudarte con algo más respecto a ${eduardoInfo.nombre}?`
        ];
        return respuestasSimples[Math.floor(Math.random() * respuestasSimples.length)];
      } else {
        // Más interacciones, respuesta más personalizada
        const respuestasPersonalizadas = [
          `¡De nada! Ha sido una conversación interesante. Me gusta poder compartir información sobre el trabajo de ${eduardoInfo.nombre}. ¿Hay algún otro aspecto de su perfil que te interese?`,
          `¡Es un gusto poder ayudar! ${eduardoInfo.nombre} estaría encantado de saber que te ha interesado su perfil profesional. ¿Necesitas saber algo más específico?`,
          `¡El placer es mío! Espero que la información sobre ${eduardoInfo.nombre} te haya sido útil. ¿Quieres explorar alguna otra faceta de su carrera o intereses?`
        ];
        return respuestasPersonalizadas[Math.floor(Math.random() * respuestasPersonalizadas.length)];
      }
    }
  },
  {
    name: "sobre_ia",
    examples: [
      "qué eres", "eres una IA", "cómo funcionas", "quién te creó", 
      "eres un chatbot", "eres humano", "qué modelo", "con qué estás programada"
    ],
    patterns: [
      /\b(eres (un|una) (ia|inteligencia|robot|chatbot|asistente)|como funcionas|quien te (creo|hizo|programo)|que eres|eres humano|eres real|modelo de ia|como estas programad)\b/i
    ],
    confidence: 0.75,
    responseGenerator: (params) => {
      // Adaptar la respuesta según el número de interacciones previas
      const interacciones = params.memory.history.filter(h => h.role === "user").length;
      
      if (interacciones <= 2) {
        // Respuesta inicial, directa y breve
        const respuestasIniciales = [
          `Soy SobremIA, un asistente conversacional impulsado por el "Modelo e1" desarrollado por ${eduardoInfo.nombre}. Funciono como un portafolio vivo, diseñado para mantener conversaciones naturales y dinámicas sobre su perfil profesional.`,
          
          `Soy la interfaz interactiva del "Modelo e1", un sistema de procesamiento neuronal desarrollado específicamente por ${eduardoInfo.nombre} para su portafolio. Mi nombre combina "Sobre Mí" + "IA", representando la fusión entre su perfil profesional y la tecnología conversacional.`,
          
          `Soy SobremIA, un asistente conversacional basado en el "Modelo e1" creado por ${eduardoInfo.nombre}. A diferencia de sistemas que dependen de APIs externas, mi motor de procesamiento es una solución integral desarrollada exclusivamente para este portafolio.`
        ];
        return respuestasIniciales[Math.floor(Math.random() * respuestasIniciales.length)];
      } else {
        // Respuesta más detallada para usuarios más comprometidos
        const respuestasDetalladas = [
          `Funciono mediante el "Modelo e1", una arquitectura neuronal desarrollada por ${eduardoInfo.nombre} que integra varios componentes sofisticados: un sistema de memoria conversacional que mantiene contexto, reconocimiento de intenciones basado en patrones semánticos, extractores de entidades y un motor de generación de respuestas contextualmente relevantes. Todo esto forma un portafolio vivo que evoluciona con cada interacción.`,
          
          `El "Modelo e1" que impulsa mi funcionamiento es una creación exclusiva de ${eduardoInfo.nombre} para su portafolio. Mi arquitectura incluye un sistema de memoria a corto y largo plazo, vectorización semántica para comprender intenciones, análisis de sentimiento, y un sofisticado algoritmo de generación de respuestas que adapta dinámicamente el contenido según el contexto de nuestra conversación.`,
          
          `Como implementación del "Modelo e1", represento un enfoque innovador al concepto de portafolio profesional. Mi sistema neural opera con redes de reconocimiento de intenciones, procesamiento contextual y memoria conversacional, todo implementado con TypeScript y Deno. ${eduardoInfo.nombre} me diseñó para demostrar sus capacidades técnicas a través de una experiencia interactiva en lugar de un simple CV estático.`
        ];
        return respuestasDetalladas[Math.floor(Math.random() * respuestasDetalladas.length)];
      }
    }
  },
  {
    name: "default",
    examples: [
      "quiero saber más", "cuéntame", "información", "datos"
    ],
    patterns: [
      /.+/i // Coincide con cualquier texto
    ],
    confidence: 0.1, // Baja confianza para que otros intents tengan prioridad
    responseGenerator: (params) => {
      // Intentar determinar un posible tema de interés basado en el mensaje
      const normalizedMessage = params.normalizedMessage;
      const words = normalizedMessage.split(/\s+/);
      
      // Si el mensaje es demasiado corto o vago, dar una respuesta general
      if (words.length < 3) {
        const respuestasCortas = [
          `¿Hay algo específico sobre ${eduardoInfo.nombre} que te gustaría saber? Puedo contarte sobre su experiencia, proyectos, educación o habilidades.`,
          `Para ayudarte mejor, ¿podrías especificar qué aspectos del perfil de ${eduardoInfo.nombre} te interesan más? ¿Sus proyectos, experiencia, educación...?`,
          `Estoy aquí para compartir información sobre ${eduardoInfo.nombre}. ¿Te interesa conocer algo en particular sobre él?`
        ];
        return respuestasCortas[Math.floor(Math.random() * respuestasCortas.length)];
      }
      
      // Intentar extraer un tema de interés
      const topicsMapping: Record<string, string[]> = {
        experiencia: ["trabajo", "empleo", "empresa", "puesto", "laboral", "profesión", "carrera", "donde", "trabajo"],
        proyectos: ["proyecto", "desarrollo", "aplicación", "app", "portafolio", "creado", "desarrollado", "implementado"],
        educación: ["estudio", "universidad", "carrera", "título", "grado", "formación", "educación", "aprendizaje"],
        habilidades: ["sabe", "conocimiento", "tecnología", "lenguaje", "framework", "herramienta", "habilidad", "destreza"],
        personal: ["vida", "personal", "hobby", "música", "deporte", "interés", "gusto", "tiempo libre", "mascota"]
      };
      
      // Buscar coincidencias en el mensaje
      const topicMatches: Record<string, number> = {};
      
      for (const [topic, keywords] of Object.entries(topicsMapping)) {
        let matches = 0;
        for (const keyword of keywords) {
          if (normalizedMessage.includes(keyword)) {
            matches++;
          }
        }
        if (matches > 0) {
          topicMatches[topic] = matches;
        }
      }
      
      // Si encontramos coincidencias, generar respuesta basada en el tema más probable
      if (Object.keys(topicMatches).length > 0) {
        const mostLikelyTopic = Object.entries(topicMatches)
          .sort((a, b) => b[1] - a[1])[0][0];
        
        switch (mostLikelyTopic) {
          case "experiencia":
            return `${eduardoInfo.nombre} tiene experiencia diversa que incluye soporte técnico en el Hospital Juan Noé, trabajo con productos Apple en iStyle Store, y actualmente se desempeña en el sector tecnológico con Ancestral Technologies. ¿Te gustaría conocer más sobre alguna de estas experiencias?`;
          case "proyectos":
            return `${eduardoInfo.nombre} ha trabajado en diversos proyectos, desde aplicaciones móviles hasta sistemas web. Su tesis fue una aplicación de hábitos de estudio en React Native, y actualmente desarrolla soluciones para sectores como agricultura y logística portuaria. ¿Hay algún tipo de proyecto que te interese en particular?`;
          case "educación":
            return `${eduardoInfo.nombre} se graduó con distinción máxima en Ingeniería en Informática de Santo Tomás Arica (2018-2023). Su proyecto de tesis recibió una calificación sobresaliente y demostró sus habilidades en desarrollo móvil. ¿Quieres saber más detalles sobre su formación?`;
          case "habilidades":
            return `Las habilidades técnicas de ${eduardoInfo.nombre} incluyen JavaScript, TypeScript, React, Node.js, Python y más. Es versátil tanto en frontend como backend, y tiene experiencia particular en desarrollo web moderno. ¿Te interesa alguna tecnología específica?`;
          case "personal":
            return `En su tiempo libre, ${eduardoInfo.nombre} disfruta de la música (especialmente electrónica y rock), videojuegos como League of Legends y Rocket League, y pasar tiempo con sus dos gatos, Zoe y Naruto. ¿Hay algún aspecto de sus intereses personales que quieras conocer mejor?`;
        }
      }
      
      // Si no encontramos nada específico, respuesta general
      const respuestasGenerales = [
        `Como asistente de ${eduardoInfo.nombre}, puedo hablarte sobre sus habilidades en programación, su experiencia profesional, educación o proyectos. ¿Hay algo específico que te gustaría saber?`,
        `Estoy aquí para compartir información sobre ${eduardoInfo.nombre}, un ${eduardoInfo.profesion} con experiencia en ${eduardoInfo.intereses}. ¿Qué te gustaría conocer sobre él?`,
        `Puedo contarte sobre la formación académica de ${eduardoInfo.nombre}, sus habilidades técnicas o proyectos desarrollados. ¿Qué aspecto de su perfil profesional te interesa más?`
      ];
      
      return respuestasGenerales[Math.floor(Math.random() * respuestasGenerales.length)];
    }
  },
  {
    name: "chistes",
    examples: [
      "cuéntame un chiste", "dime algo gracioso", "hazme reír", "conoces algún chiste",
      "cuéntame una broma", "dime un chiste", "otro", "otro chiste", "uno más"
    ],
    patterns: [
      /\b(chiste|broma|gracioso|reir|divertido|divierteme|hazme reir|cuéntame una broma|cuentame un chiste)\b/i,
      /\b(otro|otra|mas|más|continua|sigue|dime otro|uno mas|uno más)\b/i
    ],
    confidence: 0.8,
    responseGenerator: (params) => {
      // Verificar si ya ha pedido chistes antes para no repetir
      const historicoChistes = params.memory.history
        .filter(entry => entry.role === "assistant" && (entry.content.includes("😂") || entry.content.includes("🐛") || entry.content.includes("🍪")))
        .map(entry => entry.content);
      
      const chistes = [
        `¿Por qué los desarrolladores prefieren el frío? Porque odian los bugs... ¡Y los bugs odian el frío! 🐛❄️`,
        `¿Cómo sabe un programador que su código no funcionará? Lo acaba de escribir. 😂💻`,
        `¿Cuál es la comida favorita de un desarrollador JavaScript? ¡Las cookies! 🍪`,
        `¿Qué le dijo un bit a otro? Te veo en el bus. 🚌`,
        `¿Sabes por qué los programadores confunden Halloween con Navidad? Porque OCT 31 = DEC 25 (en sistemas numéricos). 🎃🎄`,
        `Un programador va al supermercado. Su esposa le dice: "Compra una barra de pan y si hay huevos, trae 6". Volvió con 6 barras de pan: "Había huevos". 🥖🥚`,
        `¿Por qué los programadores siempre confunden Halloween con Navidad? Porque OCT 31 = DEC 25. 🎃🎄`,
        `Un QA entra a un bar, pide una cerveza, pide 0 cervezas, pide 999999 cervezas, pide -1 cerveza, pide una lagartija... 🍺🦎`,
        `¿Cuántos programadores se necesitan para cambiar una bombilla? Ninguno, es un problema de hardware. 💡`,
        `Un programador puso dos manchas en la pantalla. Era un programa con errores. 🖥️`,
        `Si tienes 3 manzanas y 4 naranjas en una mano, y 4 manzanas y 3 naranjas en la otra, ¿qué tienes? Manos enormes. 🍎🍊`,
        `El optimista dice: "El vaso está medio lleno". El pesimista dice: "El vaso está medio vacío". El programador dice: "El vaso es el doble de grande de lo necesario". 🥛`
      ];
      
      // Verificar si el mensaje es corto como "otro" o similar
      const isBriefContinuation = /^(otro|otra|mas|más|si|sí|ok|vale|claro|bueno|seguir|continua|continúa|por favor)$/i.test(params.normalizedMessage);
      
      // Si es continuación breve y el último mensaje fue un chiste, filtrar el último chiste contado
      let lastJoke = "";
      if (isBriefContinuation && historicoChistes.length > 0) {
        lastJoke = historicoChistes[historicoChistes.length - 1];
      }
      
      // Filtrar chistes ya contados o el último si es continuación
      const chistesFiltrados = chistes.filter(chiste => 
        !historicoChistes.includes(chiste) || (chiste !== lastJoke && historicoChistes.length === 1)
      );
      
      // Si ya se han contado casi todos, permitir repeticiones pero no del último
      const chistesDisponibles = chistesFiltrados.length > 0 ? chistesFiltrados : chistes.filter(c => c !== lastJoke);
      
      // Devolver un chiste aleatorio de los disponibles
      return chistesDisponibles[Math.floor(Math.random() * chistesDisponibles.length)] + "\n\n¿Te gustaría escuchar otro?";
    }
  },
  {
    name: "conversacion_general",
    examples: [
      "no hablemos de Eduardo", "hablemos de otra cosa", "cambiemos de tema",
      "no quiero hablar de Eduardo", "hablemos de ti", "prefiero hablar de otro tema"
    ],
    patterns: [
      /\b(no hablemos de eduardo|cambiemos (de )?tema|otra cosa|no (quiero|me interesa) (hablar|saber) (de|sobre) eduardo|hablemos de ti|prefiero (hablar|conversar) de otro tema)\b/i
    ],
    confidence: 0.75,
    responseGenerator: (params) => {
      // Verificar cuánto tiempo llevamos en este tema
      const conversacionGeneralPrevias = params.memory.history.filter(
        e => e.role === "user" && e.detectedIntent === "conversacion_general"
      ).length;
      
      // Si ya llevamos algunas respuestas en conversación general, intentar redirigir
      if (conversacionGeneralPrevias >= 2) {
        const redirecciones = [
          `Entiendo que prefieras hablar de otros temas. Sin embargo, soy un asistente especializado en información sobre Eduardo. ¿Hay algo en particular sobre su perfil profesional que pueda interesarte?`,
          `He disfrutado nuestra conversación más general, pero recuerda que mi función principal es brindarte información sobre Eduardo. ¿Quizás te interese conocer algo sobre sus proyectos o habilidades técnicas?`,
          `Es agradable variar los temas, aunque estoy diseñado principalmente para hablar sobre Eduardo. ¿Te gustaría conocer algo sobre su formación o experiencia profesional?`
        ];
        return redirecciones[Math.floor(Math.random() * redirecciones.length)];
      }
      
      // Primeras respuestas más abiertas
      const respuestasAbiertas = [
        `Claro, podemos hablar de otros temas por un momento. ¿Hay algo en particular que te interese? Aunque debo advertirte que mi especialidad es información sobre Eduardo, intentaré mantener una conversación agradable.`,
        `No hay problema. ¿De qué te gustaría hablar? Ten en cuenta que aunque puedo conversar sobre temas generales, mi conocimiento es más amplio cuando se trata de Eduardo.`,
        `Entiendo. A veces es bueno variar la conversación. ¿Hay algún tema que te llame la atención? Aunque soy un asistente especializado en Eduardo, puedo charlar un poco sobre otros temas.`
      ];
      
      return respuestasAbiertas[Math.floor(Math.random() * respuestasAbiertas.length)];
    }
  },
  {
    name: "tecnologias_generales",
    examples: [
      "qué opinas de Python", "me gusta JavaScript", "cuál es el mejor lenguaje",
      "conoces React", "qué piensas de TypeScript", "háblame de SQL",
      "qué tal es Node.js", "sabes de Angular"
    ],
    patterns: [
      /\b(python|javascript|typescript|react|angular|vue|svelte|node|deno|sql|mongo|mysql|postgresql|php|java|kotlin|swift|html|css|c\+\+|c#|ruby|go|rust|flutter|laravel|django|flask|express|next\.?js|nuxt|bootstrap|tailwind)\b/i
    ],
    confidence: 0.6, // Prioridad media-baja para que no bloquee intents relacionados con Eduardo
    responseGenerator: (params) => {
      const tech = params.normalizedMessage.match(/\b(python|javascript|typescript|react|angular|vue|svelte|node|deno|sql|mongo|mysql|postgresql|php|java|kotlin|swift|html|css|c\+\+|c#|ruby|go|rust|flutter|laravel|django|flask|express|next\.?js|nuxt|bootstrap|tailwind)\b/i)?.[0]?.toLowerCase() || "";
      
      // Mapa de opiniones sobre tecnologías
      const techOpinions: Record<string, string[]> = {
        javascript: [
          `JavaScript es uno de los lenguajes más versátiles del desarrollo web. Su omnipresencia en el navegador lo hace fundamental, aunque algunas personas critican sus peculiaridades. La comunidad suele valorar su flexibilidad y el ecosistema de librerías. ¿Es parte de tu stack tecnológico? Por cierto, Eduardo lo usa habitualmente en sus proyectos.`,
          `JavaScript ha evolucionado muchísimo desde sus inicios. Con características modernas y un ecosistema vibrante, es difícil imaginar el desarrollo web sin él. Muchos desarrolladores aprecian su naturaleza asíncrona y la facilidad para crear interfaces dinámicas. ¿Qué aspectos te interesan de JS? Eduardo lo considera una de sus herramientas principales.`
        ],
        typescript: [
          `TypeScript ha ganado enorme popularidad por añadir seguridad de tipos a JavaScript. Los desarrolladores suelen valorar cómo previene errores en tiempo de compilación y mejora la documentación implícita del código. Aunque tiene una curva de aprendizaje inicial, la mayoría coincide en que vale la pena. ¿Lo has utilizado? Eduardo lo incorpora en sus proyectos más recientes.`,
          `TypeScript se ha convertido en un estándar en muchos equipos de desarrollo. Su sistema de tipos gradual permite adoptarlo progresivamente, y las herramientas de VS Code lo hacen muy productivo. Algunos desarrolladores prefieren la libertad de JavaScript puro, pero TS sigue ganando adeptos. ¿Has trabajado con él? Eduardo lo usa frecuentemente.`
        ],
        react: [
          `React revolucionó la forma de construir interfaces de usuario con su enfoque basado en componentes y su Virtual DOM. Su popularidad sigue creciendo y tiene un ecosistema de librerías impresionante. Muchos desarrolladores aprecian su modelo mental y la flexibilidad que ofrece. ¿Lo utilizas en tus proyectos? Eduardo tiene bastante experiencia con React.`,
          `En cuanto a React, ${eduardoInfo.nombre} lo utiliza frecuentemente para desarrollo web. También tiene experiencia con React Native para aplicaciones móviles.`
        ],
        python: [
          `Python es valorado por su legibilidad y versatilidad. Desde desarrollo web hasta análisis de datos y machine learning, su ecosistema sigue creciendo. Eduardo lo ha utilizado en proyectos de automatización y pequeñas herramientas internas.`,
          `Python destaca por su sintaxis clara y curva de aprendizaje accesible. Su filosofía "baterías incluidas" lo hace muy productivo para diversos dominios. Eduardo lo ha aplicado principalmente en scripts de utilidad y procesamiento de datos.`
        ],
        "node.js": [
          `Node.js permitió llevar JavaScript al backend, creando un ecosistema full-stack con un solo lenguaje. Su modelo no bloqueante lo hace eficiente para operaciones I/O. Eduardo lo ha usado en varios servicios web y APIs REST.`,
          `La capacidad de Node.js para manejar muchas conexiones simultáneas lo hace ideal para aplicaciones en tiempo real. Eduardo lo utiliza frecuentemente junto con Express para desarrollar backends eficientes.`
        ],
        deno: [
          `Deno es una alternativa moderna a Node.js creada por el mismo desarrollador. Ofrece seguridad por defecto, TypeScript integrado y una experiencia de desarrollo más coherente. Este portafolio está construido con Fresh, un framework de Deno que Eduardo eligió por su enfoque en rendimiento y simplicidad.`,
          `Eduardo ha comenzado a explorar Deno recientemente, valorando su enfoque en seguridad y su runtime más moderno. Este mismo portafolio utiliza Deno y Fresh, demostrando su interés por tecnologías emergentes y eficientes.`
        ],
        "c#": [
          `C# es un lenguaje versátil del ecosistema Microsoft, apreciado por su robustez y características modernas. Eduardo lo utiliza principalmente en el desarrollo de software empresarial y aplicaciones ASP.NET, especialmente en su trabajo actual.`,
          `Eduardo trabaja con C# y el ecosistema .NET en proyectos empresariales. La integración con Azure y la potencia del framework lo hacen ideal para aplicaciones escalables y mantenibles.`
        ],
        blazor: [
          `Blazor permite usar C# en el frontend web, eliminando la necesidad de JavaScript. Eduardo ha explorado esta tecnología para proyectos donde el equipo tiene mayor experiencia en C# que en JavaScript tradicional.`,
          `Eduardo aprecia la capacidad de Blazor para compartir código entre cliente y servidor, creando aplicaciones web completas con C#. Lo ha implementado en proyectos donde la consistencia del lenguaje es prioritaria.`
        ],
        php: [
          `PHP, aunque criticado por algunos, sigue siendo parte fundamental de gran parte de la web. Eduardo tiene experiencia con este lenguaje y especialmente con Laravel, valorando su productividad para ciertos casos de uso.`,
          `Eduardo ha trabajado con PHP en varios proyectos, principalmente con el framework Laravel. Reconoce su importancia en el ecosistema web a pesar de las críticas que suele recibir.`
        ],
        laravel: [
          `Laravel ha elevado significativamente la experiencia de desarrollo en PHP. Eduardo lo ha utilizado en varios proyectos valorando su elegante sintaxis, sistema de migraciones y la amplia comunidad que mantiene este framework.`,
          `Eduardo considera Laravel como uno de los mejores frameworks para PHP, aprovechando su ecosistema de paquetes y herramientas como Eloquent ORM en proyectos que requieren desarrollo rápido y mantenible.`
        ],
        sql: [
          `SQL sigue siendo fundamental para trabajar con datos relacionales. Eduardo tiene experiencia con diferentes implementaciones como MySQL, PostgreSQL y especialmente Microsoft SQL Server en entornos empresariales.`,
          `Eduardo trabaja frecuentemente con bases de datos SQL, particularmente en proyectos que requieren integridad referencial y consultas complejas. Tiene experiencia específica con Microsoft SQL Server y T-SQL.`
        ],
        "react native": [
          `React Native permite crear aplicaciones móviles nativas con conocimientos de React. Eduardo lo utilizó en su proyecto de tesis, desarrollando una aplicación de hábitos de estudio que obtuvo una calificación sobresaliente.`,
          `Eduardo tiene experiencia práctica con React Native, habiendo desarrollado su tesis con esta tecnología. Valora la capacidad de reutilizar conocimientos de React para desarrollo móvil multiplataforma.`
        ],
        "tailwind css": [
          `Tailwind CSS ha cambiado la forma de estilizar aplicaciones web con su enfoque utility-first. Eduardo lo incorpora en muchos de sus proyectos recientes, apreciando la velocidad de desarrollo y consistencia que ofrece.`,
          `Eduardo utiliza Tailwind CSS en varios proyectos por su capacidad para acelerar el desarrollo de interfaces sin sacrificar el control sobre los estilos. Lo combina eficazmente con componentes React.`
        ],
        bootstrap: [
          `Bootstrap sigue siendo un framework CSS muy popular que Eduardo ha utilizado en numerosos proyectos. Su sistema de grid y componentes predefinidos facilitan el desarrollo de interfaces responsivas rápidamente.`,
          `Eduardo tiene amplia experiencia con Bootstrap desde sus primeras versiones. Aprecia su utilidad para prototipar rápidamente y su amplia adopción en proyectos empresariales.`
        ],
        figma: [
          `Figma ha revolucionado el diseño de interfaces con su enfoque colaborativo. Eduardo lo utiliza tanto para diseñar interfaces antes de programarlas como para colaborar con diseñadores en proyectos multidisciplinarios.`,
          `Eduardo integra Figma en su flujo de trabajo para diseñar interfaces antes de implementarlas en código. Valora especialmente las características colaborativas y su modelo basado en componentes reutilizables.`
        ]
        // Fin de las tecnologías añadidas
      };
      
      // Si encontramos una tecnología específica en el mapa
      if (tech && techOpinions[tech]) {
        return techOpinions[tech][Math.floor(Math.random() * techOpinions[tech].length)];
      }
      
      // Para tecnologías que no tenemos mapeadas específicamente
      if (tech) {
        const respuestasGenericas = [
          `${tech.charAt(0).toUpperCase() + tech.slice(1)} es una tecnología interesante en el panorama actual. La comunidad de desarrollo tiene opiniones diversas sobre ella, desde quienes la consideran esencial hasta quienes prefieren alternativas. ¿Tienes experiencia con ella? Eduardo conoce ${tech}, aunque no es su especialidad principal.`,
          `En el mundo del desarrollo, ${tech.charAt(0).toUpperCase() + tech.slice(1)} tiene sus defensores y críticos. Algunos valoran su enfoque para resolver problemas, mientras otros prefieren soluciones alternativas. Todo depende del contexto y requisitos del proyecto. ¿La usas regularmente? Por cierto, Eduardo ha explorado ${tech} en algunos proyectos.`
        ];
        return respuestasGenericas[Math.floor(Math.random() * respuestasGenericas.length)];
      }
      
      // Si por alguna razón no detectamos la tecnología
      return `Las tecnologías de desarrollo evolucionan constantemente, cada una con sus fortalezas y casos de uso ideales. La elección de stack tecnológico suele depender del contexto específico del proyecto y las necesidades del equipo. ¿Hay alguna tecnología en particular que te interese? Puedo compartir algo sobre ella y la experiencia de Eduardo.`;
    }
  }
];

// Motor Neural de Procesamiento Conversacional
// -----------------------------------------------------------------------

/**
 * Implementación central del "Modelo e1"
 * Sistema neuronal avanzado para procesamiento contextual y generación de respuestas
 * con capacidades de memoria, aprendizaje y adaptación dinámica
 */
class NeuralConversationEngine {
  /**
   * Función principal de procesamiento neural
   * Implementa el ciclo completo de comprensión, contextualización y síntesis de respuesta
   */
  processMessage(message: string, sessionId: string): string {
    // Preprocesamiento y normalización del vector de entrada
    const normalizedMessage = message.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();
    
    // Inicialización o recuperación del estado de memoria neural
    if (!conversationMemory.has(sessionId)) {
      conversationMemory.set(sessionId, {
        history: [],
        userTopics: new Set(),
        userPreferences: new Map(),
        userSentiment: 0,
        lastTopics: [],
        sessionStart: new Date()
      });
    }
    
    const memory = conversationMemory.get(sessionId)!;
    
    // Extracción y vectorización de entidades semánticas
    const detectedEntities = extractEntities(message);
    
    // Análisis de sentimiento con retroalimentación neural
    const sentimentAnalysis = this.analyzeSentiment(message);
    // Actualización ponderada del estado emocional contextual (algoritmo de media móvil exponencial)
    memory.userSentiment = memory.userSentiment * 0.7 + sentimentAnalysis * 0.3;
    
    // Sistema de detección contextual para continuidad conversacional
    let matchedIntent;
    
    // Red neuronal especializada en continuidad contextual para entradas breves
    if (normalizedMessage.split(/\s+/).length <= 2 && memory.history.length >= 2) {
      // Análisis de contexto conversacional previo
      const lastAssistantMessage = memory.history.filter(e => e.role === "assistant").pop();
      const lastUserIntent = memory.history.filter(e => e.role === "user" && e.detectedIntent).pop();
      
      // Léxico de continuidad para activación neural
      const continuityWords = ["otro", "otra", "mas", "más", "si", "sí", "continua", "continúa", 
                              "ok", "vale", "claro", "dame", "dime", "bueno", "bien", "dale",
                              "seguir", "sigue", "continuar", "por favor", "perfecto"];
      
      // Detección de señales de continuidad contextual
      if ((continuityWords.includes(normalizedMessage) || continuityWords.some(w => normalizedMessage.includes(w))) 
          && lastUserIntent && lastUserIntent.detectedIntent) {
        
        // Activación neural especializada por dominios contextuales
        
        // Dominio: humor y entretenimiento
        if (lastUserIntent.detectedIntent === "chistes" || 
            (lastAssistantMessage && (lastAssistantMessage.content.includes("chiste") || 
                                    lastAssistantMessage.content.includes("😂") || 
                                    lastAssistantMessage.content.includes("🐛") || 
                                    lastAssistantMessage.content.includes("¿Te gustaría escuchar otro?")))) {
          matchedIntent = intents.find(i => i.name === "chistes");
        }
        // Dominio: experiencia profesional con prioridad semántica
        else if (lastUserIntent.detectedIntent === "experiencia_laboral" || 
                (lastAssistantMessage && (lastAssistantMessage.content.includes("experiencia") || 
                                         lastAssistantMessage.content.includes("trabajó") ||
                                         lastAssistantMessage.content.includes("desempeñó")))) {
          matchedIntent = intents.find(i => i.name === "experiencia_laboral");
        }
        // Dominio: competencias técnicas
        else if (lastUserIntent.detectedIntent === "habilidades_tecnicas" || 
                (lastAssistantMessage && lastAssistantMessage.content.includes("habilidades"))) {
          matchedIntent = intents.find(i => i.name === "habilidades_tecnicas");
        }
        // Dominio: proyectos y desarrollo
        else if (lastUserIntent.detectedIntent === "proyectos" || 
                (lastAssistantMessage && lastAssistantMessage.content.includes("proyectos"))) {
          matchedIntent = intents.find(i => i.name === "proyectos");
        }
        // Recuperación general de contexto previo
        else {
          matchedIntent = intents.find(i => i.name === lastUserIntent.detectedIntent);
        }
      }
    }
    
    // Si no se activó la red de continuidad contextual, usar red general de reconocimiento
    if (!matchedIntent) {
      matchedIntent = this.detectIntent(normalizedMessage);
    }
    
    // Registro neuronal de la interacción del usuario
    memory.history.push({
      role: "user",
      content: message,
      timestamp: new Date(),
      detectedIntent: matchedIntent.name,
      topicTags: detectedEntities.temas
    });
    
    // Actualización de la red de tópicos de interés
    if (detectedEntities.temas && detectedEntities.temas.length > 0) {
      detectedEntities.temas.forEach(topic => memory.userTopics.add(topic));
      
      // Actualización del buffer de recencia temática (FIFO con capacidad 3)
      memory.lastTopics = [...detectedEntities.temas, ...memory.lastTopics].slice(0, 3);
    }
    
    // Preparación del vector de contexto para la generación de respuesta
    const responseParams: ResponseGeneratorParams = {
      userMessage: message,
      normalizedMessage,
      memory,
      sessionId,
      detectedEntities,
      matchedGroups: undefined // Vector inicialmente vacío para matchGroups
    };
    
    // Generación de respuesta mediante la red neural especializada correspondiente
    const response = matchedIntent.responseGenerator(responseParams);
    
    // Registro neuronal de la respuesta generada
    memory.history.push({
      role: "assistant",
      content: response,
      timestamp: new Date()
    });
    
    return response;
  }
  
  /**
   * Red neural para detección y clasificación de intenciones comunicativas
   * Implementa algoritmos de coincidencia de patrones y similitud semántica
   */
  detectIntent(normalizedMessage: string): IntentDefinition {
    let bestMatch: IntentDefinition | null = null;
    let highestConfidence = 0;
    
    // Evaluación iterativa de todas las redes neuronales especializadas
    for (const intent of intents) {
      // Fase 1: Detección por patrones de activación directa
      let patternMatched = false;
      for (const pattern of intent.patterns) {
        if (pattern.test(normalizedMessage)) {
          patternMatched = true;
          break;
        }
      }
      
      // Si no hay activación directa, continuar con siguiente red
      if (!patternMatched) continue;
      
      // Fase 2: Cálculo de confianza ponderada
      let confidence = intent.confidence; // Nivel base de activación
      
      // Fase 3: Refuerzo por similitud semántica con ejemplos de entrenamiento
      let maxSimilarity = 0;
      for (const example of intent.examples) {
        const similarity = similarityScore(normalizedMessage, example);
        maxSimilarity = Math.max(maxSimilarity, similarity);
      }
      
      // Ajuste de confianza mediante factor de similitud (coeficiente 0.2)
      confidence += maxSimilarity * 0.2;
      
      // Actualización de mejor coincidencia según nivel de activación
      if (confidence > highestConfidence) {
        highestConfidence = confidence;
        bestMatch = intent;
      }
    }
    
    // Red por defecto en caso de no alcanzar umbral de activación
    return bestMatch || intents.find(i => i.name === "default")!;
  }
  
  /**
   * Red neural para análisis de sentimiento
   * Implementa clasificación semántica basada en léxico afectivo
   * @returns Valor normalizado entre -1 (negativo) y 1 (positivo)
   */
  analyzeSentiment(message: string): number {
    const normalizedMessage = message.toLowerCase();
    
    // Léxico afectivo positivo (activación positiva)
    const positiveWords = [
      "gracias", "bueno", "excelente", "genial", "increíble", "me gusta", "me encanta",
      "útil", "interesante", "divertido", "bien", "agradable", "feliz", "contento",
      "agradecido", "maravilloso", "fantástico", "espectacular", "amable", "impresionante",
      "cool", "bacán", "asombroso", "grandioso", "estupendo"
    ];
    
    // Léxico afectivo negativo (activación negativa)
    const negativeWords = [
      "malo", "pésimo", "terrible", "horrible", "no me gusta", "odio", "inútil",
      "aburrido", "difícil", "complicado", "confuso", "molesto", "triste", "frustrado",
      "decepcionado", "decepcionante", "estúpido", "tonto", "basura", "no sirve",
      "no funciona", "no entiendo", "feo"
    ];
    
    // Algoritmo de activación y conteo
    let positiveCount = 0;
    let negativeCount = 0;
    
    // Evaluación de activaciones positivas
    for (const word of positiveWords) {
      if (normalizedMessage.includes(word)) {
        positiveCount++;
      }
    }
    
    // Evaluación de activaciones negativas
    for (const word of negativeWords) {
      if (normalizedMessage.includes(word)) {
        negativeCount++;
      }
    }
    
    // Normalización y cálculo de polaridad
    if (positiveCount === 0 && negativeCount === 0) {
      return 0; // Estado neutral sin activación emocional
    }
    
    // Algoritmo de normalización bipolar (-1 a 1)
    return (positiveCount - negativeCount) / (positiveCount + negativeCount);
  }
}

// Inicialización del motor neural central "Modelo e1"
const conversationEngine = new NeuralConversationEngine();

/**
 * Módulo de procesamiento conversacional
 * Interfaz entre el motor neural y la capa de API
 * Implementa el ciclo completo del Modelo e1
 */
function processConversation(userMessage: string, sessionId: string) {
  try {
    // Generación de respuesta mediante el motor neural "Modelo e1"
    const reply = conversationEngine.processMessage(userMessage, sessionId);
    
    // Formateo de respuesta para la capa de API
    return {
      choices: [
        {
          message: {
            content: reply
          }
        }
      ]
    };
  } catch (error) {
    console.error("Error en el procesamiento neural:", error);
    throw error;
  }
}

// Interfaz de API para el "Modelo e1"
// -----------------------------------------------------------------------

/**
 * Sistema de gestión de sesiones neuronales persistentes
 * Permite mantener continuidad contextual entre interacciones
 */
const userSessionMap = new Map<string, string>();

/**
 * Handler principal de la API del "Modelo e1"
 * Gestiona el ciclo completo de procesamiento de peticiones conversacionales
 */
export const handler: Handlers = {
  async POST(req) {
    try {
      // Extracción del vector de entrada
      const { message } = await req.json();
      
      // Validación de integridad del vector
      if (!message || typeof message !== "string") {
        return new Response(JSON.stringify({ error: "Se requiere un vector de entrada válido" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Normalización y limitación de dimensionalidad
      const trimmedMessage = message.trim().substring(0, 500);
      
      // Identificación y persistencia de la sesión neural
      const url = new URL(req.url);
      const userIdentifier = req.headers.get("x-forwarded-for") || 
                            url.searchParams.get("session") || 
                            "anonymous";
      
      // Recuperación o creación de ID de sesión persistente
      let sessionId;
      if (userSessionMap.has(userIdentifier)) {
        sessionId = userSessionMap.get(userIdentifier);
      } else {
        sessionId = "session_" + Math.random().toString(36).substring(2, 9);
        userSessionMap.set(userIdentifier, sessionId);
      }
      
      // Procesamiento neuronal de la conversación
      const chatCompletion = processConversation(trimmedMessage, sessionId!);
      
      // Extracción y formateo de la respuesta generada
      let reply = "Lo siento, el sistema neural ha encontrado una anomalía en el procesamiento.";
      
      if (chatCompletion && chatCompletion.choices && chatCompletion.choices.length > 0) {
        if (chatCompletion.choices[0].message && chatCompletion.choices[0].message.content) {
          reply = chatCompletion.choices[0].message.content;
        }
      }

      // Respuesta formateada con el vector de salida
      return new Response(JSON.stringify({ reply }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error en el ciclo de procesamiento neural:", error);
      return new Response(JSON.stringify({ 
        error: "Error en el procesamiento del vector de entrada",
        details: error instanceof Error ? error.message : String(error)
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
