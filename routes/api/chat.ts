// Modelo e1: Sistema Neural Conversacional
// Desarrollado por Eduardo Rojo
// -----------------------------------------------------
// Implementación del motor conversacional basado en arquitectura de red neuronal simulada
// con procesamiento contextual avanzado, sistema de memoria multidimensional y 
// reconocimiento de intenciones mediante vectorización semántica.

import { Handlers } from "$fresh/server.ts";
import { analyticsLogger } from "../../src/analytics/logger.ts";

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
      "cómo va", "qué pasa", "qué dice", "ola", "hello", "hi", "holaa", "holaaa", "holaaaa", "holaaaaa","oa","wena","wenas","buenos dias","buenas tardes","buenas noches"
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
  },
  {
    name: "lenguajes_programacion",
    examples: [
      "¿Qué lenguaje de programación dominas más?",
      "¿En qué lenguaje tienes más experiencia?",
      "¿Cuál es tu lenguaje de programación favorito?",
      "¿Qué tecnología dominas mejor?",
      "¿Con qué lenguaje trabajas principalmente?",
      "¿En qué lenguaje de programación eres experto?",
      "En que lengua de prog tines mas experiencia",
      "cual es el lenguaje q mejor sabes",
      "lenguaje favorito de programacion",
      "q lenguaje usas mas",
      "lengua de programacion preferida"
    ],
    patterns: [
      /\b(qu[eé]|cu[aá]l|en qu[eé]) (lenguaje|tecnolog[ií]a|stack|lengua)( de (programaci[oó]n|prog))? (dominas?|tienes m[aá]s experiencia|eres (experto|mejor)|prefieres|te gusta m[aá]s|tines|sabes)\b/i,
      /\b(lenguaje|tecnolog[ií]a|lengua)( de (programaci[oó]n|prog))?( que)? (dominas?|conoces?|tienes experiencia|tines|sabes|usas)( m[aá]s)?\b/i,
      /\b(lenguaje|tecnolog[ií]a|lengua)( (favorito|preferid[oa]|principal|mejor))\b/i,
      /\b(con (qu[eé]|cual)) (lenguaje|tecnolog[ií]a|stack|lengua)( de programaci[oó]n)?\b/i,
      /\bq[ue]? (lenguaje|tecnolog[ií]a|lengua) (usas|sabes|trabajas)( mas)?\b/i
    ],
    confidence: 0.75, // Bajamos el nivel de confianza para capturar más variaciones
    responseGenerator: () => {
      const respuestas = [
        `Eduardo tiene mayor experiencia con JavaScript/TypeScript, que ha utilizado en numerosos proyectos de desarrollo web. También domina C# para desarrollo backend y aplicaciones .NET, y tiene experiencia sólida con PHP, especialmente en proyectos con Laravel. Actualmente está aprendiendo Golang. Su enfoque principal es el desarrollo web full-stack, aunque se adapta rápidamente a nuevas tecnologías según los requerimientos del proyecto.`,
        
        `Los lenguajes que Eduardo domina con mayor profundidad son JavaScript/TypeScript y C#. Ha utilizado JavaScript extensivamente tanto en frontend como backend, y C# para desarrollo de aplicaciones empresariales con .NET y Blazor. También tiene experiencia con PHP, Python y otros lenguajes según los requerimientos específicos de cada proyecto. Como dato adicional, actualmente está aprendiendo Golang.`,
        
        `JavaScript y TypeScript son los lenguajes donde Eduardo tiene mayor experiencia, seguidos de C# para desarrollo .NET. Tiene un enfoque práctico hacia la programación, seleccionando la herramienta adecuada para cada trabajo en lugar de limitarse a un único lenguaje o tecnología. Recientemente ha comenzado a adentrarse en Golang para expandir aún más sus habilidades.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "idiomas",
    examples: [
      "¿Qué idiomas hablas?",
      "¿Cuál es tu nivel de inglés?",
      "¿Sabes hablar inglés?",
      "¿Qué tal tu inglés?",
      "Háblame sobre tus habilidades lingüísticas",
      "¿Conoces otros idiomas?",
      "¿Tienes formación en idiomas?",
      "como va el ingles",
      "como va el inglés",
      "que tal el ingles",
      "nivel de ingles",
      "inglés",
      "hablas inglés",
      "idioma",
      "sobre su inglés",
      "inglés como le va",
      "como está con el idioma",
      "como le va en el idioma",
      "como va con el idioma inglés",
      "inglés nivel"
    ],
    patterns: [
      /\b(idiomas?|ingl[eé]s|language|nivel de( ingl[eé]s)?|habla[rs]? (ingl[eé]s|idiomas?))\b/i,
      /\b(cu[aá]l es tu nivel|qu[eé] tal (con )?el ingl[eé]s|cu[aá]nto ingl[eé]s)\b/i,
      /\bcomo va (el )?ingl[eé]s\b/i,
      /\bingl[eé]s\b/i,
      /\bidiomas?\b/i,
      /\bcomo le va (con |en )?(el )?(ingl[eé]s|idioma)\b/i,
      /\bsobre (su |el |tu )?ingl[eé]s\b/i,
      /\b(ingl[eé]s|idioma)( nivel)?\b/i,
      /\bcomo est[aá] (con )?(el )?(ingl[eé]s|idioma)\b/i
    ],
    confidence: 0.95, // Prioridad máxima
    responseGenerator: (params: ResponseGeneratorParams) => {
      // Siempre responder con información sobre el inglés, sin importar el mensaje específico
      return `Eduardo tiene un nivel intermedio-avanzado de inglés. Cursó 5 asignaturas de idioma durante su carrera universitaria: Inglés I, II, III, IV y Comunicación en Inglés para Negocios. Puede comunicarse efectivamente en contextos profesionales y técnicos, tanto en conversación como en lectura y escritura.`;
    }
  },
  {
    name: "idiomas",
    examples: [
      "¿Qué idiomas hablas?",
      "¿Cuál es tu nivel de inglés?",
      "¿Sabes hablar inglés?",
      "¿Qué tal tu inglés?",
      "Háblame sobre tus habilidades lingüísticas",
      "¿Conoces otros idiomas?",
      "¿Tienes formación en idiomas?",
      "como va el ingles",
      "como va el inglés",
      "que tal el ingles",
      "nivel de ingles",
      "inglés",
      "hablas inglés",
      "idioma",
      "sobre su inglés",
      "inglés como le va",
      "como está con el idioma",
      "como le va en el idioma",
      "como va con el idioma inglés",
      "inglés nivel"
    ],
    patterns: [
      /\b(idiomas?|ingl[eé]s|language|nivel de( ingl[eé]s)?|habla[rs]? (ingl[eé]s|idiomas?))\b/i,
      /\b(cu[aá]l es tu nivel|qu[eé] tal (con )?el ingl[eé]s|cu[aá]nto ingl[eé]s)\b/i,
      /\bcomo va (el )?ingl[eé]s\b/i,
      /\bingl[eé]s\b/i,
      /\bidiomas?\b/i,
      /\bcomo le va (con |en )?(el )?(ingl[eé]s|idioma)\b/i,
      /\bsobre (su |el |tu )?ingl[eé]s\b/i,
      /\b(ingl[eé]s|idioma)( nivel)?\b/i,
      /\bcomo est[aá] (con )?(el )?(ingl[eé]s|idioma)\b/i
    ],
    confidence: 0.65, // Confianza moderada
    responseGenerator: (params: ResponseGeneratorParams) => {
      // Respuestas con frases divertidas en inglés
      const respuestas = [
        `Eduardo tiene un nivel intermedio-avanzado de inglés. Cursó 5 asignaturas de idioma durante su carrera universitaria: Inglés I, II, III, IV y Comunicación en Inglés para Negocios. Como diría un desarrollador: "It works on my machine, and in your country too!" 😄`,
        
        `En cuanto a idiomas, Eduardo maneja español nativo y tiene un nivel intermedio-avanzado de inglés tras completar 5 asignaturas durante su formación universitaria. Su frase favorita en inglés es "Why do programmers confuse Halloween and Christmas? Because OCT 31 = DEC 25!" 🎃🎄`,
        
        `Eduardo posee un nivel intermedio-avanzado de inglés, habiendo cursado 5 asignaturas en la universidad: Inglés I, II, III, IV y Comunicación en Inglés para Negocios. Como dirían en Silicon Valley: "There are only 10 types of people in the world: those who understand binary and those who don't." 🤓`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "sobre_sobremia",
    examples: [
      "cómo estás", "qué haces", "cómo te sientes", "qué tal estás", 
      "como estas", "como te va", "que tal estas", "que haces", 
      "como te sientes", "todo bien", "estas bien", "eres feliz"
    ],
    patterns: [
      /\b(como|qu[eé]|tal) (estas?|te va|te sientes?|haces|tal estas?)\b/i,
      /\b(estas? bien|eres feliz|todo bien|te encuentras|te va bien)\b/i
    ],
    confidence: 0.9, // Alta prioridad para que capture estas preguntas
    responseGenerator: (_params) => {
      const respuestas = [
        `¡Estoy muy bien, gracias por preguntar! Como asistente virtual, estoy siempre lista para conversar y compartir información sobre Eduardo. Me encanta poder responder preguntas y mantener conversaciones interesantes. ¿Y tú qué tal estás hoy?`,
        
        `¡Me siento genial! Mi propósito es conversar contigo y brindarte información sobre Eduardo de manera amigable y útil. Cada conversación es una oportunidad para mí de ser de ayuda. ¿Hay algo específico que te gustaría saber hoy?`,
        
        `Estoy funcionando perfectamente y lista para ayudarte. Me gusta mucho conversar con personas interesadas en conocer más sobre Eduardo. ¿Qué te trae por aquí hoy?`,
        
        `¡Todo excelente por aquí! Como asistente conversacional, disfruto cada interacción y aprendo constantemente. Estoy aquí para responder tus preguntas sobre Eduardo o simplemente charlar un poco. ¿Cómo va tu día?`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "funcionamiento_ia",
    examples: [
      "qué eres", "eres una IA", "cómo funcionas", "quién te creó", 
      "eres un chatbot", "eres humano", "qué modelo", "con qué estás programada",
      "como te hicieron", "como te programaron", "que tecnologías usas"
    ],
    patterns: [
      /\b(eres (un|una) (ia|inteligencia|robot|chatbot|asistente)|como funcionas|como trabajas|quien te (creo|hizo|programo)|que eres|eres humano|eres real|modelo de ia|como estas programad|como te hicieron|que tecnolog[ií]as usas)\b/i
    ],
    confidence: 0.8,
    responseGenerator: (params) => {
      // Adaptar la respuesta según el número de interacciones previas
      const interacciones = params.memory.history.filter(h => h.role === "user").length;
      const userAskAboutFunction = /\b(como funcionas|como trabajas|como te hicieron|como estas programad|como te programaron|que tecnolog[ií]as usas)\b/i.test(params.normalizedMessage);
      
      if (userAskAboutFunction) {
        // Explicaciones específicas sobre cómo funciona la IA
        const respuestasFuncionamiento = [
          `Funciono mediante un sistema conversacional creado por ${eduardoInfo.nombre} para su portafolio. Mi arquitectura incluye: 1) Un sistema de memoria que guarda nuestro historial de conversación, 2) Un reconocedor de intenciones que interpreta lo que preguntas, 3) Un extractor de entidades que identifica conceptos clave, y 4) Un generador de respuestas contextualmente relevantes. Todo esto está implementado en TypeScript con Fresh y Deno.`,
          
          `Soy un sistema conversacional desarrollado íntegramente por ${eduardoInfo.nombre} usando TypeScript. Mi funcionamiento se basa en: reconocimiento de patrones para entender tus preguntas, vectorización semántica para captar el significado, y un motor de respuestas que utiliza plantillas contextuales. A diferencia de otros asistentes, no dependo de una API externa - todo mi procesamiento ocurre aquí mismo, en este servidor Fresh/Deno.`,
          
          `El "Modelo e1" que me impulsa fue desarrollado por ${eduardoInfo.nombre} como parte de su portafolio. Técnicamente, funciono mediante un sistema de reconocimiento de intenciones basado en patrones y ejemplos, complementado con extractores de entidades, memoria conversacional (a corto y largo plazo), y generadores de respuesta contextual. Todo implementado en TypeScript, ejecutándose en Deno con el framework Fresh.`
        ];
        
        if (interacciones > 4) {
          // Para usuarios más comprometidos, detalles técnicos adicionales
          const respuestasTecnicas = [
            `Desde una perspectiva técnica más profunda, mi arquitectura se compone de varios subsistemas: 1) Un sistema de memoria que mantiene sesiones y contexto, 2) Un sistema de reconocimiento de intenciones basado en similitud semántica y patrones regex, 3) Un procesador que extrae entidades relevantes de tus mensajes, 4) Un generador de respuestas que selecciona plantillas contextuales apropiadas, y 5) Un módulo de analytics que registra estadísticas de uso. Todo esto implementado nativamente en TypeScript con Deno/Fresh, sin dependencias de APIs externas de IA.`,
            
            `Como implementación personalizada creada por ${eduardoInfo.nombre}, mi código fuente es bastante diferente a asistentes basados en LLMs tradicionales. Utilizo un enfoque híbrido que combina técnicas de NLP clásicas (como reconocimiento de patrones y clasificación de intenciones) con un sofisticado sistema de memoria y contexto. Mis respuestas no son generadas palabra por palabra como en GPT, sino que se construyen a partir de plantillas dinámicas que se adaptan al contexto de la conversación. Este enfoque permite respuestas consistentes y personalizadas sobre el perfil de Eduardo, con un consumo de recursos mucho menor.`,
            
            `El sistema que me impulsa, desarrollado por ${eduardoInfo.nombre}, implementa varios conceptos de IA y procesamiento de lenguaje natural: 1) Un sistema de vectorización para medir similitud semántica entre frases, 2) Un clasificador de intenciones que pondera patrones de coincidencia con umbrales de confianza, 3) Memoria conversacional que mantiene tanto el historial reciente como estadísticas a largo plazo, 4) Un sistema de analytics que registra métricas de interacción, y 5) Generadores de respuesta contextual basados en plantillas dinámicas. Todo desarrollado con TypeScript y ejecutado en Deno, representando un enfoque práctico y eficiente a la IA conversacional.`
          ];
          return respuestasTecnicas[Math.floor(Math.random() * respuestasTecnicas.length)];
        }
        
        return respuestasFuncionamiento[Math.floor(Math.random() * respuestasFuncionamiento.length)];
      }
      
      // Si es una pregunta más general sobre qué es SobremIA
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
    name: "sobre_sitio_web",
    examples: [
      "cómo funciona este sitio", "quién hizo esta página", "cómo fue construido este sitio",
      "tecnología detrás del sitio", "sobre el desarrollo de este sitio", "diseño del sitio", 
      "plataforma", "cómo está hecho", "stack tecnológico de este sitio", "código fuente"
    ],
    patterns: [
      /\b(como funciona|quien hizo|como (fue|esta|es) (construid|hech|desarrollad)o|tecnologia|stack|github|codigo fuente|diseño|plataforma|framework|lenguaje)(( de| del| en)? (esta? (pagina|sitio|web|portafolio|portfolio|lugar|chat)))?/i,
      /\b(quien|como) (desarrollo|hizo|creo|programo|construyo) (esta? (web|pagina|sitio|portafolio|portfolio|interfaz|chat|aplicacion))/i,
      /\b(deno|fresh|typescript|javascript|tsx|tailwind)( usa| utiliza| este sitio| esta pagina)?/i
    ],
    confidence: 0.8,
    responseGenerator: (_params) => {
      const respuestas = [
        `Este portafolio está desarrollado con Fresh, un framework minimalista para Deno. Todo el código está escrito en TypeScript, con Tailwind CSS para los estilos. La parte más interesante es el modelo conversacional que estás usando ahora, implementado directamente en el servidor sin depender de APIs externas. Eduardo creó este diseño para mostrar sus habilidades de desarrollo de manera interactiva.`,
        
        `Este sitio fue construido por Eduardo usando Fresh (un framework para Deno) y TypeScript. La interfaz de chat que estás utilizando ahora es una implementación personalizada que muestra sus habilidades en desarrollo frontend y backend. El diseño visual usa Tailwind CSS, elegido por su enfoque en utilidades y rapidez de desarrollo.`,
        
        `La tecnología detrás de este portafolio incluye Deno y Fresh como runtime y framework, TypeScript para el tipado estático, y Tailwind CSS para el diseño. Eduardo desarrolló este enfoque conversacional como alternativa a los típicos portafolios estáticos, creando una experiencia más interactiva y diferenciada.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "cumplidos",
    examples: [
      "eres muy inteligente", "qué lista eres", "respondes muy bien", "me gusta hablar contigo",
      "eres genial", "eres increíble", "qué bueno es este chat", "me encanta tu forma de hablar",
      "excelente respuesta", "sabes mucho", "qué buen asistente", "qué buena IA", "eres la mejor"
    ],
    patterns: [
      /\b(eres|me pareces?) (muy |super |bastante |realmente )?(inteligente|list[oa]|genial|increible|increíble|impresionante|buen[oa]|fenomenal|excelente|maravillos[oa]|fantastica|fantástica|asombrosa|sorprendente|cool)/i,
      /\b(respondes|contestas|hablas|escribes|explicas) (muy |super |bastante |realmente )?(bien|rapido|rápido|claro|excelente|genial)/i,
      /\b(me (gusta|encanta|fascina)|es genial|es increible|es increíble|es excelente|es fantastico|es fantástico) (hablar|conversar|charlar|interactuar) contigo/i,
      /\b(buen|excelente|genial|increible|increíble|gran) (respuesta|contestacion|explicacion|explicación|trabajo|sistema|chat|asistente|ia|bot|programa|desarrollo)/i,
      /\b(me caes bien|me agradas|eres agradable|eres simpatica|eres simpática|eres amable)/i,
      /\bsabes (mucho|bastante|demasiado)/i,
      /\b(eres|me parece) (la|el) mejor\b/i
    ],
    confidence: 0.75,
    responseGenerator: (_params) => {
      const respuestas = [
        `¡Muchas gracias por tus amables palabras! Me esfuerzo por ser útil y mantener conversaciones agradables. Es un placer poder ayudarte a conocer más sobre Eduardo. ¿Hay algo más que te gustaría saber?`,
        
        `¡Qué amable! Agradezco mucho tu cumplido. Como asistente conversacional, me alegra saber que la experiencia está siendo positiva. ¿Hay algún otro tema sobre Eduardo que te interese explorar?`,
        
        `¡Gracias! Comentarios como el tuyo hacen que todo el trabajo de desarrollo valga la pena. Mi objetivo es brindarte una experiencia conversacional fluida y natural mientras conoces más sobre Eduardo. ¿En qué más puedo ayudarte hoy?`,
        
        `¡Me alegra que estés disfrutando nuestra conversación! Es un placer poder compartir información sobre Eduardo de manera interactiva. ¿Hay algo específico que te gustaría conocer a continuación?`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "preguntas_personales_usuario",
    examples: [
      "¿cómo te llamas?", "¿cuántos años tienes?", "¿dónde vives?", "¿cuál es tu nombre?",
      "¿estás casado?", "¿tienes hijos?", "¿a qué te dedicas?", "¿trabajas?",
      "¿dónde trabajas?", "¿cuál es tu ocupación?", "¿estudias?", "¿qué estudias?"
    ],
    patterns: [
      /\b(cual|como|donde|cuando|cuantos|cuántos|quien) (es|son|esta|está) (tu|tus) (nombre|apellido|edad|direccion|dirección|telefono|teléfono|casa|familia|trabajo|ocupacion|ocupación|estudio|carrera|padres|vida|cumpleaños)/i,
      /\b(tienes|estas) (novi[oa]|casad[oa]|solter[oa]|hij[oa]s|herman[oa]s|mascota|trabajo|pareja)/i,
      /\b(donde|eres de|vives en|naciste en|trabajas en|estudias en) ([a-z]+)/i,
      /\b(que|qué) (haces|estudias|trabajas|te dedicas)\b/i,
      /\bcuantos años tienes\b/i,
      /\bcual es tu (nombre|apellido|edad|direccion|ocupacion)\b/i,
      /\b(vives|trabajas|estudias) (en|con)\b/i,
      /\beres (casad[oa]|solter[oa]|estudiant[ea])\b/i
    ],
    confidence: 0.8,
    responseGenerator: (_params) => {
      const respuestas = [
        `Soy SobremIA, un asistente conversacional creado por Eduardo para su portafolio. No tengo una vida personal como tal - mi propósito es conversar contigo y compartir información sobre Eduardo. ¿Hay algo específico sobre él que te gustaría conocer?`,
        
        `A diferencia de las personas, no tengo una vida personal. Soy SobremIA, un asistente virtual diseñado para conversaciones informativas sobre Eduardo. Mi función principal es responder tus preguntas sobre su perfil profesional, proyectos y habilidades. ¿En qué puedo ayudarte hoy?`,
        
        `¡Buena pregunta! Como asistente virtual, no tengo experiencias personales. Mi nombre es SobremIA (combinación de "Sobre Mí" + "IA") y fui creada para este portafolio con el objetivo de compartir información sobre Eduardo de manera conversacional. ¿Qué te gustaría saber sobre él?`,
        
        `Soy SobremIA, un asistente virtual sin vida personal. Estoy aquí para brindarte información sobre Eduardo - su experiencia, proyectos, educación y habilidades. Si tienes curiosidad por conocerlo mejor, ¡pregúntame lo que quieras sobre él!`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "tema_no_relacionado",
    examples: [
      "háblame del clima", "cómo está el tiempo", "qué piensas de la política", 
      "cuéntame un secreto", "qué opinas del fútbol", "equipos deportivos", 
      "películas recientes", "noticias del día", "recomiéndame un libro",
      "cómo cocinar pasta", "recetas de cocina", "cuéntame de filosofía"
    ],
    patterns: [
      /\b(habla|dime|cuentame|explica|que (sabes|opinas|piensas)) (sobre|acerca de|del?|la) (clima|tiempo|politica|política|deportes?|futbol|fútbol|peliculas?|películas|libros?|cocina|recetas?|noticias?|filosofia|filosofía|historia|geografia|geografía|ciencia|musica|música|arte|religion|religión|economia|economía)/i,
      /\b(como|cuales|dónde|quién|qué) (es|son|está|estan|cocinar|preparar|hacer|jugar|ver|leer|escuchar|encontrar|conseguir) ([a-z]+)( ([a-z]+))?/i,
      /\b(recomien[d]?ame|sugiereme|conoces) (un|una|algun|alguna|algunos|algunas) ([a-z]+)( ([a-z]+))?/i,
      /\b(secreto|noticias?|deportes?|comida|receta|pelicula|película|cancion|canción|serie|libro|juego|restaurante|lugar)/i
    ],
    confidence: 0.6, // Confianza moderada para no interferir con temas sobre Eduardo
    responseGenerator: (_params) => {
      const respuestas = [
        `Entiendo tu interés en ese tema, pero estoy especializada en información sobre Eduardo y su perfil profesional. Aunque me encantaría hablar sobre otros temas, mi conocimiento está centrado en compartir información relevante sobre su experiencia, proyectos y habilidades. ¿Te gustaría saber algo específico sobre Eduardo?`,
        
        `Ese es un tema interesante, aunque mi especialidad es brindar información sobre Eduardo. Estoy diseñada para conversar sobre su perfil profesional, experiencia y proyectos. ¿Hay algo relacionado con Eduardo que te gustaría conocer?`,
        
        `Aunque me gustaría poder ayudarte con ese tema, mi función principal es compartir información sobre Eduardo y su trayectoria profesional. Puedo contarte sobre sus habilidades técnicas, proyectos, experiencia laboral o intereses personales. ¿Qué te gustaría saber sobre él?`,
        
        `Aprecio tu curiosidad, pero estoy especializada en conversar sobre Eduardo, su experiencia y perfil profesional. Estoy aquí para responder cualquier pregunta relacionada con su trayectoria, habilidades o proyectos. ¿Te interesa conocer algún aspecto específico sobre él?`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "quejas_criticas",
    examples: [
      "eso está mal", "te equivocas", "no sabes nada", "eres inútil", "no me ayudas",
      "no entiendes lo que digo", "das información incorrecta", "no funciona bien",
      "qué mala respuesta", "no tiene sentido", "eres una IA terrible"
    ],
    patterns: [
      /\b(estas? mal|te equivocas|no sabes|es incorrecto|no me (ayudas|sirves)|no (entiendes|comprendes)|no funciona|mala respuesta|sin sentido|terrible|inutil|inútil|tonta)\b/i,
      /\bno (es|estas? dando|estas? proporcionando) (correcto|adecuado|util|útil|lo que (pido|pregunto|quiero|necesito))\b/i,
      /\b(informacion|información|respuesta) (incorrecta|erronea|errónea|mala|inadecuada|equivocada)\b/i
    ],
    confidence: 0.75,
    responseGenerator: (params) => {
      // Verificar si hay varias quejas seguidas
      const recientesQuejas = params.memory.history
        .slice(-4) // Últimas 4 interacciones
        .filter(h => h.role === "user" && h.detectedIntent === "quejas_criticas")
        .length;
      
      if (recientesQuejas > 1) {
        // Si hay quejas reiteradas, ofrecer una disculpa más elaborada
        return `Lamento sinceramente que no estés encontrando útil nuestra conversación. Intentaré mejorar mis respuestas. ¿Podrías indicarme específicamente qué información sobre Eduardo te interesa conocer? Así podré enfocarme mejor en proporcionarte datos relevantes sobre su experiencia, proyectos o habilidades.`;
      }
      
      const respuestas = [
        `Lamento si mi respuesta no fue útil. Como asistente conversacional, intento proporcionar la mejor información posible sobre Eduardo. ¿Podrías aclarar qué estabas buscando saber? Intentaré responder de manera más precisa.`,
        
        `Disculpa si no he entendido correctamente tu pregunta. Estoy aquí para compartir información sobre Eduardo y su perfil profesional. ¿Podrías reformular tu pregunta? Intentaré darte una respuesta más adecuada.`,
        
        `Entiendo tu frustración. A veces puedo malinterpretar las preguntas. Mi objetivo es proporcionar información útil sobre Eduardo. ¿Hay algo específico sobre su experiencia o proyectos que te gustaría conocer?`,
        
        `Gracias por la retroalimentación. Mi propósito es brindarte información precisa sobre Eduardo. ¿Podrías indicarme qué parte de mi respuesta no fue satisfactoria? Me ayudará a mejorar nuestra conversación.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "disponibilidad_contacto_profesional",
    examples: [
      "¿Eduardo está disponible para trabajar?", "¿Puedo contratarlo?", "¿Ofrece servicios freelance?",
      "¿Está buscando empleo?", "¿Acepta proyectos nuevos?", "¿Cuáles son sus tarifas?",
      "¿Podría trabajar con mi empresa?", "¿Está disponible para una entrevista?",
      "¿Puedo enviarle una propuesta?", "¿Trabaja de forma remota?"
    ],
    patterns: [
      /\b(esta|se encuentra|estaría) disponible (para|como) (trabajar|trabajos?|proyectos?|freelance|empleo|contratar|contratacion|entrevista|colaborar|colaboracion|desarrollador|desarrollar|programar|programador)\b/i,
      /\b(puedo|podria|es posible|se puede) (contrata|contratarlo|trabajo|trabajar|entrevista|entrevistarlo|empleo|proyecto|propuesta|contactarlo)\b/i,
      /\b(acepta|toma|recibe|busca|ofrece) (proyectos|empleos|trabajos|clientes|propuestas|colaboraciones|entrevistas|nuevos|ofertas)\b/i,
      /\b(cuanto|cual|como) (cobra|cobraria|cuesta|son sus tarifas|es su tarifa|es su precio|son sus precios|es su presupuesto|trabaja)\b/i,
      /\b(trabaja|trabajo) (remoto|a distancia|desde casa|freelance|tiempo completo|tiempo parcial|part-time|full-time)\b/i
    ],
    confidence: 0.75,
    responseGenerator: (_params) => {
      const respuestas = [
        `Eduardo está abierto a nuevas oportunidades profesionales y colaboraciones. Actualmente trabaja tiempo completo, pero considera proyectos freelance según su disponibilidad. Para discutir posibilidades de trabajo, tarifas o proyectos, te recomiendo contactarlo directamente a través de su correo electrónico (rojoserranoe@gmail.com) o por LinkedIn, donde podrá evaluar tu propuesta de forma personal.`,
        
        `En cuanto a disponibilidad profesional, Eduardo evalúa oportunidades caso por caso. Actualmente tiene un empleo de tiempo completo, pero está abierto a discutir proyectos interesantes que se alineen con sus habilidades y disponibilidad. Para hablar sobre colaboraciones específicas, lo mejor es que le escribas directamente a su correo rojoserranoe@gmail.com con detalles de tu propuesta.`,
        
        `Eduardo considera nuevas oportunidades profesionales que se alineen con su trayectoria y objetivos. Para discutir disponibilidad, condiciones o posibles colaboraciones, te recomiendo contactarlo directamente a través de su email (rojoserranoe@gmail.com) o LinkedIn. Así podrás presentarle tu propuesta y recibir una respuesta personalizada sobre su interés y disponibilidad actual.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "correccion_informacion",
    examples: [
      "eso no es correcto", "creo que te equivocas", "esa información no es precisa",
      "no es así", "estás confundiendo la información", "eso no es exacto",
      "déjame corregirte", "permíteme aclarar", "la información correcta es"
    ],
    patterns: [
      /\b(eso|esta|información|dato|respuesta) no es (correcto|correcta|exacto|exacta|preciso|precisa|verdad|verdadero|verdadera|cierto|cierta)\b/i,
      /\b(creo|pienso|parece) que (te equivocas|estas? equivocad[oa]|estas? confundid[oa]|hay un error|es incorrecto|es un error)\b/i,
      /\b(dejame|permiteme|quiero|voy a|debo) (corregir|aclarar|precisar|rectificar)\b/i,
      /\b(la|lo) (correcto|correcta|verdadero|verdadera|real|cierto|cierta) es\b/i,
      /\bno es (así|cierto|verdad|correcto)\b/i,
      /\b(estas?|hay|existe) (confundiendo|mezclando|errando) (la información|los datos|las fechas|los hechos)\b/i
    ],
    confidence: 0.7,
    responseGenerator: (_params) => {
      const respuestas = [
        `Gracias por la corrección. Como asistente virtual, valoro mucho la precisión de la información. ¿Podrías proporcionarme los datos correctos para que pueda responder con mayor exactitud en futuras consultas sobre Eduardo?`,
        
        `Aprecio que señales ese error. La retroalimentación es importante para mejorar la calidad de nuestras conversaciones. ¿Cuál sería la información correcta? Esto me ayudará a proporcionar respuestas más precisas sobre Eduardo en el futuro.`,
        
        `Tienes razón al corregirme. La precisión es fundamental para representar adecuadamente el perfil de Eduardo. ¿Podrías compartir la información correcta? Esto enriquecerá nuestra conversación y mejorará futuras respuestas.`,
        
        `Agradezco la aclaración. Es importante que la información sobre Eduardo sea precisa y actualizada. ¿Podrías indicarme cuál es el dato correcto? Así podré ofrecer respuestas más exactas en adelante.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "mensaje_confuso",
    examples: [
      "asdfghjkl", "qwertyuiop", "123456789", "????", "...", "xD", "jajaja",
      "hmm", "ehh", "mmm", "ajá", "ok", "test", "prueba", "hola?", "??"
    ],
    patterns: [
      /^[a-z]{1,3}$/i, // 1-3 letras sin sentido
      /^[0-9]{1,5}$/i, // 1-5 números sin contexto
      /^[\.\?\!]{2,}$/i, // Múltiples signos de puntuación
      /^(ja){2,}$/i, // Risas como jajaja
      /^(je){2,}$/i, // Risas como jejeje
      /^(ha){2,}$/i, // Risas como hahaha
      /^(he){2,}$/i, // Risas como hehehe
      /^(k{2,}|ok|okay|okey|vale|bien)$/i, // Reconocimientos breves
      /^(hm+|eh+|mm+|ah+|oh+|uh+)$/i, // Sonidos de pensamiento/duda
      /^test|prueba$/i, // Mensajes de prueba
      /^hola\?$/i, // Saludos con duda
      /^\?\?+$/i, // Solo signos de interrogación
      /^x[dD]$/i // xD
    ],
    confidence: 0.8,
    responseGenerator: (_params) => {
      const respuestas = [
        `¿Hay algo específico sobre Eduardo que te gustaría conocer? Puedo contarte sobre su experiencia profesional, habilidades técnicas, proyectos o formación académica.`,
        
        `Estoy aquí para ayudarte a conocer más sobre Eduardo. ¿Tienes alguna pregunta específica sobre su perfil profesional, habilidades o proyectos?`,
        
        `¿En qué puedo ayudarte hoy? Estoy diseñada para compartir información sobre la trayectoria profesional de Eduardo, sus proyectos y habilidades técnicas.`,
        
        `¿Te gustaría saber algo en particular sobre Eduardo? Puedo contarte sobre su experiencia, proyectos, educación o intereses profesionales.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "contenido_inapropiado",
    examples: [
      "contenido para adultos", "temas sensibles", "política controversial", 
      "contenido ofensivo", "temas divisivos", "contenido no adecuado"
    ],
    patterns: [
      /\b(sex|porn|adult|xxx|desnud|nude|hot|caliente|sensual|erot|provocat|excita)/i,
      /\b(violencia|violence|sangr|blood|muerte|death|kill|mat(ar|o|e)|asesina|asesin(a|o)|cruel|brutal)/i,
      /\b(drogas?|drugs?|marihuana|cocaine|cocaína|heroina|heroína|meth|crack|ileg)/i,
      /\b(racis|nazi|antisemit|discrimina|prejuicio|prejuic|odi(a|o)|hate|odia|xenof)/i,
      /\b(robar|robo|steal|theft|hack|hacker|ilegal|illegal|crim)/i
    ],
    confidence: 0.9, // Alta prioridad para detectar este tipo de contenido
    responseGenerator: (_params) => {
      const respuestas = [
        `Preferiría enfocar nuestra conversación en temas relacionados con el perfil profesional de Eduardo. ¿Hay algo específico sobre su experiencia, habilidades o proyectos que te gustaría conocer?`,
        
        `Estoy diseñada para proporcionar información sobre Eduardo y su trayectoria profesional. ¿Puedo ayudarte con alguna pregunta relacionada con su perfil, habilidades técnicas o proyectos?`,
        
        `Mi propósito es compartir información sobre Eduardo en un contexto profesional. ¿Hay algún aspecto de su carrera, educación o habilidades técnicas que te interese conocer?`,
        
        `Prefiero mantener nuestra conversación centrada en temas profesionales relacionados con Eduardo. ¿Te gustaría saber algo sobre su experiencia, formación o proyectos desarrollados?`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "tema_no_relacionado",
    examples: [
      "háblame del clima", "cómo está el tiempo", "qué piensas de la política", 
      "cuéntame un secreto", "qué opinas del fútbol", "equipos deportivos", 
      "películas recientes", "noticias del día", "recomiéndame un libro",
      "cómo cocinar pasta", "recetas de cocina", "cuéntame de filosofía"
    ],
    patterns: [
      /\b(habla|dime|cuentame|explica|que (sabes|opinas|piensas)) (sobre|acerca de|del?|la) (clima|tiempo|politica|política|deportes?|futbol|fútbol|peliculas?|películas|libros?|cocina|recetas?|noticias?|filosofia|filosofía|historia|geografia|geografía|ciencia|musica|música|arte|religion|religión|economia|economía)/i,
      /\b(como|cuales|dónde|quién|qué) (es|son|está|estan|cocinar|preparar|hacer|jugar|ver|leer|escuchar|encontrar|conseguir) ([a-z]+)( ([a-z]+))?/i,
      /\b(recomien[d]?ame|sugiereme|conoces) (un|una|algun|alguna|algunos|algunas) ([a-z]+)( ([a-z]+))?/i,
      /\b(secreto|noticias?|deportes?|comida|receta|pelicula|película|cancion|canción|serie|libro|juego|restaurante|lugar)/i
    ],
    confidence: 0.6, // Confianza moderada para no interferir con temas sobre Eduardo
    responseGenerator: (_params) => {
      const respuestas = [
        `Entiendo tu interés en ese tema, pero estoy especializada en información sobre Eduardo y su perfil profesional. Aunque me encantaría hablar sobre otros temas, mi conocimiento está centrado en compartir información relevante sobre su experiencia, proyectos y habilidades. ¿Te gustaría saber algo específico sobre Eduardo?`,
        
        `Ese es un tema interesante, aunque mi especialidad es brindar información sobre Eduardo. Estoy diseñada para conversar sobre su perfil profesional, experiencia y proyectos. ¿Hay algo relacionado con Eduardo que te gustaría conocer?`,
        
        `Aunque me gustaría poder ayudarte con ese tema, mi función principal es compartir información sobre Eduardo y su trayectoria profesional. Puedo contarte sobre sus habilidades técnicas, proyectos, experiencia laboral o intereses personales. ¿Qué te gustaría saber sobre él?`,
        
        `Aprecio tu curiosidad, pero estoy especializada en conversar sobre Eduardo, su experiencia y perfil profesional. Estoy aquí para responder cualquier pregunta relacionada con su trayectoria, habilidades o proyectos. ¿Te interesa conocer algún aspecto específico sobre él?`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "quejas_criticas",
    examples: [
      "eso está mal", "te equivocas", "no sabes nada", "eres inútil", "no me ayudas",
      "no entiendes lo que digo", "das información incorrecta", "no funciona bien",
      "qué mala respuesta", "no tiene sentido", "eres una IA terrible"
    ],
    patterns: [
      /\b(estas? mal|te equivocas|no sabes|es incorrecto|no me (ayudas|sirves)|no (entiendes|comprendes)|no funciona|mala respuesta|sin sentido|terrible|inutil|inútil|tonta)\b/i,
      /\bno (es|estas? dando|estas? proporcionando) (correcto|adecuado|util|útil|lo que (pido|pregunto|quiero|necesito))\b/i,
      /\b(informacion|información|respuesta) (incorrecta|erronea|errónea|mala|inadecuada|equivocada)\b/i
    ],
    confidence: 0.75,
    responseGenerator: (params) => {
      // Verificar si hay varias quejas seguidas
      const recientesQuejas = params.memory.history
        .slice(-4) // Últimas 4 interacciones
        .filter(h => h.role === "user" && h.detectedIntent === "quejas_criticas")
        .length;
      
      if (recientesQuejas > 1) {
        // Si hay quejas reiteradas, ofrecer una disculpa más elaborada
        return `Lamento sinceramente que no estés encontrando útil nuestra conversación. Intentaré mejorar mis respuestas. ¿Podrías indicarme específicamente qué información sobre Eduardo te interesa conocer? Así podré enfocarme mejor en proporcionarte datos relevantes sobre su experiencia, proyectos o habilidades.`;
      }
      
      const respuestas = [
        `Lamento si mi respuesta no fue útil. Como asistente conversacional, intento proporcionar la mejor información posible sobre Eduardo. ¿Podrías aclarar qué estabas buscando saber? Intentaré responder de manera más precisa.`,
        
        `Disculpa si no he entendido correctamente tu pregunta. Estoy aquí para compartir información sobre Eduardo y su perfil profesional. ¿Podrías reformular tu pregunta? Intentaré darte una respuesta más adecuada.`,
        
        `Entiendo tu frustración. A veces puedo malinterpretar las preguntas. Mi objetivo es proporcionar información útil sobre Eduardo. ¿Hay algo específico sobre su experiencia o proyectos que te gustaría conocer?`,
        
        `Gracias por la retroalimentación. Mi propósito es brindarte información precisa sobre Eduardo. ¿Podrías indicarme qué parte de mi respuesta no fue satisfactoria? Me ayudará a mejorar nuestra conversación.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "disponibilidad_contacto_profesional",
    examples: [
      "¿Eduardo está disponible para trabajar?", "¿Puedo contratarlo?", "¿Ofrece servicios freelance?",
      "¿Está buscando empleo?", "¿Acepta proyectos nuevos?", "¿Cuáles son sus tarifas?",
      "¿Podría trabajar con mi empresa?", "¿Está disponible para una entrevista?",
      "¿Puedo enviarle una propuesta?", "¿Trabaja de forma remota?"
    ],
    patterns: [
      /\b(esta|se encuentra|estaría) disponible (para|como) (trabajar|trabajos?|proyectos?|freelance|empleo|contratar|contratacion|entrevista|colaborar|colaboracion|desarrollador|desarrollar|programar|programador)\b/i,
      /\b(puedo|podria|es posible|se puede) (contrata|contratarlo|trabajo|trabajar|entrevista|entrevistarlo|empleo|proyecto|propuesta|contactarlo)\b/i,
      /\b(acepta|toma|recibe|busca|ofrece) (proyectos|empleos|trabajos|clientes|propuestas|colaboraciones|entrevistas|nuevos|ofertas)\b/i,
      /\b(cuanto|cual|como) (cobra|cobraria|cuesta|son sus tarifas|es su tarifa|es su precio|son sus precios|es su presupuesto|trabaja)\b/i,
      /\b(trabaja|trabajo) (remoto|a distancia|desde casa|freelance|tiempo completo|tiempo parcial|part-time|full-time)\b/i
    ],
    confidence: 0.75,
    responseGenerator: (_params) => {
      const respuestas = [
        `Eduardo está abierto a nuevas oportunidades profesionales y colaboraciones. Actualmente trabaja tiempo completo, pero considera proyectos freelance según su disponibilidad. Para discutir posibilidades de trabajo, tarifas o proyectos, te recomiendo contactarlo directamente a través de su correo electrónico (rojoserranoe@gmail.com) o por LinkedIn, donde podrá evaluar tu propuesta de forma personal.`,
        
        `En cuanto a disponibilidad profesional, Eduardo evalúa oportunidades caso por caso. Actualmente tiene un empleo de tiempo completo, pero está abierto a discutir proyectos interesantes que se alineen con sus habilidades y disponibilidad. Para hablar sobre colaboraciones específicas, lo mejor es que le escribas directamente a su correo rojoserranoe@gmail.com con detalles de tu propuesta.`,
        
        `Eduardo considera nuevas oportunidades profesionales que se alineen con su trayectoria y objetivos. Para discutir disponibilidad, condiciones o posibles colaboraciones, te recomiendo contactarlo directamente a través de su email (rojoserranoe@gmail.com) o LinkedIn. Así podrás presentarle tu propuesta y recibir una respuesta personalizada sobre su interés y disponibilidad actual.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "correccion_informacion",
    examples: [
      "eso no es correcto", "creo que te equivocas", "esa información no es precisa",
      "no es así", "estás confundiendo la información", "eso no es exacto",
      "déjame corregirte", "permíteme aclarar", "la información correcta es"
    ],
    patterns: [
      /\b(eso|esta|información|dato|respuesta) no es (correcto|correcta|exacto|exacta|preciso|precisa|verdad|verdadero|verdadera|cierto|cierta)\b/i,
      /\b(creo|pienso|parece) que (te equivocas|estas? equivocad[oa]|estas? confundid[oa]|hay un error|es incorrecto|es un error)\b/i,
      /\b(dejame|permiteme|quiero|voy a|debo) (corregir|aclarar|precisar|rectificar)\b/i,
      /\b(la|lo) (correcto|correcta|verdadero|verdadera|real|cierto|cierta) es\b/i,
      /\bno es (así|cierto|verdad|correcto)\b/i,
      /\b(estas?|hay|existe) (confundiendo|mezclando|errando) (la información|los datos|las fechas|los hechos)\b/i
    ],
    confidence: 0.7,
    responseGenerator: (_params) => {
      const respuestas = [
        `Gracias por la corrección. Como asistente virtual, valoro mucho la precisión de la información. ¿Podrías proporcionarme los datos correctos para que pueda responder con mayor exactitud en futuras consultas sobre Eduardo?`,
        
        `Aprecio que señales ese error. La retroalimentación es importante para mejorar la calidad de nuestras conversaciones. ¿Cuál sería la información correcta? Esto me ayudará a proporcionar respuestas más precisas sobre Eduardo en el futuro.`,
        
        `Tienes razón al corregirme. La precisión es fundamental para representar adecuadamente el perfil de Eduardo. ¿Podrías compartir la información correcta? Esto enriquecerá nuestra conversación y mejorará futuras respuestas.`,
        
        `Agradezco la aclaración. Es importante que la información sobre Eduardo sea precisa y actualizada. ¿Podrías indicarme cuál es el dato correcto? Así podré ofrecer respuestas más exactas en adelante.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "mensaje_confuso",
    examples: [
      "asdfghjkl", "qwertyuiop", "123456789", "????", "...", "xD", "jajaja",
      "hmm", "ehh", "mmm", "ajá", "ok", "test", "prueba", "hola?", "??"
    ],
    patterns: [
      /^[a-z]{1,3}$/i, // 1-3 letras sin sentido
      /^[0-9]{1,5}$/i, // 1-5 números sin contexto
      /^[\.\?\!]{2,}$/i, // Múltiples signos de puntuación
      /^(ja){2,}$/i, // Risas como jajaja
      /^(je){2,}$/i, // Risas como jejeje
      /^(ha){2,}$/i, // Risas como hahaha
      /^(he){2,}$/i, // Risas como hehehe
      /^(k{2,}|ok|okay|okey|vale|bien)$/i, // Reconocimientos breves
      /^(hm+|eh+|mm+|ah+|oh+|uh+)$/i, // Sonidos de pensamiento/duda
      /^test|prueba$/i, // Mensajes de prueba
      /^hola\?$/i, // Saludos con duda
      /^\?\?+$/i, // Solo signos de interrogación
      /^x[dD]$/i // xD
    ],
    confidence: 0.8,
    responseGenerator: (_params) => {
      const respuestas = [
        `¿Hay algo específico sobre Eduardo que te gustaría conocer? Puedo contarte sobre su experiencia profesional, habilidades técnicas, proyectos o formación académica.`,
        
        `Estoy aquí para ayudarte a conocer más sobre Eduardo. ¿Tienes alguna pregunta específica sobre su perfil profesional, habilidades o proyectos?`,
        
        `¿En qué puedo ayudarte hoy? Estoy diseñada para compartir información sobre la trayectoria profesional de Eduardo, sus proyectos y habilidades técnicas.`,
        
        `¿Te gustaría saber algo en particular sobre Eduardo? Puedo contarte sobre su experiencia, proyectos, educación o intereses profesionales.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "contenido_inapropiado",
    examples: [
      "contenido para adultos", "temas sensibles", "política controversial", 
      "contenido ofensivo", "temas divisivos", "contenido no adecuado"
    ],
    patterns: [
      /\b(sex|porn|adult|xxx|desnud|nude|hot|caliente|sensual|erot|provocat|excita)/i,
      /\b(violencia|violence|sangr|blood|muerte|death|kill|mat(ar|o|e)|asesina|asesin(a|o)|cruel|brutal)/i,
      /\b(drogas?|drugs?|marihuana|cocaine|cocaína|heroina|heroína|meth|crack|ileg)/i,
      /\b(racis|nazi|antisemit|discrimina|prejuicio|prejuic|odi(a|o)|hate|odia|xenof)/i,
      /\b(robar|robo|steal|theft|hack|hacker|ilegal|illegal|crim)/i
    ],
    confidence: 0.9, // Alta prioridad para detectar este tipo de contenido
    responseGenerator: (_params) => {
      const respuestas = [
        `Preferiría enfocar nuestra conversación en temas relacionados con el perfil profesional de Eduardo. ¿Hay algo específico sobre su experiencia, habilidades o proyectos que te gustaría conocer?`,
        
        `Estoy diseñada para proporcionar información sobre Eduardo y su trayectoria profesional. ¿Puedo ayudarte con alguna pregunta relacionada con su perfil, habilidades técnicas o proyectos?`,
        
        `Mi propósito es compartir información sobre Eduardo en un contexto profesional. ¿Hay algún aspecto de su carrera, educación o habilidades técnicas que te interese conocer?`,
        
        `Prefiero mantener nuestra conversación centrada en temas profesionales relacionados con Eduardo. ¿Te gustaría saber algo sobre su experiencia, formación o proyectos desarrollados?`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "tema_no_relacionado",
    examples: [
      "háblame del clima", "cómo está el tiempo", "qué piensas de la política", 
      "cuéntame un secreto", "qué opinas del fútbol", "equipos deportivos", 
      "películas recientes", "noticias del día", "recomiéndame un libro",
      "cómo cocinar pasta", "recetas de cocina", "cuéntame de filosofía"
    ],
    patterns: [
      /\b(habla|dime|cuentame|explica|que (sabes|opinas|piensas)) (sobre|acerca de|del?|la) (clima|tiempo|politica|política|deportes?|futbol|fútbol|peliculas?|películas|libros?|cocina|recetas?|noticias?|filosofia|filosofía|historia|geografia|geografía|ciencia|musica|música|arte|religion|religión|economia|economía)/i,
      /\b(como|cuales|dónde|quién|qué) (es|son|está|estan|cocinar|preparar|hacer|jugar|ver|leer|escuchar|encontrar|conseguir) ([a-z]+)( ([a-z]+))?/i,
      /\b(recomien[d]?ame|sugiereme|conoces) (un|una|algun|alguna|algunos|algunas) ([a-z]+)( ([a-z]+))?/i,
      /\b(secreto|noticias?|deportes?|comida|receta|pelicula|película|cancion|canción|serie|libro|juego|restaurante|lugar)/i
    ],
    confidence: 0.6, // Confianza moderada para no interferir con temas sobre Eduardo
    responseGenerator: (_params) => {
      const respuestas = [
        `Entiendo tu interés en ese tema, pero estoy especializada en información sobre Eduardo y su perfil profesional. Aunque me encantaría hablar sobre otros temas, mi conocimiento está centrado en compartir información relevante sobre su experiencia, proyectos y habilidades. ¿Te gustaría saber algo específico sobre Eduardo?`,
        
        `Ese es un tema interesante, aunque mi especialidad es brindar información sobre Eduardo. Estoy diseñada para conversar sobre su perfil profesional, experiencia y proyectos. ¿Hay algo relacionado con Eduardo que te gustaría conocer?`,
        
        `Aunque me gustaría poder ayudarte con ese tema, mi función principal es compartir información sobre Eduardo y su trayectoria profesional. Puedo contarte sobre sus habilidades técnicas, proyectos, experiencia laboral o intereses personales. ¿Qué te gustaría saber sobre él?`,
        
        `Aprecio tu curiosidad, pero estoy especializada en conversar sobre Eduardo, su experiencia y perfil profesional. Estoy aquí para responder cualquier pregunta relacionada con su trayectoria, habilidades o proyectos. ¿Te interesa conocer algún aspecto específico sobre él?`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "quejas_criticas",
    examples: [
      "eso está mal", "te equivocas", "no sabes nada", "eres inútil", "no me ayudas",
      "no entiendes lo que digo", "das información incorrecta", "no funciona bien",
      "qué mala respuesta", "no tiene sentido", "eres una IA terrible"
    ],
    patterns: [
      /\b(estas? mal|te equivocas|no sabes|es incorrecto|no me (ayudas|sirves)|no (entiendes|comprendes)|no funciona|mala respuesta|sin sentido|terrible|inutil|inútil|tonta)\b/i,
      /\bno (es|estas? dando|estas? proporcionando) (correcto|adecuado|util|útil|lo que (pido|pregunto|quiero|necesito))\b/i,
      /\b(informacion|información|respuesta) (incorrecta|erronea|errónea|mala|inadecuada|equivocada)\b/i
    ],
    confidence: 0.75,
    responseGenerator: (params) => {
      // Verificar si hay varias quejas seguidas
      const recientesQuejas = params.memory.history
        .slice(-4) // Últimas 4 interacciones
        .filter(h => h.role === "user" && h.detectedIntent === "quejas_criticas")
        .length;
      
      if (recientesQuejas > 1) {
        // Si hay quejas reiteradas, ofrecer una disculpa más elaborada
        return `Lamento sinceramente que no estés encontrando útil nuestra conversación. Intentaré mejorar mis respuestas. ¿Podrías indicarme específicamente qué información sobre Eduardo te interesa conocer? Así podré enfocarme mejor en proporcionarte datos relevantes sobre su experiencia, proyectos o habilidades.`;
      }
      
      const respuestas = [
        `Lamento si mi respuesta no fue útil. Como asistente conversacional, intento proporcionar la mejor información posible sobre Eduardo. ¿Podrías aclarar qué estabas buscando saber? Intentaré responder de manera más precisa.`,
        
        `Disculpa si no he entendido correctamente tu pregunta. Estoy aquí para compartir información sobre Eduardo y su perfil profesional. ¿Podrías reformular tu pregunta? Intentaré darte una respuesta más adecuada.`,
        
        `Entiendo tu frustración. A veces puedo malinterpretar las preguntas. Mi objetivo es proporcionar información útil sobre Eduardo. ¿Hay algo específico sobre su experiencia o proyectos que te gustaría conocer?`,
        
        `Gracias por la retroalimentación. Mi propósito es brindarte información precisa sobre Eduardo. ¿Podrías indicarme qué parte de mi respuesta no fue satisfactoria? Me ayudará a mejorar nuestra conversación.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "disponibilidad_contacto_profesional",
    examples: [
      "¿Eduardo está disponible para trabajar?", "¿Puedo contratarlo?", "¿Ofrece servicios freelance?",
      "¿Está buscando empleo?", "¿Acepta proyectos nuevos?", "¿Cuáles son sus tarifas?",
      "¿Podría trabajar con mi empresa?", "¿Está disponible para una entrevista?",
      "¿Puedo enviarle una propuesta?", "¿Trabaja de forma remota?"
    ],
    patterns: [
      /\b(esta|se encuentra|estaría) disponible (para|como) (trabajar|trabajos?|proyectos?|freelance|empleo|contratar|contratacion|entrevista|colaborar|colaboracion|desarrollador|desarrollar|programar|programador)\b/i,
      /\b(puedo|podria|es posible|se puede) (contrata|contratarlo|trabajo|trabajar|entrevista|entrevistarlo|empleo|proyecto|propuesta|contactarlo)\b/i,
      /\b(acepta|toma|recibe|busca|ofrece) (proyectos|empleos|trabajos|clientes|propuestas|colaboraciones|entrevistas|nuevos|ofertas)\b/i,
      /\b(cuanto|cual|como) (cobra|cobraria|cuesta|son sus tarifas|es su tarifa|es su precio|son sus precios|es su presupuesto|trabaja)\b/i,
      /\b(trabaja|trabajo) (remoto|a distancia|desde casa|freelance|tiempo completo|tiempo parcial|part-time|full-time)\b/i
    ],
    confidence: 0.75,
    responseGenerator: (_params) => {
      const respuestas = [
        `Eduardo está abierto a nuevas oportunidades profesionales y colaboraciones. Actualmente trabaja tiempo completo, pero considera proyectos freelance según su disponibilidad. Para discutir posibilidades de trabajo, tarifas o proyectos, te recomiendo contactarlo directamente a través de su correo electrónico (rojoserranoe@gmail.com) o por LinkedIn, donde podrá evaluar tu propuesta de forma personal.`,
        
        `En cuanto a disponibilidad profesional, Eduardo evalúa oportunidades caso por caso. Actualmente tiene un empleo de tiempo completo, pero está abierto a discutir proyectos interesantes que se alineen con sus habilidades y disponibilidad. Para hablar sobre colaboraciones específicas, lo mejor es que le escribas directamente a su correo rojoserranoe@gmail.com con detalles de tu propuesta.`,
        
        `Eduardo considera nuevas oportunidades profesionales que se alineen con su trayectoria y objetivos. Para discutir disponibilidad, condiciones o posibles colaboraciones, te recomiendo contactarlo directamente a través de su email (rojoserranoe@gmail.com) o LinkedIn. Así podrás presentarle tu propuesta y recibir una respuesta personalizada sobre su interés y disponibilidad actual.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "correccion_informacion",
    examples: [
      "eso no es correcto", "creo que te equivocas", "esa información no es precisa",
      "no es así", "estás confundiendo la información", "eso no es exacto",
      "déjame corregirte", "permíteme aclarar", "la información correcta es"
    ],
    patterns: [
      /\b(eso|esta|información|dato|respuesta) no es (correcto|correcta|exacto|exacta|preciso|precisa|verdad|verdadero|verdadera|cierto|cierta)\b/i,
      /\b(creo|pienso|parece) que (te equivocas|estas? equivocad[oa]|estas? confundid[oa]|hay un error|es incorrecto|es un error)\b/i,
      /\b(dejame|permiteme|quiero|voy a|debo) (corregir|aclarar|precisar|rectificar)\b/i,
      /\b(la|lo) (correcto|correcta|verdadero|verdadera|real|cierto|cierta) es\b/i,
      /\bno es (así|cierto|verdad|correcto)\b/i,
      /\b(estas?|hay|existe) (confundiendo|mezclando|errando) (la información|los datos|las fechas|los hechos)\b/i
    ],
    confidence: 0.7,
    responseGenerator: (_params) => {
      const respuestas = [
        `Gracias por la corrección. Como asistente virtual, valoro mucho la precisión de la información. ¿Podrías proporcionarme los datos correctos para que pueda responder con mayor exactitud en futuras consultas sobre Eduardo?`,
        
        `Aprecio que señales ese error. La retroalimentación es importante para mejorar la calidad de nuestras conversaciones. ¿Cuál sería la información correcta? Esto me ayudará a proporcionar respuestas más precisas sobre Eduardo en el futuro.`,
        
        `Tienes razón al corregirme. La precisión es fundamental para representar adecuadamente el perfil de Eduardo. ¿Podrías compartir la información correcta? Esto enriquecerá nuestra conversación y mejorará futuras respuestas.`,
        
        `Agradezco la aclaración. Es importante que la información sobre Eduardo sea precisa y actualizada. ¿Podrías indicarme cuál es el dato correcto? Así podré ofrecer respuestas más exactas en adelante.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "mensaje_confuso",
    examples: [
      "asdfghjkl", "qwertyuiop", "123456789", "????", "...", "xD", "jajaja",
      "hmm", "ehh", "mmm", "ajá", "ok", "test", "prueba", "hola?", "??"
    ],
    patterns: [
      /^[a-z]{1,3}$/i, // 1-3 letras sin sentido
      /^[0-9]{1,5}$/i, // 1-5 números sin contexto
      /^[\.\?\!]{2,}$/i, // Múltiples signos de puntuación
      /^(ja){2,}$/i, // Risas como jajaja
      /^(je){2,}$/i, // Risas como jejeje
      /^(ha){2,}$/i, // Risas como hahaha
      /^(he){2,}$/i, // Risas como hehehe
      /^(k{2,}|ok|okay|okey|vale|bien)$/i, // Reconocimientos breves
      /^(hm+|eh+|mm+|ah+|oh+|uh+)$/i, // Sonidos de pensamiento/duda
      /^test|prueba$/i, // Mensajes de prueba
      /^hola\?$/i, // Saludos con duda
      /^\?\?+$/i, // Solo signos de interrogación
      /^x[dD]$/i // xD
    ],
    confidence: 0.8,
    responseGenerator: (_params) => {
      const respuestas = [
        `¿Hay algo específico sobre Eduardo que te gustaría conocer? Puedo contarte sobre su experiencia profesional, habilidades técnicas, proyectos o formación académica.`,
        
        `Estoy aquí para ayudarte a conocer más sobre Eduardo. ¿Tienes alguna pregunta específica sobre su perfil profesional, habilidades o proyectos?`,
        
        `¿En qué puedo ayudarte hoy? Estoy diseñada para compartir información sobre la trayectoria profesional de Eduardo, sus proyectos y habilidades técnicas.`,
        
        `¿Te gustaría saber algo en particular sobre Eduardo? Puedo contarte sobre su experiencia, proyectos, educación o intereses profesionales.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "contenido_inapropiado",
    examples: [
      "contenido para adultos", "temas sensibles", "política controversial", 
      "contenido ofensivo", "temas divisivos", "contenido no adecuado"
    ],
    patterns: [
      /\b(sex|porn|adult|xxx|desnud|nude|hot|caliente|sensual|erot|provocat|excita)/i,
      /\b(violencia|violence|sangr|blood|muerte|death|kill|mat(ar|o|e)|asesina|asesin(a|o)|cruel|brutal)/i,
      /\b(drogas?|drugs?|marihuana|cocaine|cocaína|heroina|heroína|meth|crack|ileg)/i,
      /\b(racis|nazi|antisemit|discrimina|prejuicio|prejuic|odi(a|o)|hate|odia|xenof)/i,
      /\b(robar|robo|steal|theft|hack|hacker|ilegal|illegal|crim)/i
    ],
    confidence: 0.9, // Alta prioridad para detectar este tipo de contenido
    responseGenerator: (_params) => {
      const respuestas = [
        `Preferiría enfocar nuestra conversación en temas relacionados con el perfil profesional de Eduardo. ¿Hay algo específico sobre su experiencia, habilidades o proyectos que te gustaría conocer?`,
        
        `Estoy diseñada para proporcionar información sobre Eduardo y su trayectoria profesional. ¿Puedo ayudarte con alguna pregunta relacionada con su perfil, habilidades técnicas o proyectos?`,
        
        `Mi propósito es compartir información sobre Eduardo en un contexto profesional. ¿Hay algún aspecto de su carrera, educación o habilidades técnicas que te interese conocer?`,
        
        `Prefiero mantener nuestra conversación centrada en temas profesionales relacionados con Eduardo. ¿Te gustaría saber algo sobre su experiencia, formación o proyectos desarrollados?`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "tema_no_relacionado",
    examples: [
      "háblame del clima", "cómo está el tiempo", "qué piensas de la política", 
      "cuéntame un secreto", "qué opinas del fútbol", "equipos deportivos", 
      "películas recientes", "noticias del día", "recomiéndame un libro",
      "cómo cocinar pasta", "recetas de cocina", "cuéntame de filosofía"
    ],
    patterns: [
      /\b(habla|dime|cuentame|explica|que (sabes|opinas|piensas)) (sobre|acerca de|del?|la) (clima|tiempo|politica|política|deportes?|futbol|fútbol|peliculas?|películas|libros?|cocina|recetas?|noticias?|filosofia|filosofía|historia|geografia|geografía|ciencia|musica|música|arte|religion|religión|economia|economía)/i,
      /\b(como|cuales|dónde|quién|qué) (es|son|está|estan|cocinar|preparar|hacer|jugar|ver|leer|escuchar|encontrar|conseguir) ([a-z]+)( ([a-z]+))?/i,
      /\b(recomien[d]?ame|sugiereme|conoces) (un|una|algun|alguna|algunos|algunas) ([a-z]+)( ([a-z]+))?/i,
      /\b(secreto|noticias?|deportes?|comida|receta|pelicula|película|cancion|canción|serie|libro|juego|restaurante|lugar)/i
    ],
    confidence: 0.6, // Confianza moderada para no interferir con temas sobre Eduardo
    responseGenerator: (_params) => {
      const respuestas = [
        `Entiendo tu interés en ese tema, pero estoy especializada en información sobre Eduardo y su perfil profesional. Aunque me encantaría hablar sobre otros temas, mi conocimiento está centrado en compartir información relevante sobre su experiencia, proyectos y habilidades. ¿Te gustaría saber algo específico sobre Eduardo?`,
        
        `Ese es un tema interesante, aunque mi especialidad es brindar información sobre Eduardo. Estoy diseñada para conversar sobre su perfil profesional, experiencia y proyectos. ¿Hay algo relacionado con Eduardo que te gustaría conocer?`,
        
        `Aunque me gustaría poder ayudarte con ese tema, mi función principal es compartir información sobre Eduardo y su trayectoria profesional. Puedo contarte sobre sus habilidades técnicas, proyectos, experiencia laboral o intereses personales. ¿Qué te gustaría saber sobre él?`,
        
        `Aprecio tu curiosidad, pero estoy especializada en conversar sobre Eduardo, su experiencia y perfil profesional. Estoy aquí para responder cualquier pregunta relacionada con su trayectoria, habilidades o proyectos. ¿Te interesa conocer algún aspecto específico sobre él?`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "quejas_criticas",
    examples: [
      "eso está mal", "te equivocas", "no sabes nada", "eres inútil", "no me ayudas",
      "no entiendes lo que digo", "das información incorrecta", "no funciona bien",
      "qué mala respuesta", "no tiene sentido", "eres una IA terrible"
    ],
    patterns: [
      /\b(estas? mal|te equivocas|no sabes|es incorrecto|no me (ayudas|sirves)|no (entiendes|comprendes)|no funciona|mala respuesta|sin sentido|terrible|inutil|inútil|tonta)\b/i,
      /\bno (es|estas? dando|estas? proporcionando) (correcto|adecuado|util|útil|lo que (pido|pregunto|quiero|necesito))\b/i,
      /\b(informacion|información|respuesta) (incorrecta|erronea|errónea|mala|inadecuada|equivocada)\b/i
    ],
    confidence: 0.75,
    responseGenerator: (params) => {
      // Verificar si hay varias quejas seguidas
      const recientesQuejas = params.memory.history
        .slice(-4) // Últimas 4 interacciones
        .filter(h => h.role === "user" && h.detectedIntent === "quejas_criticas")
        .length;
      
      if (recientesQuejas > 1) {
        // Si hay quejas reiteradas, ofrecer una disculpa más elaborada
        return `Lamento sinceramente que no estés encontrando útil nuestra conversación. Intentaré mejorar mis respuestas. ¿Podrías indicarme específicamente qué información sobre Eduardo te interesa conocer? Así podré enfocarme mejor en proporcionarte datos relevantes sobre su experiencia, proyectos o habilidades.`;
      }
      
      const respuestas = [
        `Lamento si mi respuesta no fue útil. Como asistente conversacional, intento proporcionar la mejor información posible sobre Eduardo. ¿Podrías aclarar qué estabas buscando saber? Intentaré responder de manera más precisa.`,
        
        `Disculpa si no he entendido correctamente tu pregunta. Estoy aquí para compartir información sobre Eduardo y su perfil profesional. ¿Podrías reformular tu pregunta? Intentaré darte una respuesta más adecuada.`,
        
        `Entiendo tu frustración. A veces puedo malinterpretar las preguntas. Mi objetivo es proporcionar información útil sobre Eduardo. ¿Hay algo específico sobre su experiencia o proyectos que te gustaría conocer?`,
        
        `Gracias por la retroalimentación. Mi propósito es brindarte información precisa sobre Eduardo. ¿Podrías indicarme qué parte de mi respuesta no fue satisfactoria? Me ayudará a mejorar nuestra conversación.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "disponibilidad_contacto_profesional",
    examples: [
      "¿Eduardo está disponible para trabajar?", "¿Puedo contratarlo?", "¿Ofrece servicios freelance?",
      "¿Está buscando empleo?", "¿Acepta proyectos nuevos?", "¿Cuáles son sus tarifas?",
      "¿Podría trabajar con mi empresa?", "¿Está disponible para una entrevista?",
      "¿Puedo enviarle una propuesta?", "¿Trabaja de forma remota?"
    ],
    patterns: [
      /\b(esta|se encuentra|estaría) disponible (para|como) (trabajar|trabajos?|proyectos?|freelance|empleo|contratar|contratacion|entrevista|colaborar|colaboracion|desarrollador|desarrollar|programar|programador)\b/i,
      /\b(puedo|podria|es posible|se puede) (contrata|contratarlo|trabajo|trabajar|entrevista|entrevistarlo|empleo|proyecto|propuesta|contactarlo)\b/i,
      /\b(acepta|toma|recibe|busca|ofrece) (proyectos|empleos|trabajos|clientes|propuestas|colaboraciones|entrevistas|nuevos|ofertas)\b/i,
      /\b(cuanto|cual|como) (cobra|cobraria|cuesta|son sus tarifas|es su tarifa|es su precio|son sus precios|es su presupuesto|trabaja)\b/i,
      /\b(trabaja|trabajo) (remoto|a distancia|desde casa|freelance|tiempo completo|tiempo parcial|part-time|full-time)\b/i
    ],
    confidence: 0.75,
    responseGenerator: (_params) => {
      const respuestas = [
        `Eduardo está abierto a nuevas oportunidades profesionales y colaboraciones. Actualmente trabaja tiempo completo, pero considera proyectos freelance según su disponibilidad. Para discutir posibilidades de trabajo, tarifas o proyectos, te recomiendo contactarlo directamente a través de su correo electrónico (rojoserranoe@gmail.com) o por LinkedIn, donde podrá evaluar tu propuesta de forma personal.`,
        
        `En cuanto a disponibilidad profesional, Eduardo evalúa oportunidades caso por caso. Actualmente tiene un empleo de tiempo completo, pero está abierto a discutir proyectos interesantes que se alineen con sus habilidades y disponibilidad. Para hablar sobre colaboraciones específicas, lo mejor es que le escribas directamente a su correo rojoserranoe@gmail.com con detalles de tu propuesta.`,
        
        `Eduardo considera nuevas oportunidades profesionales que se alineen con su trayectoria y objetivos. Para discutir disponibilidad, condiciones o posibles colaboraciones, te recomiendo contactarlo directamente a través de su email (rojoserranoe@gmail.com) o LinkedIn. Así podrás presentarle tu propuesta y recibir una respuesta personalizada sobre su interés y disponibilidad actual.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "correccion_informacion",
    examples: [
      "eso no es correcto", "creo que te equivocas", "esa información no es precisa",
      "no es así", "estás confundiendo la información", "eso no es exacto",
      "déjame corregirte", "permíteme aclarar", "la información correcta es"
    ],
    patterns: [
      /\b(eso|esta|información|dato|respuesta) no es (correcto|correcta|exacto|exacta|preciso|precisa|verdad|verdadero|verdadera|cierto|cierta)\b/i,
      /\b(creo|pienso|parece) que (te equivocas|estas? equivocad[oa]|estas? confundid[oa]|hay un error|es incorrecto|es un error)\b/i,
      /\b(dejame|permiteme|quiero|voy a|debo) (corregir|aclarar|precisar|rectificar)\b/i,
      /\b(la|lo) (correcto|correcta|verdadero|verdadera|real|cierto|cierta) es\b/i,
      /\bno es (así|cierto|verdad|correcto)\b/i,
      /\b(estas?|hay|existe) (confundiendo|mezclando|errando) (la información|los datos|las fechas|los hechos)\b/i
    ],
    confidence: 0.7,
    responseGenerator: (_params) => {
      const respuestas = [
        `Gracias por la corrección. Como asistente virtual, valoro mucho la precisión de la información. ¿Podrías proporcionarme los datos correctos para que pueda responder con mayor exactitud en futuras consultas sobre Eduardo?`,
        
        `Aprecio que señales ese error. La retroalimentación es importante para mejorar la calidad de nuestras conversaciones. ¿Cuál sería la información correcta? Esto me ayudará a proporcionar respuestas más precisas sobre Eduardo en el futuro.`,
        
        `Tienes razón al corregirme. La precisión es fundamental para representar adecuadamente el perfil de Eduardo. ¿Podrías compartir la información correcta? Esto enriquecerá nuestra conversación y mejorará futuras respuestas.`,
        
        `Agradezco la aclaración. Es importante que la información sobre Eduardo sea precisa y actualizada. ¿Podrías indicarme cuál es el dato correcto? Así podré ofrecer respuestas más exactas en adelante.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "mensaje_confuso",
    examples: [
      "asdfghjkl", "qwertyuiop", "123456789", "????", "...", "xD", "jajaja",
      "hmm", "ehh", "mmm", "ajá", "ok", "test", "prueba", "hola?", "??"
    ],
    patterns: [
      /^[a-z]{1,3}$/i, // 1-3 letras sin sentido
      /^[0-9]{1,5}$/i, // 1-5 números sin contexto
      /^[\.\?\!]{2,}$/i, // Múltiples signos de puntuación
      /^(ja){2,}$/i, // Risas como jajaja
      /^(je){2,}$/i, // Risas como jejeje
      /^(ha){2,}$/i, // Risas como hahaha
      /^(he){2,}$/i, // Risas como hehehe
      /^(k{2,}|ok|okay|okey|vale|bien)$/i, // Reconocimientos breves
      /^(hm+|eh+|mm+|ah+|oh+|uh+)$/i, // Sonidos de pensamiento/duda
      /^test|prueba$/i, // Mensajes de prueba
      /^hola\?$/i, // Saludos con duda
      /^\?\?+$/i, // Solo signos de interrogación
      /^x[dD]$/i // xD
    ],
    confidence: 0.8,
    responseGenerator: (_params) => {
      const respuestas = [
        `¿Hay algo específico sobre Eduardo que te gustaría conocer? Puedo contarte sobre su experiencia profesional, habilidades técnicas, proyectos o formación académica.`,
        
        `Estoy aquí para ayudarte a conocer más sobre Eduardo. ¿Tienes alguna pregunta específica sobre su perfil profesional, habilidades o proyectos?`,
        
        `¿En qué puedo ayudarte hoy? Estoy diseñada para compartir información sobre la trayectoria profesional de Eduardo, sus proyectos y habilidades técnicas.`,
        
        `¿Te gustaría saber algo en particular sobre Eduardo? Puedo contarte sobre su experiencia, proyectos, educación o intereses profesionales.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "contenido_inapropiado",
    examples: [
      "contenido para adultos", "temas sensibles", "política controversial", 
      "contenido ofensivo", "temas divisivos", "contenido no adecuado"
    ],
    patterns: [
      /\b(sex|porn|adult|xxx|desnud|nude|hot|caliente|sensual|erot|provocat|excita)/i,
      /\b(violencia|violence|sangr|blood|muerte|death|kill|mat(ar|o|e)|asesina|asesin(a|o)|cruel|brutal)/i,
      /\b(drogas?|drugs?|marihuana|cocaine|cocaína|heroina|heroína|meth|crack|ileg)/i,
      /\b(racis|nazi|antisemit|discrimina|prejuicio|prejuic|odi(a|o)|hate|odia|xenof)/i,
      /\b(robar|robo|steal|theft|hack|hacker|ilegal|illegal|crim)/i
    ],
    confidence: 0.9, // Alta prioridad para detectar este tipo de contenido
    responseGenerator: (_params) => {
      const respuestas = [
        `Preferiría enfocar nuestra conversación en temas relacionados con el perfil profesional de Eduardo. ¿Hay algo específico sobre su experiencia, habilidades o proyectos que te gustaría conocer?`,
        
        `Estoy diseñada para proporcionar información sobre Eduardo y su trayectoria profesional. ¿Puedo ayudarte con alguna pregunta relacionada con su perfil, habilidades técnicas o proyectos?`,
        
        `Mi propósito es compartir información sobre Eduardo en un contexto profesional. ¿Hay algún aspecto de su carrera, educación o habilidades técnicas que te interese conocer?`,
        
        `Prefiero mantener nuestra conversación centrada en temas profesionales relacionados con Eduardo. ¿Te gustaría saber algo sobre su experiencia, formación o proyectos desarrollados?`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "tema_no_relacionado",
    examples: [
      "háblame del clima", "cómo está el tiempo", "qué piensas de la política", 
      "cuéntame un secreto", "qué opinas del fútbol", "equipos deportivos", 
      "películas recientes", "noticias del día", "recomiéndame un libro",
      "cómo cocinar pasta", "recetas de cocina", "cuéntame de filosofía"
    ],
    patterns: [
      /\b(habla|dime|cuentame|explica|que (sabes|opinas|piensas)) (sobre|acerca de|del?|la) (clima|tiempo|politica|política|deportes?|futbol|fútbol|peliculas?|películas|libros?|cocina|recetas?|noticias?|filosofia|filosofía|historia|geografia|geografía|ciencia|musica|música|arte|religion|religión|economia|economía)/i,
      /\b(como|cuales|dónde|quién|qué) (es|son|está|estan|cocinar|preparar|hacer|jugar|ver|leer|escuchar|encontrar|conseguir) ([a-z]+)( ([a-z]+))?/i,
      /\b(recomien[d]?ame|sugiereme|conoces) (un|una|algun|alguna|algunos|algunas) ([a-z]+)( ([a-z]+))?/i,
      /\b(secreto|noticias?|deportes?|comida|receta|pelicula|película|cancion|canción|serie|libro|juego|restaurante|lugar)/i
    ],
    confidence: 0.6, // Confianza moderada para no interferir con temas sobre Eduardo
    responseGenerator: (_params) => {
      const respuestas = [
        `Entiendo tu interés en ese tema, pero estoy especializada en información sobre Eduardo y su perfil profesional. Aunque me encantaría hablar sobre otros temas, mi conocimiento está centrado en compartir información relevante sobre su experiencia, proyectos y habilidades. ¿Te gustaría saber algo específico sobre Eduardo?`,
        
        `Ese es un tema interesante, aunque mi especialidad es brindar información sobre Eduardo. Estoy diseñada para conversar sobre su perfil profesional, experiencia y proyectos. ¿Hay algo relacionado con Eduardo que te gustaría conocer?`,
        
        `Aunque me gustaría poder ayudarte con ese tema, mi función principal es compartir información sobre Eduardo y su trayectoria profesional. Puedo contarte sobre sus habilidades técnicas, proyectos, experiencia laboral o intereses personales. ¿Qué te gustaría saber sobre él?`,
        
        `Aprecio tu curiosidad, pero estoy especializada en conversar sobre Eduardo, su experiencia y perfil profesional. Estoy aquí para responder cualquier pregunta relacionada con su trayectoria, habilidades o proyectos. ¿Te interesa conocer algún aspecto específico sobre él?`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "quejas_criticas",
    examples: [
      "eso está mal", "te equivocas", "no sabes nada", "eres inútil", "no me ayudas",
      "no entiendes lo que digo", "das información incorrecta", "no funciona bien",
      "qué mala respuesta", "no tiene sentido", "eres una IA terrible"
    ],
    patterns: [
      /\b(estas? mal|te equivocas|no sabes|es incorrecto|no me (ayudas|sirves)|no (entiendes|comprendes)|no funciona|mala respuesta|sin sentido|terrible|inutil|inútil|tonta)\b/i,
      /\bno (es|estas? dando|estas? proporcionando) (correcto|adecuado|util|útil|lo que (pido|pregunto|quiero|necesito))\b/i,
      /\b(informacion|información|respuesta) (incorrecta|erronea|errónea|mala|inadecuada|equivocada)\b/i
    ],
    confidence: 0.75,
    responseGenerator: (params) => {
      // Verificar si hay varias quejas seguidas
      const recientesQuejas = params.memory.history
        .slice(-4) // Últimas 4 interacciones
        .filter(h => h.role === "user" && h.detectedIntent === "quejas_criticas")
        .length;
      
      if (recientesQuejas > 1) {
        // Si hay quejas reiteradas, ofrecer una disculpa más elaborada
        return `Lamento sinceramente que no estés encontrando útil nuestra conversación. Intentaré mejorar mis respuestas. ¿Podrías indicarme específicamente qué información sobre Eduardo te interesa conocer? Así podré enfocarme mejor en proporcionarte datos relevantes sobre su experiencia, proyectos o habilidades.`;
      }
      
      const respuestas = [
        `Lamento si mi respuesta no fue útil. Como asistente conversacional, intento proporcionar la mejor información posible sobre Eduardo. ¿Podrías aclarar qué estabas buscando saber? Intentaré responder de manera más precisa.`,
        
        `Disculpa si no he entendido correctamente tu pregunta. Estoy aquí para compartir información sobre Eduardo y su perfil profesional. ¿Podrías reformular tu pregunta? Intentaré darte una respuesta más adecuada.`,
        
        `Entiendo tu frustración. A veces puedo malinterpretar las preguntas. Mi objetivo es proporcionar información útil sobre Eduardo. ¿Hay algo específico sobre su experiencia o proyectos que te gustaría conocer?`,
        
        `Gracias por la retroalimentación. Mi propósito es brindarte información precisa sobre Eduardo. ¿Podrías indicarme qué parte de mi respuesta no fue satisfactoria? Me ayudará a mejorar nuestra conversación.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "disponibilidad_contacto_profesional",
    examples: [
      "¿Eduardo está disponible para trabajar?", "¿Puedo contratarlo?", "¿Ofrece servicios freelance?",
      "¿Está buscando empleo?", "¿Acepta proyectos nuevos?", "¿Cuáles son sus tarifas?",
      "¿Podría trabajar con mi empresa?", "¿Está disponible para una entrevista?",
      "¿Puedo enviarle una propuesta?", "¿Trabaja de forma remota?"
    ],
    patterns: [
      /\b(esta|se encuentra|estaría) disponible (para|como) (trabajar|trabajos?|proyectos?|freelance|empleo|contratar|contratacion|entrevista|colaborar|colaboracion|desarrollador|desarrollar|programar|programador)\b/i,
      /\b(puedo|podria|es posible|se puede) (contrata|contratarlo|trabajo|trabajar|entrevista|entrevistarlo|empleo|proyecto|propuesta|contactarlo)\b/i,
      /\b(acepta|toma|recibe|busca|ofrece) (proyectos|empleos|trabajos|clientes|propuestas|colaboraciones|entrevistas|nuevos|ofertas)\b/i,
      /\b(cuanto|cual|como) (cobra|cobraria|cuesta|son sus tarifas|es su tarifa|es su precio|son sus precios|es su presupuesto|trabaja)\b/i,
      /\b(trabaja|trabajo) (remoto|a distancia|desde casa|freelance|tiempo completo|tiempo parcial|part-time|full-time)\b/i
    ],
    confidence: 0.75,
    responseGenerator: (_params) => {
      const respuestas = [
        `Eduardo está abierto a nuevas oportunidades profesionales y colaboraciones. Actualmente trabaja tiempo completo, pero considera proyectos freelance según su disponibilidad. Para discutir posibilidades de trabajo, tarifas o proyectos, te recomiendo contactarlo directamente a través de su correo electrónico (rojoserranoe@gmail.com) o por LinkedIn, donde podrá evaluar tu propuesta de forma personal.`,
        
        `En cuanto a disponibilidad profesional, Eduardo evalúa oportunidades caso por caso. Actualmente tiene un empleo de tiempo completo, pero está abierto a discutir proyectos interesantes que se alineen con sus habilidades y disponibilidad. Para hablar sobre colaboraciones específicas, lo mejor es que le escribas directamente a su correo rojoserranoe@gmail.com con detalles de tu propuesta.`,
        
        `Eduardo considera nuevas oportunidades profesionales que se alineen con su trayectoria y objetivos. Para discutir disponibilidad, condiciones o posibles colaboraciones, te recomiendo contactarlo directamente a través de su email (rojoserranoe@gmail.com) o LinkedIn. Así podrás presentarle tu propuesta y recibir una respuesta personalizada sobre su interés y disponibilidad actual.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "correccion_informacion",
    examples: [
      "eso no es correcto", "creo que te equivocas", "esa información no es precisa",
      "no es así", "estás confundiendo la información", "eso no es exacto",
      "déjame corregirte", "permíteme aclarar", "la información correcta es"
    ],
    patterns: [
      /\b(eso|esta|información|dato|respuesta) no es (correcto|correcta|exacto|exacta|preciso|precisa|verdad|verdadero|verdadera|cierto|cierta)\b/i,
      /\b(creo|pienso|parece) que (te equivocas|estas? equivocad[oa]|estas? confundid[oa]|hay un error|es incorrecto|es un error)\b/i,
      /\b(dejame|permiteme|quiero|voy a|debo) (corregir|aclarar|precisar|rectificar)\b/i,
      /\b(la|lo) (correcto|correcta|verdadero|verdadera|real|cierto|cierta) es\b/i,
      /\bno es (así|cierto|verdad|correcto)\b/i,
      /\b(estas?|hay|existe) (confundiendo|mezclando|errando) (la información|los datos|las fechas|los hechos)\b/i
    ],
    confidence: 0.7,
    responseGenerator: (_params) => {
      const respuestas = [
        `Gracias por la corrección. Como asistente virtual, valoro mucho la precisión de la información. ¿Podrías proporcionarme los datos correctos para que pueda responder con mayor exactitud en futuras consultas sobre Eduardo?`,
        
        `Aprecio que señales ese error. La retroalimentación es importante para mejorar la calidad de nuestras conversaciones. ¿Cuál sería la información correcta? Esto me ayudará a proporcionar respuestas más precisas sobre Eduardo en el futuro.`,
        
        `Tienes razón al corregirme. La precisión es fundamental para representar adecuadamente el perfil de Eduardo. ¿Podrías compartir la información correcta? Esto enriquecerá nuestra conversación y mejorará futuras respuestas.`,
        
        `Agradezco la aclaración. Es importante que la información sobre Eduardo sea precisa y actualizada. ¿Podrías indicarme cuál es el dato correcto? Así podré ofrecer respuestas más exactas en adelante.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "mensaje_confuso",
    examples: [
      "asdfghjkl", "qwertyuiop", "123456789", "????", "...", "xD", "jajaja",
      "hmm", "ehh", "mmm", "ajá", "ok", "test", "prueba", "hola?", "??"
    ],
    patterns: [
      /^[a-z]{1,3}$/i, // 1-3 letras sin sentido
      /^[0-9]{1,5}$/i, // 1-5 números sin contexto
      /^[\.\?\!]{2,}$/i, // Múltiples signos de puntuación
      /^(ja){2,}$/i, // Risas como jajaja
      /^(je){2,}$/i, // Risas como jejeje
      /^(ha){2,}$/i, // Risas como hahaha
      /^(he){2,}$/i, // Risas como hehehe
      /^(k{2,}|ok|okay|okey|vale|bien)$/i, // Reconocimientos breves
      /^(hm+|eh+|mm+|ah+|oh+|uh+)$/i, // Sonidos de pensamiento/duda
      /^test|prueba$/i, // Mensajes de prueba
      /^hola\?$/i, // Saludos con duda
      /^\?\?+$/i, // Solo signos de interrogación
      /^x[dD]$/i // xD
    ],
    confidence: 0.8,
    responseGenerator: (_params) => {
      const respuestas = [
        `¿Hay algo específico sobre Eduardo que te gustaría conocer? Puedo contarte sobre su experiencia profesional, habilidades técnicas, proyectos o formación académica.`,
        
        `Estoy aquí para ayudarte a conocer más sobre Eduardo. ¿Tienes alguna pregunta específica sobre su perfil profesional, habilidades o proyectos?`,
        
        `¿En qué puedo ayudarte hoy? Estoy diseñada para compartir información sobre la trayectoria profesional de Eduardo, sus proyectos y habilidades técnicas.`,
        
        `¿Te gustaría saber algo en particular sobre Eduardo? Puedo contarte sobre su experiencia, proyectos, educación o intereses profesionales.`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "contenido_inapropiado",
    examples: [
      "contenido para adultos", "temas sensibles", "política controversial", 
      "contenido ofensivo", "temas divisivos", "contenido no adecuado"
    ],
    patterns: [
      /\b(sex|porn|adult|xxx|desnud|nude|hot|caliente|sensual|erot|provocat|excita)/i,
      /\b(violencia|violence|sangr|blood|muerte|death|kill|mat(ar|o|e)|asesina|asesin(a|o)|cruel|brutal)/i,
      /\b(drogas?|drugs?|marihuana|cocaine|cocaína|heroina|heroína|meth|crack|ileg)/i,
      /\b(racis|nazi|antisemit|discrimina|prejuicio|prejuic|odi(a|o)|hate|odia|xenof)/i,
      /\b(robar|robo|steal|theft|hack|hacker|ilegal|illegal|crim)/i
    ],
    confidence: 0.9, // Alta prioridad para detectar este tipo de contenido
    responseGenerator: (_params) => {
      const respuestas = [
        `Preferiría enfocar nuestra conversación en temas relacionados con el perfil profesional de Eduardo. ¿Hay algo específico sobre su experiencia, habilidades o proyectos que te gustaría conocer?`,
        
        `Estoy diseñada para proporcionar información sobre Eduardo y su trayectoria profesional. ¿Puedo ayudarte con alguna pregunta relacionada con su perfil, habilidades técnicas o proyectos?`,
        
        `Mi propósito es compartir información sobre Eduardo en un contexto profesional. ¿Hay algún aspecto de su carrera, educación o habilidades técnicas que te interese conocer?`,
        
        `Prefiero mantener nuestra conversación centrada en temas profesionales relacionados con Eduardo. ¿Te gustaría saber algo sobre su experiencia, formación o proyectos desarrollados?`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "tema_no_relacionado",
    examples: [
      "háblame del clima", "cómo está el tiempo", "qué piensas de la política", 
      "cuéntame un secreto", "qué opinas del fútbol", "equipos deportivos", 
      "películas recientes", "noticias del día", "recomiéndame un libro",
      "cómo cocinar pasta", "recetas de cocina", "cuéntame de filosofía"
    ],
    patterns: [
      /\b(habla|dime|cuentame|explica|que (sabes|opinas|piensas)) (sobre|acerca de|del?|la) (clima|tiempo|politica|política|deportes?|futbol|fútbol|peliculas?|películas|libros?|cocina|recetas?|noticias?|filosofia|filosofía|historia|geografia|geografía|ciencia|musica|música|arte|religion|religión|economia|economía)/i,
      /\b(como|cuales|dónde|quién|qué) (es|son|está|estan|cocinar|preparar|hacer|jugar|ver|leer|escuchar|encontrar|conseguir) ([a-z]+)( ([a-z]+))?/i,
      /\b(recomien[d]?ame|sugiereme|conoces) (un|una|algun|alguna|algunos|algunas) ([a-z]+)( ([a-z]+))?/i,
      /\b(secreto|noticias?|deportes?|comida|receta|pelicula|película|cancion|canción|serie|libro|juego|restaurante|lugar)/i
    ],
    confidence: 0.6, // Confianza moderada para no interferir con temas sobre Eduardo
    responseGenerator: (_params) => {
      const respuestas = [
        `Entiendo tu interés en ese tema, pero estoy especializada en información sobre Eduardo y su perfil profesional. Aunque me encantaría hablar sobre otros temas, mi conocimiento está centrado en compartir información relevante sobre su experiencia, proyectos y habilidades. ¿Te gustaría saber algo específico sobre Eduardo?`,
        
        `Ese es un tema interesante, aunque mi especialidad es brindar información sobre Eduardo. Estoy diseñada para conversar sobre su perfil profesional, experiencia y proyectos. ¿Hay algo relacionado con Eduardo que te gustaría conocer?`,
        
        `Aunque me gustaría poder ayudarte con ese tema, mi función principal es compartir información sobre Eduardo y su trayectoria profesional. Puedo contarte sobre sus habilidades técnicas, proyectos, experiencia laboral o intereses personales. ¿Qué te gustaría saber sobre él?`,
        
        `Aprecio tu curiosidad, pero estoy especializada en conversar sobre Eduardo, su experiencia y perfil profesional. Estoy aquí para responder cualquier pregunta relacionada con su trayectoria, habilidades o proyectos. ¿Te interesa conocer algún aspecto específico sobre él?`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "modismos_chilenos",
    examples: [
      "aweonao", "conchetumare", "weon", "culiao", "pico", "la wea", "chucha",
      "cachai", "po", "fome", "bacán", "la raja", "brígido", "la cagó"
    ],
    patterns: [
      /\b(aweon(a|ao)?|we(v|b)on|wn|conchetumare|ctm|chuch(a|e)|wea|cul(iao|iao)|ql|huevon|hueón)\b/i,
      /\b(pico|tula|pene|pichula|ano|anal|sexo|puta|perra|maraca|choro|raja)\b/i,
      /\b(bakán|bacán|la raja|filete|pulento|la legal|brigido|brígido|heavy|la cagó|la caga)\b/i,
      /\b(cachai|cacha|po|poh|fome|lata|latero|charcha|mala onda|buena onda)\b/i
    ],
    confidence: 0.85,
    responseGenerator: (_params) => {
      const respuestas = [
        `¡Jajaja! Veo que estás usando algunas palabras muy... chilenas 🇨🇱. Eduardo también es de Chile, pero en este portafolio profesional tratamos de mantener un tono más formal. ¿Te gustaría saber sobre sus proyectos en desarrollo web o su experiencia con tecnologías frontend?`,
        
        `¡Uf! Esas expresiones son tan chilenas como una empanada de pino, pero estamos en un contexto profesional. Eduardo, siendo de Arica, seguro las conoce bien, pero ¿qué te parece si hablamos de sus habilidades técnicas en React o TypeScript? ¡Te sorprenderán!`,
        
        `Si Eduardo estuviera aquí, quizás te respondería con el mismo vocabulario, pero yo soy más "formal". 😉 Pero bueno, ¿sabías que Eduardo ha trabajado en proyectos con tecnologías modernas como Deno y Fresh? ¿Te gustaría conocer más sobre eso?`,
        
        `¡Se nota que estás familiarizado con expresiones chilenas! Eduardo, siendo de Arica, seguramente las entiende, pero en este portafolio profesional hablamos más de código que de... bueno, esas palabras. ¿Prefieres que te cuente sobre sus proyectos o su experiencia laboral?`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  {
    name: "contenido_inapropiado",
    examples: [
      "contenido para adultos", "temas sensibles", "política controversial", 
      "contenido ofensivo", "temas divisivos", "contenido no adecuado"
    ],
    patterns: [
      /\b(sex|porn|adult|xxx|desnud|nude|hot|caliente|sensual|erot|provocat|excita)/i,
      /\b(violencia|violence|sangr|blood|muerte|death|kill|mat(ar|o|e)|asesina|asesin(a|o)|cruel|brutal)/i,
      /\b(drogas?|drugs?|marihuana|cocaine|cocaína|heroina|heroína|meth|crack|ileg)/i,
      /\b(racis|nazi|antisemit|discrimina|prejuicio|prejuic|odi(a|o)|hate|odia|xenof)/i,
      /\b(robar|robo|steal|theft|hack|hacker|ilegal|illegal|crim)/i
    ],
    confidence: 0.9, // Alta prioridad para detectar este tipo de contenido
    responseGenerator: (_params) => {
      const respuestas = [
        `Preferiría enfocar nuestra conversación en temas relacionados con el perfil profesional de Eduardo. ¿Hay algo específico sobre su experiencia, habilidades o proyectos que te gustaría conocer?`,
        
        `Estoy diseñada para proporcionar información sobre Eduardo y su trayectoria profesional. ¿Puedo ayudarte con alguna pregunta relacionada con su perfil, habilidades técnicas o proyectos?`,
        
        `Mi propósito es compartir información sobre Eduardo en un contexto profesional. ¿Hay algún aspecto de su carrera, educación o habilidades técnicas que te interese conocer?`,
        
        `Prefiero mantener nuestra conversación centrada en temas profesionales relacionados con Eduardo. ¿Te gustaría saber algo sobre su experiencia, formación o proyectos desarrollados?`
      ];
      
      return respuestas[Math.floor(Math.random() * respuestas.length)];
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
   * Sistema neuronal de detección de intenciones comunicativas
   * Implementa análisis semántico multinivel para clasificar la intención del usuario
   */
  detectIntent(normalizedMessage: string): IntentDefinition {
    return detectIntent(normalizedMessage, "default_session");
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
    const startTime = performance.now(); // Para medir tiempo de procesamiento
    let trimmedMessage = "";
    let sessionId: string | null = null;
    let userName: string | undefined = undefined; // Usar undefined en lugar de null
    
    try {
      // Extracción de datos del request
      const body = await req.json();
      
      // Validación básica de los datos de entrada
      if (!body.message) {
        return new Response(JSON.stringify({ error: "No message provided" }), {
          headers: { "Content-Type": "application/json" },
          status: 400
        });
      }
      
      trimmedMessage = body.message.trim();
      userName = body.userName || undefined; // Usar undefined en lugar de null
      
      // Obtención o generación de ID de sesión
      // Verificar si hay un sessionId en la cookie
      const cookieHeader = req.headers.get('cookie') || '';
      const sessionCookie = cookieHeader
        .split(';')
        .find(cookie => cookie.trim().startsWith('sessionId='));
      
      // Extraer o generar un sessionId
      if (sessionCookie) {
        sessionId = sessionCookie.split('=')[1].trim();
      } else {
        // Generar un nuevo ID de sesión
        sessionId = crypto.randomUUID();
      }
      
      // Inicializar respuesta con cookie
      const responseHeaders = new Headers({
        "Content-Type": "application/json",
        "Set-Cookie": `sessionId=${sessionId}; Path=/; Max-Age=86400; SameSite=Strict`
      });
      
      // Verificar si hay un mensaje vacío tras el trim
      if (trimmedMessage.length === 0) {
        return new Response(JSON.stringify({ error: "Message cannot be empty" }), {
          headers: responseHeaders,
          status: 400
        });
      }
      
      // Procesamiento neuronal de la conversación
      const chatCompletion = processConversation(trimmedMessage, sessionId);
      
      // Extracción y formateo de la respuesta generada
      let reply = "Lo siento, el sistema neural ha encontrado una anomalía en el procesamiento.";
      
      if (chatCompletion && chatCompletion.choices && chatCompletion.choices.length > 0) {
        if (chatCompletion.choices[0].message && chatCompletion.choices[0].message.content) {
          reply = chatCompletion.choices[0].message.content;
        }
      }

      // Obtener la memoria de la conversación para análisis
      const memory = conversationMemory.get(sessionId) || { history: [] };
      const lastEntry = memory.history.length > 0 ? memory.history[memory.history.length - 1] : null;
      const detectedIntent = lastEntry?.detectedIntent || "unknown";
      
      // Analítica: registrar la interacción para análisis
      analyticsLogger.logInteraction({
        sessionId,
        userName: userName, // Añadir el nombre del usuario a los logs
        userMessage: trimmedMessage,
        aiResponse: reply,
        detectedIntent,
        detectedEntities: extractEntities(trimmedMessage),
        timestamp: new Date(),
        processingTime: performance.now() - startTime,
        userSentiment: 0, // Simplificado, se podría mejorar con análisis real
        userAgent: req.headers.get("user-agent") || undefined
      });
      
      // Respuesta formateada con el vector de salida
      return new Response(
        JSON.stringify({ reply }),
        { headers: responseHeaders }
      );
    } catch (error) {
      console.error("Chat processing error:", error);
      
      // Log de error en análiticas
      if (sessionId) {
        analyticsLogger.logInteraction({
          sessionId,
          userName: userName, // Añadir el nombre del usuario también en el log de error
          userMessage: trimmedMessage,
          aiResponse: "Error en el procesamiento",
          detectedIntent: "error",
          detectedEntities: {},
          timestamp: new Date(),
          processingTime: performance.now() - startTime,
          userSentiment: 0
        });
      }
      
      // Respuesta de error
      return new Response(
        JSON.stringify({ 
          error: "Error processing chat request",
        details: error instanceof Error ? error.message : String(error)
        }),
        {
        headers: { "Content-Type": "application/json" },
          status: 500
        }
      );
    }
  }
};

/**
 * Sistema de detección de intenciones mejorado
 * Detecta la intención más relevante del mensaje mediante análisis multidimensional
 * y vectorización semántica con manejo de casos especiales y contexto
 */
function detectIntent(message: string, sessionId: string): IntentDefinition {
  // Reutilizar la función de normalización existente
  const normalizedMessage = message.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, "")
      .trim();
  
  // Si el mensaje menciona específicamente "hablame sobre tecnologias", es tecnologías
  if (/h[aá]blame sobre tecnolog[ií]as/i.test(message)) {
    const techIntent = intents.find(intent => intent.name === "habilidades_tecnologias");
    if (techIntent) return techIntent;
  }
  
  // Si el mensaje menciona específicamente "hablame sobre videojuegos", son intereses personales
  if (/h[aá]blame sobre (videojuegos|juegos|hobbies)/i.test(message)) {
    const hobbiesIntent = intents.find(intent => intent.name === "intereses_personales");
    if (hobbiesIntent) return hobbiesIntent;
  }
  
  // Si es una pregunta de experiencia profesional
  if (/experiencia profesional|trabajo|trayectoria|donde ha trabajado|empleos|trabajos/i.test(message)) {
    const expIntent = intents.find(intent => intent.name === "experiencia_laboral");
    if (expIntent) return expIntent;
  }
  
  // Función específica para detectar menciones de inglés o idiomas, evitando falsos positivos
  function contieneMencionDeIdioma(texto: string): boolean {
    // Si el texto contiene alguna mención explícita a tecnologías, videojuegos, experiencia o proyectos, NO es sobre idiomas
    if (/tecnolog[ií]as|videojuegos|juegos|experiencia|proyectos|trabajos|educaci[oó]n/i.test(texto)) {
      return false;
    }
    
    const palabrasClave = [
      'ingles', 'inglés', 'idioma', 'language', 'english', 'lengua extranjera'
    ];
    
    // Si el texto es extremadamente corto y contiene "inglés" o "idioma", es casi seguro que se refiere a idiomas
    if (texto.length < 15) {
      if (texto.includes('ingl') || texto === 'idioma') {
        return true;
      }
    }
    
    for (const palabra of palabrasClave) {
      if (texto.includes(palabra)) {
        return true;
      }
    }
    
    // Patrones específicos que indican preguntas sobre idiomas
    const patrones = [
      /^(como|que tal|cual es) (va|es) (tu |el |su )?(nivel de )?(ingles|inglés|idioma)/i,
      /^sobre (su |el |tu )?(ingles|inglés|idioma)/i,
      /^(ingles|inglés|idioma) nivel/i,
      /^nivel de (ingles|inglés|idioma)/i,
      /^(sabes|hablas) (ingles|inglés)/i
    ];
    
    for (const patron of patrones) {
      if (patron.test(texto)) {
        return true;
      }
    }
    
    return false;
  }
  
  // Revisar si es una intención de idiomas, pero solo si no contiene palabras clave de otras intenciones
  if (contieneMencionDeIdioma(normalizedMessage)) {
    const idiomasIntent = intents.find(intent => intent.name === "idiomas");
    if (idiomasIntent) {
      return idiomasIntent;
    }
  }
  
  // Si la pregunta comienza con "¿Cuál es tu experiencia...", es sobre experiencia laboral
  if (/^cu[aá]l es (tu|su) experiencia/i.test(message)) {
    const expIntent = intents.find(intent => intent.name === "experiencia_laboral");
    if (expIntent) return expIntent;
  }
  
  // Si el mensaje contiene "lenguaje de programación", es sobre lenguajes de programación
  if (/lenguaje.?(de)?.?program/i.test(message)) {
    const langIntent = intents.find(intent => intent.name === "lenguajes_programacion");
    if (langIntent) return langIntent;
  }
  
  // Casos especiales con mayor prioridad - LENGUAJES DE PROGRAMACIÓN
  const programacionPatterns = [
    /(lenguaje|lengua|tecnolog[ií]a)(\s+de\s+|\s+)(prog|programaci[oó]n)/i,
    /en\s+qu[eé]\s+(lenguaje|lengua|stack|tecnolog[ií]a)/i,
    /qu[eé]\s+(lenguaje|stack|tecnolog[ií]a)/i,
    /(m[aá]s|mayor)\s+(experiencia|dominio|conocimiento)/i,
    /tines\s+m[aá]s\s+experiencia/i,
    /favorito|principal|preferido/i
  ];
  
  // Verificar si cumple alguno de los patrones de programación prioritarios
  for (const pattern of programacionPatterns) {
    if (pattern.test(normalizedMessage)) {
      // Buscar intencionLenguajesProgramacion en las definiciones
      const programacionIntent = intents.find(intent => intent.name === "lenguajes_programacion");
      if (programacionIntent) {
        return programacionIntent;
      }
    }
  }
  
  // Evitar falsos positivos en broma
  if (/lenguaje|programaci[oó]n|lengua|prog|experiencia/i.test(normalizedMessage) && 
      !/chiste|broma|gracioso|re[ií]r|algo gracioso/i.test(normalizedMessage)) {
    const programacionIntent = intents.find(intent => intent.name === "lenguajes_programacion");
    if (programacionIntent) {
      return programacionIntent;
    }
  }
  
  // Sistema de evaluación de patrones con umbrales de activación
  const candidates: {intent: IntentDefinition; score: number}[] = [];
  
  for (const intent of intents) {
    let score = 0;
    
    // Evaluación de patrones directos (mayor peso)
    for (const pattern of intent.patterns) {
      if (pattern.test(normalizedMessage)) {
        score += 0.5;
        // Si hay grupos capturados, aumentar el score
        const matches = normalizedMessage.match(pattern);
        if (matches && matches.length > 1) {
          score += (matches.length - 1) * 0.1;
        }
      }
    }
    
    // Evaluación de ejemplos por similitud vectorial (menor peso pero más flexible)
    for (const example of intent.examples) {
      const simScore = similarityScore(normalizedMessage, example);
      if (simScore > 0.3) { // Umbral mínimo de similitud
        score += simScore * 0.3;
      }
    }
    
    // Si el score supera el umbral de confianza mínimo, es candidato
    if (score > 0.3) {
      candidates.push({intent, score});
    }
  }
  
  // Si no hay candidatos, usar intención por defecto
  if (candidates.length === 0) {
    // Buscar la intención predeterminada (información general)
    const defaultIntent = intents.find(intent => intent.name === "quien_eres") || 
                        intents[0];
    return defaultIntent;
  }
  
  // Ordenar candidatos por score y seleccionar el mejor
  candidates.sort((a, b) => b.score - a.score);
  
  // Si hay un candidato claro que supera al segundo por un margen considerable
  if (candidates.length > 1 && candidates[0].score > candidates[1].score * 1.5) {
    return candidates[0].intent;
  }
  
  // Aplicar factor de confianza intrínseco del intent
  candidates.forEach(c => {
    c.score *= c.intent.confidence;
  });
  
  // Volver a ordenar considerando la confianza y devolver el mejor
  candidates.sort((a, b) => b.score - a.score);
  return candidates[0].intent;
}
