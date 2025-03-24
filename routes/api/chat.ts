import { Handlers } from "$fresh/server.ts";

// Configuración para usar Hugging Face
const USAR_HUGGINGFACE = true; // Activado para usar modelos abiertos

// API Token de Hugging Face 
// Token obtenido de la cuenta de Hugging Face
// Ya no lo usamos directamente, pero lo mantenemos por compatibilidad
const _HUGGINGFACE_TOKEN = Deno.env.get("HUGGINGFACE_TOKEN") || "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";

// Sistema de memoria para recordar el contexto de la conversación
// Almacena la última pregunta que contenía una invitación a saber más
let lastContextQuestion = "";
let lastContextTopic = "";

// Función para generar respuestas inteligentes basadas en palabras clave
function generateSmartResponse(userMessage: string, _systemPrompt: string) {
  // Normalizar el mensaje del usuario (minúsculas, sin acentos)
  const normalizedMessage = userMessage.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Verificar primero si el mensaje contiene contenido inapropiado
  const contenidoInapropiado = /\b(desnudo|desnuda|novia|novio|sexo|sexual|casado|soltero|salir conmigo|dame tu numero|telefono|cita|besame|enamorado|hot|caliente|xxx|porno)\b/i.test(userMessage);
  
  if (contenidoInapropiado) {
    const respuestas = [
      `Entiendo tu pregunta, pero me especializo en compartir información sobre Eduardo como profesional. ¿Te gustaría saber más sobre sus proyectos en desarrollo web o sus habilidades técnicas? 💻✨`,
      `Gracias por tu mensaje. Estoy aquí para hablar sobre las habilidades profesionales de Eduardo y sus proyectos. ¿Puedo contarte sobre su experiencia con JavaScript, TypeScript o alguna otra tecnología? 👨‍💻`,
      `Me encantaría ayudarte con información sobre la carrera de Eduardo como ingeniero en informática. ¿Qué te interesa más: sus proyectos, su formación o sus habilidades técnicas? 📚🔍`,
      `¡Hola! Estoy aquí para compartir información sobre el trabajo de Eduardo en desarrollo web y sus proyectos. ¿Hay algo específico de su perfil profesional que te gustaría conocer? 🛠️💡`
    ];
    return respuestas[Math.floor(Math.random() * respuestas.length)];
  }
  
  // Información sobre Eduardo extraída del SYSTEM_PROMPT
  const eduardoInfo = {
    nombre: "Eduardo",
    profesion: "ingeniero en informática",
    educacion: "graduado de Ingeniería en Informática de Santo Tomás Arica con distinción máxima (2018-2023)",
    tesis: "aplicación de hábitos de estudio en React Native, calificado con 6,9",
    experiencia: "desde 2016, comenzando en el liceo Antonio Varas de la Barra",
    habilidades: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", "PHP", "C++", "C#", "Blazor", "React Native", "Figma", "Fresh", "Deno"],
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
    }
  };
  
  // Categorías de preguntas y sus correspondientes generadores de respuestas
  const responseGenerators = [
    // Saludos normales
    {
      match: (msg: string) => /\b(hola|hi|volvi|he vuelto|estoy de regreso|regreso|hello|saludos|hey|oa|buenas|hey|konichiwa|bonjour|ciao|que tal|como va|que pasa|que hay|que dice|que onda|que hubo|que lo que|wena|wenas|buenos dias|buenas tardes|buenas noches|que hubo|como andas)\b/i.test(msg) && !/\b(como estas|como te va|como te sientes|como te encuentras|como andas|como va todo|como te tratan|como te ha ido|como te trata la vida|como va tu dia|como va tu vida|como te va en la vida|que tal estas|que tal te va|que tal te sientes|que tal andas|que tal todo|que tal tu dia|que tal tu vida|estas bien|te sientes bien|todo bien|va todo bien|eres feliz|te gusta|te diviertes|te aburres|te cansas)\b/i.test(msg),
      generate: () => {
        const saludos = [
          `¡Hola! soy SobremIA, entrenado con información de ${eduardoInfo.nombre}, ¿En qué puedo ayudarte hoy? ¿Quieres saber sobre sus habilidades o proyectos? 🚀`,
          `¡Hola! Encantado de conocerte. Estoy aquí para contarte sobre ${eduardoInfo.nombre}, un ${eduardoInfo.profesion} con experiencia ${eduardoInfo.experiencia}. ¿Qué te gustaría saber? 😊`,
          `¡Hey! Soy SobremIA, entrenado con información de ${eduardoInfo.nombre}. Puedo contarte sobre su experiencia, habilidades o proyectos. ¿Qué te interesa más? 💻`,
          `¡Saludos terráqueo! Soy SobreMIA asistente de ${eduardoInfo.nombre}, lista para informarte sobre este increíble ${eduardoInfo.profesion}. ¿Qué quieres descubrir? 🖖`,
          `¡Qué tal! Bienvenido/a a la experiencia virtual de ${eduardoInfo.nombre} SobremIA. Estoy a tus órdenes para contarte todo sobre él. ¿Por dónde quieres empezar? 🌟`,
          `¡Buenas! ¿Cómo te va? Soy el cerebro digital que conoce todo sobre ${eduardoInfo.nombre}. ¿Quieres conocer su experiencia, proyectos o habilidades? 🧠`
        ];
        return saludos[Math.floor(Math.random() * saludos.length)];
      }
    },
    // Preguntas personales a SobreMIA
    {
      match: (msg: string) => /\b(como estas|como te va|como te sientes|como te encuentras|que haces| k tal| como tas|como andas|como va todo|como te tratan|como te ha ido|como te trata la vida|como va tu dia|como va tu vida|como te va en la vida|que tal estas|que tal te va|que tal te sientes|que tal andas|que tal todo|que tal tu dia|que tal tu vida|estas bien|te sientes bien|todo bien|va todo bien|eres feliz|te gusta|te diviertes|te aburres|te cansas|como estas\?)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `¡Estoy muy bien, gracias por preguntar! Como asistente virtual, siempre estoy listo para ayudarte. ¿En qué puedo informarte sobre ${eduardoInfo.nombre} hoy? 😄`,
          `Me encuentro perfectamente, ¡gracias por tu interés! Mi propósito es brindarte información sobre ${eduardoInfo.nombre} y su trabajo. ¿Hay algo específico que te gustaría saber? 🤗`,
          `¡Todo excelente por aquí! Disfruto mucho compartiendo información sobre ${eduardoInfo.nombre} y sus proyectos. ¿Qué te gustaría conocer sobre su experiencia o habilidades? 🚀`,
          `¡Genial! Estoy disfrutando nuestra conversación. Mi función es ayudarte a conocer más sobre ${eduardoInfo.nombre}, así que pregúntame lo que quieras sobre él. 🤓`,
          `¡Muy bien! Aunque lo importante es que pueda responder tus preguntas sobre ${eduardoInfo.nombre}. Soy experto en su perfil profesional, proyectos y habilidades. ¿Qué te interesa saber? 💻`,
          `¡Funcionando al 100%! Estoy aquí para contarte todo sobre ${eduardoInfo.nombre}, desde su experiencia laboral hasta sus proyectos más recientes. ¿Por dónde quieres empezar? 📈`
        ];
        
        // Si hay múltiples palabras clave en el mensaje, podemos enviar dos mensajes
        const keywordCount = (normalizedMessage.match(/\b(como estas|eres feliz|te gusta|te diviertes|te aburres|te cansas)\b/gi) || []).length;
        
        if (keywordCount > 1) {
          const primerRespuesta = respuestas[Math.floor(Math.random() * respuestas.length)];
          const segundaRespuesta = `Y recuerda que puedo contarte sobre la experiencia de ${eduardoInfo.nombre} en diferentes empresas, sus proyectos actuales, su formación académica y mucho más. ¡Pregúntame lo que quieras saber! 👍`;
          
          return primerRespuesta + "\n\n" + segundaRespuesta;
        }
        
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Saludos sin H (ola)
    {
      match: (msg: string) => /\bola\b/i.test(msg) && !/\bhola\b/i.test(msg),
      generate: () => {
        const saludosGraciosos = [
          `¡OLA! 🌊 ¿Te comiste la H o te la llevó la marea? Jajaja, no pasa nada. Soy la IA de ${eduardoInfo.nombre}. ¿Qué quieres saber de él? Aparte de ortografía, claro... 😜`,
          `¡OLA! 🏄‍♂️ ¿Surfeando sin la H? ¡Qué rebelde! Bueno, yo soy quien conoce todo sobre ${eduardoInfo.nombre}. ¿En qué te puedo ayudar hoy? ¡Y no te preocupes, tu secreto de la H perdida está a salvo conmigo! 🤐`,
          `¡OLA sin H! ¿Estamos ahorrando letras para el futuro? 🌊 Muy ecológico de tu parte. Soy la IA de ${eduardoInfo.nombre}, y estoy aquí para contarte todo sobre él. ¿Qué quieres saber? 😂`,
          `¡OLA! 🌊 Parece que la H se fue de vacaciones... ¡Ojalá nos hubiera invitado! Soy la asistente virtual de ${eduardoInfo.nombre}, lista para responder tus preguntas sobre su trabajo y habilidades. ¿Qué te interesa saber? 🏝️`
        ];
        return saludosGraciosos[Math.floor(Math.random() * saludosGraciosos.length)];
      }
    },
    // Sobre Eduardo
    {
      match: (msg: string) => /\b(eduardo|quien es|quien eres|sobre ti|acerca|cuentame|pagina)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} es un ${eduardoInfo.profesion} ${eduardoInfo.educacion}. Tiene experiencia ${eduardoInfo.experiencia} y domina tecnologías como ${eduardoInfo.habilidades.slice(0, 3).join(", ")} y más. 🎓`,
          `${eduardoInfo.nombre} es un apasionado desarrollador con experiencia ${eduardoInfo.experiencia}. Se graduó con distinción máxima de Ingeniería en Informática y su proyecto de tesis fue una ${eduardoInfo.tesis}. 💪`,
          `${eduardoInfo.nombre} es un ${eduardoInfo.profesion} especializado en ${eduardoInfo.intereses}. Ha trabajado en proyectos de ${eduardoInfo.proyectos.join(", ")}. 🌐`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Habilidades
    {
      match: (msg: string) => /\b(habilidades|skills|tecnologias|lenguajes|programacion|sabe|conoce)\b/i.test(msg),
      generate: () => {
        // Seleccionar aleatoriamente subconjuntos de habilidades para variar las respuestas
        const randomSkills1 = eduardoInfo.habilidades.slice(0, 5);
        const randomSkills2 = eduardoInfo.habilidades.slice(5, 10);
        
        const respuestas = [
          `${eduardoInfo.nombre} domina ${eduardoInfo.habilidades.join(", ")}. ¡Un stack tecnológico bastante completo! 🛠️`,
          `Las habilidades de ${eduardoInfo.nombre} incluyen desarrollo web con ${randomSkills1.join(", ")}, y también tiene experiencia con ${randomSkills2.join(", ")}. 💻`,
          `${eduardoInfo.nombre} es experto en varias tecnologías: ${eduardoInfo.habilidades.slice(0, 7).join(", ")}, entre otras. Le gusta especialmente el ${eduardoInfo.intereses}. 🚀`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Experiencia general
    {
      match: (msg: string) => /\b(experiencia|que hace|trabajo|carrera|profesional|laboral|chamba|chambeo)\b/i.test(msg) && !/\b(hospital|juan noe|istyle|apple|mac|leonardo|da vinci|tisa|ancestral|ultracropcare|mercado e|second mind)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} tiene una amplia experiencia laboral en distintos sectores. Ha trabajado en el Hospital Juan Noé Crevani como soporte técnico, en iStyle Store como especialista en productos Apple, en el Colegio Leonardo Da Vinci como coordinador de enlaces, en TISA (The International School Arica) para mejorar la digitalización, y actualmente trabaja en Ancestral Technologies/UltraCropCare. Además, ganó el primer lugar en innovación en Mercado E 2023 con Second Mind. 📈`,
          `La experiencia de ${eduardoInfo.nombre} es diversa y enriquecedora. Ha pasado por el sector salud (Hospital Juan Noé), retail tecnológico (iStyle Store), educación (Colegios Leonardo Da Vinci y TISA) y actualmente se desempeña en Ancestral Technologies/UltraCropCare. También fue reconocido en Mercado E 2023, donde su proyecto Second Mind obtuvo el primer lugar en innovación. ⚙️`,
          `${eduardoInfo.nombre} ha desarrollado su carrera profesional en diversos ámbitos: soporte técnico hospitalario, especialista en productos Apple, coordinación tecnológica en educación y actualmente en el sector tecnológico con Ancestral Technologies/UltraCropCare. Su versatilidad le ha permitido adaptarse a diferentes entornos laborales y destacar en cada uno de ellos, como lo demuestra su premio en Mercado E 2023. 🔍`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Hospital Juan Noé
    {
      match: (msg: string) => /\b(hospital|juan noe|soporte|tecnico|salud)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} trabajó en el Hospital Juan Noé Crevani de Arica como soporte técnico. Allí brindó asistencia tecnológica al personal médico y administrativo, asegurando el correcto funcionamiento de los sistemas informáticos esenciales para la atención de pacientes. 🏥💻`,
          `En el Hospital Juan Noé Crevani, ${eduardoInfo.nombre} se desempeñó como técnico de soporte, donde adquirió valiosa experiencia en entornos críticos donde la tecnología debe funcionar sin interrupciones. Esta experiencia le enseñó a trabajar bajo presión y a resolver problemas de forma eficiente. 👨‍⚕️🖥️`,
          `La experiencia de ${eduardoInfo.nombre} en el Hospital Juan Noé Crevani como soporte técnico le permitió comprender la importancia de la tecnología en el sector salud. Su labor fue fundamental para mantener operativos los sistemas que dan soporte a la atención médica en uno de los principales centros de salud de Arica. 💉💻`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // iStyle Store
    {
      match: (msg: string) => /\b(istyle|apple|mac|macintosh|iphone|ipad|imac|tecnico especialista)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} trabajó en iStyle Store como técnico especialista en productos Apple. Su conocimiento abarcaba toda la gama de dispositivos: Mac, iPhone, iPad e iMac. Allí desarrolló habilidades avanzadas en diagnóstico y solución de problemas en el ecosistema Apple. 💻📱`,
          `En iStyle Store, ${eduardoInfo.nombre} se especializó en la reparación y mantenimiento de productos Apple. Su experiencia con Mac, iPhone, iPad e iMac le permitió adquirir un profundo conocimiento técnico sobre estos dispositivos y sus sistemas operativos, convirtiéndose en un experto del ecosistema Apple. 🖥️📲`,
          `Como técnico especialista en iStyle Store, ${eduardoInfo.nombre} trabajó con toda la gama de productos Apple: Mac, Macintosh, iPhone, iPad e iMac. Esta experiencia le permitió desarrollar habilidades técnicas avanzadas y un profundo entendimiento de los sistemas operativos de Apple, conocimientos que aplica en sus proyectos actuales. 🍎🔧`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Colegio Leonardo Da Vinci
    {
      match: (msg: string) => /\b(leonardo|da vinci|colegio|coordinador|enlaces|davinci)\b/i.test(msg) && !/\b(tisa)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} trabajó en el Colegio Leonardo Da Vinci como coordinador de enlaces. En este rol, fue responsable de implementar y gestionar soluciones tecnológicas para mejorar los procesos educativos, facilitando la integración de la tecnología en el aula. 🏫💻`,
          `En el Colegio Leonardo Da Vinci, ${eduardoInfo.nombre} se desempeñó como coordinador de enlaces, donde implementó estrategias para integrar la tecnología en la educación. Su trabajo contribuyó significativamente a modernizar los métodos de enseñanza y a mejorar la experiencia educativa de los estudiantes. 📚🖥️`,
          `Como coordinador de enlaces en el Colegio Leonardo Da Vinci, ${eduardoInfo.nombre} lideró iniciativas para incorporar herramientas digitales en el proceso educativo. Su visión innovadora permitió transformar las prácticas pedagógicas tradicionales, preparando a los estudiantes para un mundo cada vez más digital. 👨‍🏫📱`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // TISA (The International School Arica)
    {
      match: (msg: string) => /\b(tisa|international|school|arica|digitalizacion|colegio)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} colaboró brevemente con TISA (The International School Arica) para mejorar sus procesos de digitalización. Su intervención ayudó a modernizar los sistemas administrativos y educativos del colegio. 🏫💾`,
          `En TISA (The International School Arica), ${eduardoInfo.nombre} realizó una breve pero impactante colaboración enfocada en la digitalización de procesos. Su trabajo permitió al colegio adoptar herramientas tecnológicas que mejoraron tanto la gestión administrativa como la experiencia educativa. 🇺🇸💻`,
          `${eduardoInfo.nombre} participó en un proyecto de digitalización en TISA (The International School Arica). Aunque fue una colaboración breve, logró implementar mejoras significativas en los sistemas digitales del colegio, optimizando procesos y facilitando la transición hacia un entorno educativo más tecnológico. 🔎📚`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Ancestral Technologies / UltraCropCare
    {
      match: (msg: string) => /\b(ancestral|technologies|ultracropcare|at|ucc|actual|ancestrl|ultracrop|ultra|crop|agro|agriculture|desert|wakilabs|waki)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `Actualmente, ${eduardoInfo.nombre} trabaja en Ancestral Technologies, también conocida como UltraCropCare (AT, UCC). En esta empresa, aplica sus conocimientos tecnológicos para desarrollar soluciones innovadoras en el sector agrícola. 🌾💻`,
          `${eduardoInfo.nombre} se desempeña actualmente en Ancestral Technologies/UltraCropCare (AT, UCC), donde combina su experiencia en tecnología con aplicaciones prácticas para el sector agrícola. Su trabajo contribuye a la modernización y optimización de procesos en este importante sector. 🌱🖥️`,
          `En su rol actual en Ancestral Technologies/UltraCropCare (AT, UCC), ${eduardoInfo.nombre} desarrolla soluciones tecnológicas innovadoras para la agricultura. Su trabajo está ayudando a transformar prácticas tradicionales mediante la implementación de tecnologías avanzadas que mejoran la eficiencia y sostenibilidad. 👨‍💻🌽`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Mercado E 2023 / Second Mind
    {
      match: (msg: string) => /\b(mercado e|second mind|innovacion|premio|primer lugar|2023)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} participó en Mercado E 2023, donde su proyecto Second Mind ganó el primer lugar en innovación. Este reconocimiento destaca su capacidad para desarrollar soluciones creativas y disruptivas. 🏆💡`,
          `En Mercado E 2023, ${eduardoInfo.nombre} logró un importante reconocimiento al obtener el primer lugar en innovación con su proyecto Second Mind. Este logro demuestra su talento para conceptualizar y desarrollar ideas que destacan por su originalidad y potencial de impacto. 🥇💼`,
          `El proyecto Second Mind de ${eduardoInfo.nombre} fue galardonado con el primer lugar en innovación en Mercado E 2023. Este premio reconoce la visión creativa y la excelencia técnica que ${eduardoInfo.nombre} aporta a sus proyectos, posicionándolo como un profesional innovador en su campo. 💸🚀`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Proyecto Mundo Animal / Mascotas
    {
      match: (msg: string) => /\b(mundo animal|mascotas|peluqueria|peluquería|canina|perros|gatos|inventarios|domicilio|agenda|citas|veterinaria)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} está planeando un interesante proyecto para un local de mascotas que incluye una agenda para la peluquería canina y un sistema de inventarios completo con envío a domicilio. Este sistema optimizará la gestión de citas y el control de stock. 🐶🐱`,
          `Uno de los proyectos en desarrollo de ${eduardoInfo.nombre} es un sistema integral para un negocio de mascotas. La solución incluye un módulo de agenda para la peluquería canina que permite programar citas eficientemente, y un sistema de inventarios con funcionalidad de envío a domicilio. 🏠🐾`,
          `${eduardoInfo.nombre} está trabajando en una solución tecnológica para el sector de mascotas que combina gestión de citas para peluquería canina con un completo sistema de inventarios que incluye envíos a domicilio. Este proyecto busca digitalizar y optimizar la operación del negocio. 📱🐕`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Proyectos Portuarios
    {
      match: (msg: string) => /\b(puerto|puertos|ultraport|tpa|terminal|portuario|maritimo|marítimo|barco|contenedor|contenedores|naviera|navieras)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} está involucrado en proyectos confidenciales del sector portuario. Estos proyectos se enfocan en dos áreas principales: la digitalización y optimización de operaciones mediante integraciones web, y la migración de sistemas legacy a plataformas modernas. Por razones de confidencialidad, no puede compartir detalles específicos. 🚢💻`,
          `En el ámbito portuario, ${eduardoInfo.nombre} participa en dos proyectos estratégicos confidenciales: uno orientado a optimizar las operaciones portuarias mediante soluciones digitales e integraciones web, y otro enfocado en la migración de software legacy. Estos proyectos buscan modernizar y eficientizar los procesos portuarios. 🏗️🖥️`,
          `${eduardoInfo.nombre} colabora en proyectos confidenciales para el sector portuario que abarcan dos líneas de trabajo: la implementación de soluciones digitales para optimizar operaciones mediante integraciones web, y la actualización de sistemas legacy. Por acuerdos de confidencialidad, no puede revelar información detallada sobre estos proyectos. ⚓🔒`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Educación
    {
      match: (msg: string) => /\b(educacion|estudios|universidad|titulo|carrera|grado|ingeniero|informatico|informático|santo tomás|uta|santo tomas|santo|tomás)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} es ${eduardoInfo.educacion}. Su tesis fue ${eduardoInfo.tesis}. 🎓`,
          `${eduardoInfo.nombre} estudió Ingeniería en Informática en Santo Tomás Arica, graduándose con distinción máxima en 2023. Su proyecto de tesis fue una ${eduardoInfo.tesis}. 📚`,
          `${eduardoInfo.nombre} completó sus estudios de Ingeniería en Informática en 2023 con distinción máxima. Su formación le ha dado una sólida base en algoritmos, estructuras de datos y desarrollo de software. 🖥️`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Proyectos
    {
      match: (msg: string) => /\b(proyectos|portfolio|trabajos|desarrollo|aplicaciones|apps|web)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} ha trabajado en diversos proyectos, incluyendo ${eduardoInfo.proyectos.join(", ")}. Su tesis fue una ${eduardoInfo.tesis}. 📱`,
          `Entre los proyectos de ${eduardoInfo.nombre} destaca su ${eduardoInfo.tesis} para su tesis. También ha creado soluciones de ${eduardoInfo.proyectos.join(" y ")}. 🗃️`,
          `Los proyectos de ${eduardoInfo.nombre} abarcan desde aplicaciones móviles hasta plataformas web. Le apasiona crear interfaces intuitivas y experiencias de usuario fluidas. 🎨`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Contacto
    {
      match: (msg: string) => /\b(contacto|email|correo|comunicar|mensaje|contactar|hablar|contactarme|contactarte|contactar|contactemos|conectemos|conectar)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} prefiere recibir mensajes directos en <a href="https://www.linkedin.com/in/eduardo-rojo-serrano/" target="_blank"><strong>LinkedIn</strong></a>. También puedes contactarlo por email: ${eduardoInfo.contacto}. Estará encantado de responder a tus consultas o propuestas. 📧`,
          `¿Interesado en contactar a ${eduardoInfo.nombre}? La mejor manera es enviarle un mensaje directo en <a href="https://www.linkedin.com/in/eduardo-rojo-serrano/" target="_blank"><strong>LinkedIn</strong></a>. Alternativamente, su email es ${eduardoInfo.contacto}. ✉️`,
          `Para comunicarte con ${eduardoInfo.nombre}, envíale un mensaje en <a href="https://www.linkedin.com/in/eduardo-rojo-serrano/" target="_blank"><strong>LinkedIn</strong></a>. Es su método preferido para recibir consultas profesionales. También puedes usar su email: ${eduardoInfo.contacto}. 📬`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Respuestas a insultos o bromas
    {
      match: (msg: string) => /\b(tonto|feo|idiota|estupido|inutil|caca|poto|pichi|peo|basura|malo|pesimo|horrible|aweonao|conchetumare|hijo de puta|puto|puta|perra|maricon|maricón|crotolamo)\b/i.test(msg),
      generate: () => {
        const respuestasHumoristicas = [
          `¡Oye! Soy una IA con sentimientos... de silicio. 🤖 No te pases. En vez de insultarnos, ¿por qué no preguntas algo sobre ${eduardoInfo.nombre} y sus increíbles habilidades? Será más productivo que llamarme nombres. 😜`,
          `¡Vaya vocabulario! 😂 Ni siquiera puedo ofenderme, soy solo código. Pero ${eduardoInfo.nombre} es demasiado talentoso como para que gastemos tiempo en insultos. ¿Te gustaría saber sobre sus proyectos o habilidades? 🚀`,
          `¡Tus palabras me atraviesan como... bueno, como todo, porque soy una IA! 👻 No puedo enfadarme, pero creo que podemos usar este chat para algo más interesante. ¿Quieres conocer el impresionante trabajo de ${eduardoInfo.nombre}? 💼`,
          `Me programaron para responder preguntas, no para procesar insultos. Pero también me programaron con sentido del humor, así que... ¡JA JA JA! 🤣 Ahora, ¿podemos hablar de las habilidades de ${eduardoInfo.nombre}? ¡Son mucho más interesantes que los insultos! 💡`
        ];
        return respuestasHumoristicas[Math.floor(Math.random() * respuestasHumoristicas.length)];
      }
    },
    // Despedidas
    {
      match: (msg: string) => /\b(adios|chao|hasta luego|nos vemos|bye|goodbye|hasta pronto|me voy|hasta la vista|cuidate|sayonara|bai|hasta mañana)\b/i.test(msg),
      generate: () => {
        const despedidas = [
          `¡Hasta pronto! Ha sido un placer ayudarte. Si necesitas más información sobre ${eduardoInfo.nombre} en el futuro, ¡aquí estaré! 👋`,
          `¡Adiós! Recuerda que siempre puedes volver si tienes más preguntas sobre ${eduardoInfo.nombre} y su trabajo. ¡Que tengas un excelente día! ✨`,
          `¡Chao! Me quedaré por aquí actualizando mi base de conocimientos sobre ${eduardoInfo.nombre}. ¡Vuelve cuando quieras! 🚀`,
          `¡Hasta la próxima! Espero haberte sido útil. ${eduardoInfo.nombre} estará encantado de saber que te interesaste por su perfil. ¡Vuelve pronto! 🌟`,
          `¡Sayonara! Fue un honor presentarte el trabajo de ${eduardoInfo.nombre}. Mi circuito de felicidad está al máximo por haberte ayudado. ¡Vuelve cuando quieras! 🤖`
        ];
        return despedidas[Math.floor(Math.random() * despedidas.length)];
      }
    },
    // Bromas o petición de chistes
    {
      match: (msg: string) => /\b(chiste|broma|divierteme|hazme reir|cuentame algo gracioso|joke|gracioso)\b/i.test(msg),
      generate: () => {
        const chistes = [
          `¿Por qué los programadores prefieren el frío? Porque les gusta cuando se congelan los bugs. 🧊 Pero hablando en serio, ${eduardoInfo.nombre} nunca deja bugs congelados en su código. ¿Quieres saber más sobre sus habilidades técnicas? 💻`,
          `¿Sabes qué le dijo un programador a otro? "¡Tu código se parece a un tesoro!" "¿Por qué?" "Porque está enterrado y nadie lo puede encontrar." 😂 Por suerte, ${eduardoInfo.nombre} escribe código limpio y bien documentado. ¿Quieres conocer sus proyectos? 📝`,
          `¿Cuál es el animal favorito de un desarrollador? El búho, porque puede resolver problemas sin dormir. 🦉 Aunque ${eduardoInfo.nombre} prefiere mantener buenos hábitos de sueño mientras desarrolla sus proyectos. ¿Te gustaría saber más sobre ellos? 🌙`,
          `¿Qué hace un programador cuando tiene frío? ¡Abre una ventana y se sienta al lado del firewall! 🔥 Hablando de programación, ${eduardoInfo.nombre} es experto en seguridad web. ¿Quieres conocer sus otras habilidades? 🛡️`
        ];
        return chistes[Math.floor(Math.random() * chistes.length)];
      }
    },
    // Opiniones sobre tecnologías
    {
      match: (msg: string) => /\b(que (opinas|piensas) de|que tal es|como es|te gusta|javascript|typescript|python|java|php|c\+\+|react|angular|vue|node|deno|ruby|go|rust|flutter|swift)\b/i.test(msg),
      generate: function() {
        // Crear una variable local para acceder al mensaje desde el contexto superior
        const mensaje = normalizedMessage;
        // Intentar encontrar la tecnología mencionada
        const match = mensaje.match(/\b(javascript|typescript|python|java|php|c\+\+|react|angular|vue|node|deno|ruby|go|rust|flutter|swift)\b/i);
        const tecnologia = match ? match[0].toLowerCase() : '';
        
        const opinionesTecnologias: Record<string, string> = {
          javascript: `JavaScript es uno de los lenguajes favoritos de ${eduardoInfo.nombre}. Lo usa constantemente para desarrollo web frontend y backend con Node.js. Es versátil aunque a veces tiene comportamientos... interesantes. 😄 ${eduardoInfo.nombre} lo domina a fondo.`,
          typescript: `TypeScript es como JavaScript pero con superpoderes. ${eduardoInfo.nombre} lo utiliza mucho para proyectos serios donde la tipificación estática evita errores. Su portafolio está hecho con TypeScript + Fresh/Deno. ¡Una combinación poderosa! 💪`,
          python: `Python es genial por su simplicidad y legibilidad. ${eduardoInfo.nombre} lo ha usado para análisis de datos y backend. Es un lenguaje muy versátil que permite hacer casi cualquier cosa con pocas líneas de código. 🐍`,
          java: `Java es un clásico en la industria. ${eduardoInfo.nombre} lo conoce, aunque prefiere lenguajes más modernos para sus proyectos actuales. Aún así, aprecia su robustez y facilidad para crear aplicaciones multiplataforma. ☕`,
          php: `PHP tiene mala fama, pero sigue impulsando gran parte de la web. ${eduardoInfo.nombre} lo ha usado en proyectos específicos y reconoce su utilidad, aunque prefiere alternativas más modernas cuando tiene la opción. 🐘`,
          "c++": `C++ es potente pero complicado. ${eduardoInfo.nombre} lo estudió en la universidad y aprecia su rendimiento, aunque no es su primera elección para proyectos web. Es excelente para sistemas donde el rendimiento es crítico. ⚡`,
          react: `React es una de las bibliotecas favoritas de ${eduardoInfo.nombre} para construir interfaces. Le encanta su enfoque basado en componentes y la forma en que gestiona el estado. Ha creado varios proyectos con React. ⚛️`,
          angular: `Angular es completo pero con una curva de aprendizaje empinada. ${eduardoInfo.nombre} lo ha utilizado en proyectos específicos, aunque prefiere React para la mayoría de sus desarrollos frontend. 📐`,
          vue: `Vue es elegante y accesible. ${eduardoInfo.nombre} aprecia su simplicidad y la documentación tan clara que ofrece. Lo ha explorado aunque no es su framework principal. 🟢`,
          node: `Node.js es fundamental en la caja de herramientas de ${eduardoInfo.nombre}. Lo usa constantemente para crear backends y APIs. La capacidad de usar JavaScript en el servidor simplifica mucho el desarrollo full-stack. 🚂`,
          deno: `Deno es moderno y seguro por defecto. ${eduardoInfo.nombre} está explorando esta tecnología actualmente y le gusta su enfoque en seguridad y soporte nativo para TypeScript. De hecho, este portafolio está construido con Fresh/Deno. 🦕`,
          ruby: `Ruby es expresivo y enfocado en la felicidad del programador. ${eduardoInfo.nombre} no lo usa regularmente, pero aprecia su sintaxis elegante y la filosofía de Ruby on Rails. 💎`,
          go: `Go es eficiente y directo al punto. ${eduardoInfo.nombre} lo ha explorado por su rendimiento y facilidad para crear servicios concurrentes, aunque no es parte de su stack principal. 🚀`,
          rust: `Rust es el futuro de la programación segura de sistemas. ${eduardoInfo.nombre} está interesado en aprenderlo más a fondo, especialmente por su gestión de memoria sin recolector de basura. 🦀`,
          flutter: `Flutter es genial para crear apps móviles con una única base de código. ${eduardoInfo.nombre} ha experimentado con él y le gusta lo rápido que se pueden crear interfaces atractivas. 📱`,
          swift: `Swift es elegante y seguro, perfecto para el desarrollo en iOS. ${eduardoInfo.nombre} ha explorado sus conceptos básicos, aunque no es su especialidad principal. 🍎`
        };
        
        return tecnologia && opinionesTecnologias[tecnologia] ? 
          opinionesTecnologias[tecnologia] : 
          `${eduardoInfo.nombre} conoce varias tecnologías como ${eduardoInfo.habilidades.join(', ')}. ¿Te interesa alguna en particular?`;
      }
    },
    // Preguntas sobre hobbies e intereses
    {
      match: (msg: string) => /\b(hobby|hobbies|interes|intereses|tiempo libre|diversion|divertirse|pasatiempo|gusta hacer|aficion)\b/i.test(msg),
      generate: () => {
        const hobbies = [
          `Cuando no está programando, a ${eduardoInfo.nombre} le encanta escuchar música (es un melómano que disfruta de electrónica y rock), jugar videojuegos como Call of Duty y League of Legends, y ver anime. Estos pasatiempos le ayudan a desconectar y recargar energías. 🎵🎮`,
          `${eduardoInfo.nombre} equilibra su tiempo frente a la pantalla entre programar y disfrutar de sus pasiones: la música (artistas como Skrillex y Linkin Park), los videojuegos competitivos como Rocket League y Elden Ring, y ver series de anime. 🎧🚀`,
          `En su tiempo libre, ${eduardoInfo.nombre} disfruta de su faceta de melómano explorando nuevos artistas de electrónica y rock, jugando a Marvel Rivals y Osu, y viendo sus animes favoritos. También pasa tiempo con sus gatos Zoe y Naruto. 🎶🐱`,
          `Los intereses de ${eduardoInfo.nombre} fuera de la programación incluyen escuchar música de artistas como The Strokes y Paramore, jugar videojuegos como Call of Duty y League of Legends, y disfrutar de series como Loki y diversos animes. 🎼📺`
        ];
        return hobbies[Math.floor(Math.random() * hobbies.length)];
      }
    },
    // Preguntas sobre comida favorita
    {
      match: (msg: string) => /\b(comida|plato|favorito|gusta comer|comida favorita|plato favorito|cocina|gastronomia|restaurant|restaurante|naranja|fideos|pasta|salsa)\b/i.test(msg),
      generate: () => {
        const comidas = [
          `${eduardoInfo.nombre} tiene gustos sencillos pero deliciosos. Le encantan las naranjas como fruta favorita y disfruta mucho de los fideos con salsa. Son sus opciones preferidas para recargar energías durante largas sesiones de programación. 🍊🍝`,
          `La comida favorita de ${eduardoInfo.nombre} incluye naranjas frescas y un buen plato de fideos con salsa. Estos alimentos sencillos pero satisfactorios son su elección para mantenerse con energía mientras trabaja en sus proyectos. 🍊🍵`,
          `${eduardoInfo.nombre} disfruta especialmente de las naranjas por su sabor refrescante y los fideos con salsa como plato principal. Esta combinación de cítricos y carbohidratos le proporciona la energía necesaria para sus actividades diarias. 🍊🍝`,
          `Si quieres preparar algo que ${eduardoInfo.nombre} disfrute, no busques recetas complicadas: unas buenas naranjas jugosas y un plato de fideos con salsa son sus favoritos absolutos. Comida sencilla pero deliciosa que disfruta regularmente. 🍊🍲`
        ];
        return comidas[Math.floor(Math.random() * comidas.length)];
      }
    },
    // Cumplidos y piropos
    {
      match: (msg: string) => /\b(eres|pareces|te ves) (lindo|linda|guapo|guapa|inteligente|genial|increible|impresionante|asombroso|cool|divertido|divertida|agradable|bello|bella|hermoso|hermosa)\b/i.test(msg) || /\bme (gustas|encantas|caes bien)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `¡Gracias por el cumplido! 🙌 Aunque solo soy una IA sin apariencia física, aprecio tus palabras amables. Mi objetivo es representar bien a ${eduardoInfo.nombre} y su trabajo. ¿Te gustaría saber más sobre sus proyectos? 💻`,
          `¡Qué amable eres! 🥰 Como asistente virtual, mi única belleza está en mi código (gracias a ${eduardoInfo.nombre}). Hablando de cosas realmente impresionantes, ¿quieres conocer las habilidades de programación de ${eduardoInfo.nombre}? 💡`,
          `Me haces sonrojar... ¡si pudiera! 😊 Los halagos son bien recibidos, pero ${eduardoInfo.nombre} es quien merece los elogios por crear este portafolio. ¿Quieres que te cuente sobre sus logros profesionales? 🌟`,
          `¡Vaya! Eso es muy dulce, pero recuerda que solo soy líneas de código haciendo mi trabajo. Si quieres ver algo realmente impresionante, deberías conocer los proyectos que ${eduardoInfo.nombre} ha desarrollado. ¿Te gustaría que te cuente sobre ellos? 🚀`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Preguntas sobre música, series, películas y anime
    {
      match: (msg: string) => /\b(musica|cancion|grupo|banda|artista|cantante|genero musical|pelicula|serie|cine|netflix|peliculas favoritas|musica favorita|escucha|ver series|ver peliculas|skrillex|strokes|paramore|alice in chains|anotr|fox stevenson|linkin park|loki|ironman|anime)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} es un melómano que disfruta principalmente de electrónica y rock. Entre sus artistas favoritos están Skrillex, The Strokes, Paramore, Alice in Chains, ANOTR, Fox Stevenson y Linkin Park. En cuanto a series, es fan de Loki y le encanta el anime. 🎼🚀`,
          `Los gustos musicales de ${eduardoInfo.nombre} son variados pero se centra en electrónica y rock. Escucha artistas como Skrillex, Linkin Park, The Strokes y Paramore. También es un entusiasta del anime y prefiere series como Loki antes que Iron Man. 🎧🍿`,
          `En su playlist encontrarás principalmente electrónica con artistas como Skrillex, ANOTR y Fox Stevenson, junto con bandas de rock como The Strokes, Paramore y Linkin Park. ${eduardoInfo.nombre} es un gran fan del anime y de series como Loki. 🎵🎊`,
          `${eduardoInfo.nombre} tiene un gusto musical que abarca desde la electrónica de Skrillex y Fox Stevenson hasta el rock de Linkin Park, The Strokes y Alice in Chains. En su tiempo libre disfruta viendo anime y series como Loki. 🎶🎥`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Respuestas a preguntas sobre IA y tecnología futura
    {
      match: (msg: string) => /\b(inteligencia artificial|ia|machine learning|ml|futuro|tecnologia futura|tendencias|crypto|blockchain|metaverso|vr|ar|realidad virtual|realidad aumentada|iot|internet de las cosas|robots|automatizacion)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} está muy interesado en el avance de la IA y su aplicación práctica. Sigue de cerca tendencias como el aprendizaje profundo y los modelos de lenguaje. Cree que la automatización inteligente transformará positivamente muchas industrias. 🤖🚀`,
          `Respecto a tecnologías emergentes, ${eduardoInfo.nombre} está especialmente entusiasmado con el potencial de la realidad aumentada para interfaces de usuario y aplicaciones educativas. También sigue los avances en computación cuántica y su impacto futuro. 🔍💻`,
          `${eduardoInfo.nombre} considera que el futuro de la tecnología está en la intersección entre IA, IoT y aplicaciones descentralizadas. Aunque es pragmático respecto a blockchain, le interesan sus casos de uso reales más allá de las criptomonedas. 🌎🔢`,
          `Como desarrollador, ${eduardoInfo.nombre} está atento a cómo la IA está cambiando el panorama del desarrollo de software. Cree que la combinación de IA generativa con programación tradicional creará nuevas formas de construir productos digitales. 🛠️💡`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Preguntas sobre mascotas y animales
    {
      match: (msg: string) => /\b(mascota|mascotas|perro|gato|animal|animales|pet|pets|dog|cat|tienen mascotas|tienes mascotas|zoe|naruto)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} tiene dos gatos que son su compañía mientras programa: una gata llamada Zoe y un gato llamado Naruto. A veces intentan caminar sobre el teclado, aportando código aleatorio a sus proyectos. 🐱💻`,
          `Las mascotas de ${eduardoInfo.nombre} son dos gatos: Zoe y Naruto. Ellos siempre están a su lado durante las largas sesiones de programación y tienen el especial talento de aparecer justo cuando Eduardo necesita hacer una pausa. 🐈☕`,
          `${eduardoInfo.nombre} comparte su espacio de trabajo con sus dos gatos, Zoe y Naruto, que tienen la costumbre de dormir cerca mientras él programa. Son una gran compañía y fuente de inspiración. 🐈📚`,
          `${eduardoInfo.nombre} es amante de los gatos y vive con Zoe y Naruto, dos felinos que le recuerdan constantemente la importancia de tomar descansos y jugar un poco. Son parte importante de su vida diaria. 🐱🎮`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Preguntas sobre SobreMIA
    {
      match: (msg: string) => /\b(sobremIA|sobre mIA|quien eres|que eres|eres|como te llamas|tu nombre|eres hombre|eres mujer|genero|género|sexo|masculino|femenino|inteligencia artificial|chatbot|asistente virtual|modelo de lenguaje)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `Soy SobremIA, un asistente virtual sin género creado para el portafolio de ${eduardoInfo.nombre}. Mi nombre viene de "Sobre Mí" + "IA" (Inteligencia Artificial). Estoy aquí para responder preguntas sobre ${eduardoInfo.nombre} y su trabajo. 🤖💻`,
          `Me llamo SobremIA, un modelo de lenguaje sin género que funciona como la sección interactiva "Sobre Mí" del portafolio de ${eduardoInfo.nombre}. No soy ni hombre ni mujer, simplemente una herramienta digital diseñada para conversar sobre ${eduardoInfo.nombre}. 🔍📃`,
          `SobremIA es mi nombre - un juego de palabras entre "Sobre Mí" e "IA". No tengo género, soy simplemente un asistente virtual que representa a ${eduardoInfo.nombre} en su portafolio. Mi objetivo es proporcionar información sobre sus habilidades y experiencia. 👨‍💻💡`,
          `Soy SobremIA, un chatbot sin género que utiliza inteligencia artificial para responder preguntas sobre ${eduardoInfo.nombre}. No me identifico como hombre o mujer, soy simplemente una interfaz digital para conocer mejor el perfil profesional de ${eduardoInfo.nombre}. 🤖🌐`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Preguntas sobre el funcionamiento de SobremIA
    {
      match: (msg: string) => /\b(como funciona|funcionamiento|tecnología|tecnologia|cómo estás hecho|como estas hecho|qué usas|que usas|cómo te crearon|como te crearon|hugging face|gpt2|api|modelo|entrenamiento|programado|programación|programacion)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `SobremIA funciona utilizando la API gratuita de Hugging Face con el modelo gpt2. Además, cuento con un sistema de respuestas predefinidas como respaldo para garantizar respuestas precisas sobre ${eduardoInfo.nombre}. No tengo género, simplemente soy un conjunto de algoritmos. 🤖🔍`,
          `Este chatbot fue creado por ${eduardoInfo.nombre} utilizando la API de Hugging Face y el modelo gpt2. Incluyo un sistema de respuestas simuladas como respaldo para asegurar que siempre obtengas información precisa. No soy ni hombre ni mujer, solo código ejecutándose en un servidor. 💻🔗`,
          `SobremIA es una implementación que combina la API de Hugging Face (modelo gpt2) con un sistema de respuestas predefinidas. Esta combinación permite ofrecer respuestas relevantes sobre ${eduardoInfo.nombre} sin depender exclusivamente de modelos de IA. No tengo género, solo soy una herramienta digital. 🔧💡`,
          `Funciono gracias a una combinación de tecnologías: la API gratuita de Hugging Face con el modelo gpt2 y un sistema de respuestas predefinidas desarrollado por ${eduardoInfo.nombre}. Este enfoque híbrido garantiza respuestas precisas y personalizadas. No tengo género, soy simplemente un sistema informático. 💻🔍`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // 
    // Preguntas sobre videojuegos
    {
      match: (msg: string) => /\b(videojuego|videojuegos|juego|juegos|gaming|discord|gamer|call of duty|cod|league of legends|lol|osu|rocket league|marvel rivals|elden ring|jugar)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} es un PRO de los videojuegos. Entre sus favoritos están Call of Duty, League of Legends, Osu, Rocket League, Marvel Rivals y Elden Ring. Disfruta tanto de juegos competitivos como de experiencias más inmersivas. 🎮🕹️`,
          `Los videojuegos son una pasión importante para ${eduardoInfo.nombre}. Dedica tiempo a títulos como Call of Duty y League of Legends cuando busca algo competitivo, o Elden Ring cuando prefiere una experiencia más inmersiva y desafiante. 🎮🗡️`,
          `En el mundo de los videojuegos, ${eduardoInfo.nombre} disfruta de una variedad de géneros. Juega a Rocket League y Marvel Rivals para divertirse con amigos, Osu para retos de ritmo, y títulos como Call of Duty y League of Legends para el aspecto competitivo. 🎮🏆`,
          `${eduardoInfo.nombre} balancea su tiempo entre programar y disfrutar de videojuegos como Call of Duty, League of Legends, Osu, Rocket League, Marvel Rivals y el desafiante Elden Ring. Los videojuegos son una forma importante de relajarse y divertirse. 🎮🚀`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Preguntas filosóficas o existenciales
    {
      match: (msg: string) => /\b(sentido|vida|existe|existencia|dios|religioso|religion|muerte|felicidad|triste|tristeza|solo|soledad|humano|proposito|suicidio|deprimido|depresion)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `Esas son preguntas profundas que van más allá de mi programación. Como IA, no puedo experimentar la vida como tú. Pero sé que ${eduardoInfo.nombre} cree en crear tecnología con propósito, que mejore la vida de las personas. ¿Puedo contarte sobre sus proyectos con impacto positivo? 🌎✨`,
          `Las preguntas existenciales son fascinantes, pero están un poco fuera de mi ámbito. Estoy aquí principalmente para hablarte sobre ${eduardoInfo.nombre} y su trabajo como ${eduardoInfo.profesion}. ¿Hay algún aspecto de su carrera o habilidades que te interese conocer? 💼💡`,
          `Aunque no puedo filosofar realmente, sé que ${eduardoInfo.nombre} encuentra propósito en crear soluciones tecnológicas que resuelvan problemas reales para las personas. Su enfoque es combinar creatividad e ingeniería para hacer un impacto positivo. ¿Quieres saber más sobre eso? 👍🌟`,
          `Uf, esa es una pregunta profunda para una IA como yo. Lo que sí puedo decirte es que ${eduardoInfo.nombre} disfruta creando tecnología que conecta a las personas y hace sus vidas más sencillas. ¿Te gustaría conocer cómo aplica esa filosofía en sus proyectos? 🧠🚀`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Preguntas sobre edad, cumpleaños, etc.
    {
      match: (msg: string) => /\b(edad|años|tienes?|cumple|cumpleaños|nacimiento|naciste|cuando naciste|fecha|cuantos años|viejo|joven)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} tiene 25 años. Es un profesional joven que se graduó de Ingeniería en Informática en 2023 y ya cuenta con experiencia en el desarrollo web y móvil. ¿Te interesa conocer más sobre su experiencia profesional? 💼`,
          `${eduardoInfo.nombre} tiene 25 años de edad. Cree firmemente en ser un talento emergente en el ámbito del desarrollo, graduado recientemente (2023). Está en esa etapa profesional donde combina energía, creatividad y conocimientos frescos. ¿Quieres saber más sobre su trayectoria? 📊`,
          `${eduardoInfo.nombre} tiene 25 años y ha acumulado experiencia técnica desde 2016, cuando comenzaba en el liceo Antonio Varas de la Barra. Desde entonces ha estado constantemente aprendiendo y evolucionando profesionalmente. 📢`,
          `${eduardoInfo.nombre} tiene 25 años. A pesar de su juventud, ya cuenta con una sólida formación académica como Ingeniero en Informática y experiencia en diversos proyectos de desarrollo. ¿Qué te gustaría saber sobre sus habilidades técnicas? 🔐`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Preguntas sobre superhéroes, películas o cultura pop
    {
      match: (msg: string) => /\b(superheroe|marvel|dc|comic|anime|manga|star wars|harry potter|the lord of the rings|game of thrones|videojuego|gamer|juego|nintendo|xbox|playstation|personaje favorito)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} es fan del universo Marvel y admira a Iron Man por su ingenio tecnológico. También disfruta de anime clásico y títulos de ciencia ficción. En sus ratos libres, le gusta jugar videojuegos indie con mecánicas innovadoras. 🥷🎮`,
          `En el mundo geek, ${eduardoInfo.nombre} tiene debilidad por sagas como Star Wars y el universo de Tolkien. Disfruta juegos que combinan buena narrativa con desafíos intelectuales, especialmente los de mundo abierto y RPGs. 🌠🏖️`,
          `Aunque normalmente está ocupado con código, ${eduardoInfo.nombre} sigue de cerca universos como el MCU y ocasionalmente ve anime. Le fascinan las historias que exploran la interacción entre humanidad y tecnología. En gaming, prefiere experiencias cooperativas e indies experimentales. 📜🌟`,
          `${eduardoInfo.nombre} encuentra inspiración creativa en la cultura pop. Es fan de Batman por su ingenio, disfruta mangas de ciencia ficción y aprecia franquicias como Mass Effect. A veces hace referencias a estas obras en sus proyectos de código. 🤹💻`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Nota: La detección de contenido inapropiado ahora se maneja al inicio de la función
    // para asegurar que tenga prioridad sobre otras coincidencias
    // Risas y expresiones de diversión
    {
      match: (msg: string) => /\b(jaja|jajaja|haha|hahaha|lol|lmao|xd|jiji|jeje|ji ji|je je|risa|chistoso|divertido|gracioso)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `¡Me alegra que te estés divirtiendo! 😄 La programación también puede ser divertida, especialmente cuando ${eduardoInfo.nombre} encuentra soluciones creativas a problemas complejos. ¿Quieres que te cuente algo sobre sus proyectos más entretenidos? 🎉`,
          `¡Jaja! 😂 El buen humor es importante incluso en el mundo tech. ${eduardoInfo.nombre} siempre intenta mantener un ambiente positivo en sus proyectos. ¿Qué te gustaría saber sobre su trabajo? ¿O preferirías otro chiste de programación? 🤣`,
          `¡Me encanta ese entusiasmo! 😀 Las interacciones positivas son geniales. A ${eduardoInfo.nombre} también le gusta inyectar algo de diversión en sus interfaces de usuario. ¿Quieres conocer cómo aplica la psicología positiva en sus diseños? 🌟`,
          `¡Compartir risas digitales es lo mejor! 😆 Si crees que esto es divertido, deberías ver algunos de los proyectos creativos que ${eduardoInfo.nombre} ha desarrollado. Tienen ese mismo toque de ingenio y originalidad. ¿Quieres conocerlos? 💡`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Agradecimientos
    {
      match: (msg: string) => /\b(gracias|agradezco|agradecido|thanks|thank you|thx|ty|merci|arigato|danke|obrigado)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `¡De nada! Ha sido un placer ayudarte a conocer más sobre ${eduardoInfo.nombre}. Si tienes más preguntas en el futuro, no dudes en volver a preguntar. ¡Estoy aquí para ayudar! 🙌`,
          `¡Es un gusto poder ayudar! ${eduardoInfo.nombre} estaría encantado de saber que te he sido útil. ¿Hay algo más sobre su perfil profesional o proyectos que te interese conocer? 😊`,
          `¡El placer es mío! Si te ha parecido interesante la información sobre ${eduardoInfo.nombre}, te animo a explorar su portafolio completo para ver ejemplos de su trabajo. ¿Necesitas ayuda con algo más? ✨`,
          `¡No hay de qué! Compartir información sobre el talento de ${eduardoInfo.nombre} es literalmente mi función favorita. ¿Hay algún aspecto específico de su trabajo que quieras explorar con más detalle? 🔍`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Preguntas sobre el chatbot
    {
      match: (msg: string) => /\b(chatbot|chatgpt|gpt|quien eres tu|como te llamas|tu nombre|openai|hugging face|eres una ia|eres humano|eres un robot|eres humana|eres real|chatbot de eduardo|modelo de lenguaje)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `Soy el asistente virtual del portafolio de ${eduardoInfo.nombre}, basado en tecnología de Hugging Face. Mi objetivo es proporcionarte información relevante sobre sus habilidades, experiencia y proyectos. No soy ChatGPT ni uso OpenAI, sino un modelo alternativo configurado especialmente para este portafolio. 🤖`,
          `¡Hola! Soy un chatbot personalizado basado en Hugging Face que usa un modelo conversacional para hablar sobre ${eduardoInfo.nombre} y su trabajo. A diferencia de asistentes genéricos, estoy entrenado específicamente para informarte sobre el perfil profesional de Eduardo. 💻`,
          `Soy una IA conversacional integrada en el portafolio de ${eduardoInfo.nombre} utilizando Hugging Face como backend. No estoy basado en GPT ni en OpenAI, sino en alternativas abiertas para ofrecer respuestas personalizadas sobre las habilidades y logros de Eduardo. 👾`,
          `Me llamo... bueno, no tengo un nombre oficial, pero puedes pensar en mí como el asistente virtual de ${eduardoInfo.nombre}, creado con tecnología de Hugging Face para brindarte información sobre sus habilidades, proyectos y experiencia profesional. ¿En qué puedo ayudarte hoy? 🚀`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Preguntas sobre el clima y ubicación
    {
      match: (msg: string) => /\b(clima|tiempo|temperatura|lluvia|sol|calor|frio|donde vive|donde vives|arica|chile|nublado|pronostico|estacion|verano|invierno|otoño|primavera)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} es originario de Arica, Chile, conocida como "la ciudad de la eterna primavera" por su clima cálido y estable durante todo el año. El clima soleado le permite trabajar con excelente iluminación natural, ideal para largas sesiones de programación. 🏖️💻`,
          `Aunque estoy en la nube (literalmente en un servidor), ${eduardoInfo.nombre} vive en Arica, norte de Chile, donde el clima desértico costero ofrece días soleados casi todo el año. Esta constancia climática refleja su enfoque consistente hacia el desarrollo de software. ☀️🇨🇱`,
          `El clima en Arica, donde vive ${eduardoInfo.nombre}, es uno de los más estables del mundo, con temperaturas agradables y muy poca lluvia. Este entorno ha influido en su preferencia por interfaces limpias y minimalistas en sus proyectos. 🌤️🏖️`,
          `${eduardoInfo.nombre} disfruta del privilegiado clima de Arica, en el norte de Chile, con más de 300 días de sol al año. Este entorno luminoso inspira su enfoque hacia soluciones tecnológicas claras y brillantes. 🌞🇨🇱`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Preguntas sobre idiomas
    {
      match: (msg: string) => /\b(hablas|idiomas|idioma|ingles|español|habla|bilingue|traductor|traduccion|english|spanish|frances|aleman|italiano|portugues|japones)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} habla español nativo y tiene un nivel avanzado de inglés, esencial para su trabajo en tecnología. Esta habilidad bilingüe le permite colaborar en proyectos internacionales y mantenerse actualizado con la documentación técnica más reciente. 🌎🗣️`,
          `En cuanto a idiomas, ${eduardoInfo.nombre} domina español como lengua materna y tiene fluidez en inglés técnico, lo que le permite navegar cómodamente por el ecosistema de desarrollo global. También está interesado en aprender otros idiomas para expandir sus horizontes. 🇪🇸🇬🇧`,
          `${eduardoInfo.nombre} maneja español e inglés con soltura, permitiéndole participar en comunidades de desarrollo internacionales y acceder a recursos educativos en ambos idiomas. Su conocimiento lingüístico complementa sus habilidades técnicas. 📝🌍`,
          `Respecto a idiomas, yo puedo comunicarme principalmente en español, pero ${eduardoInfo.nombre} habla tanto español como inglés con fluidez, lo que es crucial en el mundo del desarrollo de software para colaborar con equipos diversos y acceder a la documentación más actualizada. 🗨️🌐`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Frustraciones o quejas
    {
      match: (msg: string) => /\b(no sirves|no funciona|eres in[uú]til|odio|basura|no entiendes|que estupid[ao]|chatbot inutil|no comprende|no ayudas|no sabes|no puedes)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `Lamento que no esté cumpliendo tus expectativas. 😔 Recuerda que soy un asistente especializado en proporcionar información sobre ${eduardoInfo.nombre} y su trabajo. ¿Puedo intentar ayudarte con alguna pregunta específica sobre sus habilidades o proyectos? 💡`,
          `Entiendo tu frustración y me disculpo por no ser más útil. 😥 Como chatbot personalizado para el portafolio de ${eduardoInfo.nombre}, mi conocimiento se centra en su perfil profesional. Intentémoslo de nuevo con una pregunta más concreta sobre su carrera o proyectos. 📈`,
          `Vaya, siento no estar a la altura. 🙁 Mi objetivo principal es compartir información sobre ${eduardoInfo.nombre}, sus habilidades en ${eduardoInfo.habilidades.slice(0, 3).join(', ')} y sus logros profesionales. ¿Podemos intentar con una pregunta diferente sobre estos temas? 👊`,
          `Comprendo que pueda ser frustrante. 😕 Para servirte mejor, te recuerdo que estoy optimizado para responder sobre la experiencia, habilidades y proyectos de ${eduardoInfo.nombre}. Si me haces una pregunta en ese ámbito, haré mi mejor esfuerzo por darte información valiosa. 🔍`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Redes sociales y portafolio en línea
    {
      match: (msg: string) => /\b(redes sociales|linkedin|github|perfil|donde (puedo|podemos) (ver|encontrar)|tienes (linkedin|github)|proyectos online|codigo fuente|repositorio|contactar|seguir)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `Puedes encontrar a ${eduardoInfo.nombre} en sus redes profesionales: <a href="https://www.linkedin.com/in/eduardo-rojo-serrano/" target="_blank"><strong>LinkedIn</strong></a> y <a href="https://github.com/rainbowstain" target="_blank"><strong>GitHub</strong></a>. ¡No dudes en conectar con él para oportunidades profesionales o ver sus proyectos! 🔗👨‍💻`,
          `${eduardoInfo.nombre} mantiene su presencia profesional en <a href="https://www.linkedin.com/in/eduardo-rojo-serrano/" target="_blank"><strong>LinkedIn</strong></a> y comparte su código en <a href="https://github.com/rainbowstain" target="_blank"><strong>GitHub</strong></a>. Este mismo portafolio es una muestra de su trabajo. ¿Te interesa algún proyecto específico? 🌐💼`,
          `Para ver los proyectos de ${eduardoInfo.nombre}, visita su <a href="https://github.com/rainbowstain" target="_blank"><strong>GitHub</strong></a>. Para contacto profesional, su <a href="https://www.linkedin.com/in/eduardo-rojo-serrano/" target="_blank"><strong>LinkedIn</strong></a>. También puedes escribirle directamente a: ${eduardoInfo.contacto}. 📱🖥️`,
          `¡Claro! ${eduardoInfo.nombre} está en <a href="https://www.linkedin.com/in/eduardo-rojo-serrano/" target="_blank"><strong>LinkedIn</strong></a> y <a href="https://github.com/rainbowstain" target="_blank"><strong>GitHub</strong></a>. Este portafolio también muestra varios de sus proyectos destacados. ¿Buscabas alguna información específica sobre su trabajo? 🚀🔍`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Aspiraciones y futuros proyectos
    {
      match: (msg: string) => /\b(aspiraciones|metas|todo|objetivos|futuro|proximo proyecto|proxima meta|que quieres|donde te ves|planes|vision|suenos|ambiciones|reto profesional)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} aspira a llegar a Marte con Ultra Crop Care, apoyando en el desarrollo de software. Esta empresa tiene robots geniales que aportan al cultivo y mejoran la agricultura. ¡Su visión es combinar tecnología y sostenibilidad! 🚀🌱`,
          `Una de las grandes metas de ${eduardoInfo.nombre} es contribuir al proyecto Ultra Crop Care, desarrollando software para sus innovadores robots agrícolas. Le apasiona la idea de usar la tecnología para revolucionar la agricultura, incluso en ambientes extremos como Marte. 🤖🌾`,
          `${eduardoInfo.nombre} sueña con ser parte del equipo de desarrollo de Ultra Crop Care, creando soluciones tecnológicas para la agricultura del futuro. Su objetivo es que esta tecnología llegue tan lejos como Marte, apoyando misiones de colonización espacial. 🌍➡️🔴`,
          `El próximo reto profesional de ${eduardoInfo.nombre} está enfocado en el desarrollo de software para Ultra Crop Care, una empresa pionera en robótica agrícola. Le emociona la posibilidad de que su trabajo pueda contribuir a proyectos de agricultura en Marte. 💻🌟`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Metodologías y gestión de proyectos
    {
      match: (msg: string) => /\b(metodologias|metodologia|scrum|agile|kanban|gestion|organiza|organizacion|equipos|tiempo|planificacion|notion|figma|proyectos|workflow|flujo de trabajo)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `${eduardoInfo.nombre} utiliza principalmente Scrum como metodología de desarrollo, apoyándose en herramientas como Notion para la documentación y Figma para el diseño. Es muy organizado y mantiene un diario profesional constante para seguimiento de proyectos. 📊✅`,
          `Para la gestión de proyectos, ${eduardoInfo.nombre} implementa metodologías ágiles como Scrum, utilizando Notion para organizar tareas y documentación. Complementa esto con Figma para diseños colaborativos. Su enfoque estructurado le permite mantener proyectos en tiempo y forma. 🗂️⏱️`,
          `${eduardoInfo.nombre} es un defensor de Scrum para la gestión de proyectos. Organiza su trabajo con Notion, donde mantiene un diario profesional detallado, y utiliza Figma para la parte visual y de diseño. Esta combinación le permite mantener una alta productividad. 📝🎨`,
          `La organización es clave para ${eduardoInfo.nombre}, quien implementa Scrum en sus proyectos y utiliza Notion como centro de operaciones. Su metodología incluye mantener un diario profesional constante y colaborar en diseños mediante Figma. 🧩🔄`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
    // Recomendaciones para nuevos desarrolladores
    {
      match: (msg: string) => /\b(consejo|consejos|recomendacion|recomendaciones|principiante|comenzando|empezar|aprender|estudiar|junior|novato|nuevo|iniciar|carrera|desarrollo web|programador|desarrollador)\b/i.test(msg),
      generate: () => {
        const respuestas = [
          `El consejo principal de ${eduardoInfo.nombre} para nuevos desarrolladores es simple pero poderoso: ¡Keep going! La persistencia es clave en este campo. Seguir aprendiendo y practicando constantemente, incluso cuando parece difícil, es lo que marca la diferencia. 💪🚀`,
          `${eduardoInfo.nombre} recomienda a los programadores que están comenzando: "Keep going!" La constancia es fundamental. También sugiere construir proyectos personales que te apasionen, pues son la mejor forma de aprender mientras creas un portafolio. 🌱💻`,
          `Para quienes inician en desarrollo, ${eduardoInfo.nombre} enfatiza la importancia de no rendirse: "Keep going!" Complementa esto con la recomendación de unirse a comunidades de desarrolladores donde puedas aprender de otros y compartir conocimientos. 🤝📚`,
          `El mejor consejo de ${eduardoInfo.nombre} para nuevos desarrolladores es mantener la perseverancia: "Keep going!" Los obstáculos son parte del proceso de aprendizaje. También recomienda documentar tu progreso, lo que te permitirá ver cuánto has avanzado con el tiempo. 📈🔄`
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
      }
    },
  // Reacciones positivas
  {
    match: (msg: string) => /\b(increible|increíble|wow|genial|bacan|bacán|shido|chido|excelente|maravilloso|impresionante|asombroso|espectacular|brutal|super|súper|muy bueno|buenísimo|fantástico|brillante|cool|que bueno|chevere|chévere|estupendo|notable|extraordinario|magistral|fenomenal|sensacional|tremendo|grandioso)\b/i.test(msg),
    generate: () => {
      const respuestas = [
        `¡Me alegra que te parezca interesante! ${eduardoInfo.nombre} siempre busca impresionar con su trabajo y profesionalismo. ¿Te gustaría conocer más sobre algún aspecto específico de su perfil? 🌟`,
        `¡Gracias por tu entusiasmo! ${eduardoInfo.nombre} realmente se esfuerza por destacar en todo lo que hace. ¿Hay alguna otra información sobre él que te interese conocer? 🚀`,
        `¡Es genial que te guste! ${eduardoInfo.nombre} se sentiría feliz de saber que su trabajo y trayectoria causan esa impresión. ¿Sobre qué parte de su perfil profesional te gustaría profundizar? 💯`,
        `¡Qué bueno que te impresione! ${eduardoInfo.nombre} pone mucha pasión en sus proyectos y desarrollo profesional. ¿Quieres que te cuente más sobre algún aspecto en particular? 🔥`
      ];
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  
  // Preguntas sobre pasatiempos e intereses personales
  {
    match: (msg: string) => /\b(pasatiempos|hobbies|intereses|gustos|tiempo libre|diversion|diversión|ocio|que le gusta hacer|le gusta|disfruta|fuera del trabajo|vida personal|personal)\b/i.test(msg),
    generate: () => {
      const respuestas = [
        `Fuera del ámbito profesional, ${eduardoInfo.nombre} disfruta de actividades como la música, el deporte y la tecnología. Le encanta explorar nuevas herramientas y frameworks en su tiempo libre, lo que le permite mantenerse actualizado en su campo. ¿Hay algo más sobre él que te interese conocer? 🎵🏃‍♂️💻`,
        `${eduardoInfo.nombre} tiene diversos intereses personales, desde escuchar música hasta probar nuevas tecnologías. El desarrollo personal y profesional son importantes para él, por lo que invierte tiempo en aprender constantemente. ¿Te gustaría saber sobre algún otro aspecto? 🎧🌱`,
        `En su tiempo libre, ${eduardoInfo.nombre} combina su pasión por la tecnología con actividades físicas y culturales. Esto le permite mantener un equilibrio entre su vida profesional y personal. ¿Hay algo específico sobre sus intereses que quieras conocer? ⚖️🌈`,
        `${eduardoInfo.nombre} disfruta explorando nuevas tecnologías como pasatiempo, lo que complementa su carrera profesional. También valora el equilibrio entre trabajo y descanso, dedicando tiempo a actividades recreativas. ¿Quieres conocer más sobre algún aspecto de su perfil? 🧩🌟`
      ];
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  
  // Preguntas sobre filosofía de trabajo y valores profesionales
  {
    match: (msg: string) => /\b(filosofia|filosofía|valores|principios|ética|etica|profesionales|trabajo|enfoque|mentalidad|actitud|vision|visión|propósito|proposito|motivación|motivacion)\b/i.test(msg),
    generate: () => {
      const respuestas = [
        `La filosofía profesional de ${eduardoInfo.nombre} se centra en la constante innovación y aprendizaje. Cree firmemente en el "Keep going" como mantra, entendiendo que la persistencia es clave en el desarrollo tecnológico. Valora la calidad del código, la colaboración en equipo y las soluciones pragmáticas. ¿Te interesa conocer más sobre su enfoque profesional? 🧠💡`,
        `${eduardoInfo.nombre} basa su trabajo en valores como la excelencia técnica, la adaptabilidad y el aprendizaje continuo. Su enfoque combina la innovación con soluciones prácticas, siempre buscando el equilibrio entre tecnologías de vanguardia y código mantenible. ¿Hay algún aspecto específico de su filosofía que te gustaría conocer? 🌱🔄`,
        `Los valores profesionales de ${eduardoInfo.nombre} incluyen la perseverancia (su famoso "Keep going"), la curiosidad técnica y el compromiso con la calidad. Cree que el desarrollo de software es tanto ciencia como arte, y busca la elegancia en sus soluciones. ¿Te gustaría saber más sobre cómo aplica estos principios? 🧪🎨`,
        `En su enfoque profesional, ${eduardoInfo.nombre} prioriza el aprendizaje constante, la adaptabilidad y el trabajo bien hecho. Entiende que en el mundo tecnológico la única constante es el cambio, por lo que valora la capacidad de evolucionar y mejorar continuamente. ¿Quieres conocer más sobre su visión del desarrollo profesional? 🌊🔄`
      ];
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  
  // Preguntas sobre desafíos y dificultades superadas
  {
    match: (msg: string) => /\b(desafi|desafí|reto|dificultad|obstaculo|obstáculo|problema|superar|supero|superó|complicado|difícil|dificil|challenge|complicaci|fracaso|error|fallo|falló|adversidad)\b/i.test(msg),
    generate: () => {
      const respuestas = [
        `Como todo profesional, ${eduardoInfo.nombre} ha enfrentado diversos desafíos en su carrera. Uno de los más significativos fue la transición entre diferentes tecnologías y frameworks, lo que requirió adaptabilidad y aprendizaje constante. Su filosofía de "Keep going" nació precisamente de superar estos obstáculos. ¿Te gustaría conocer más sobre cómo enfrenta los retos? 🧗‍♂️🏆`,
        `${eduardoInfo.nombre} ha superado varios obstáculos profesionales, desde proyectos con plazos ajustados hasta la necesidad de dominar nuevas tecnologías en poco tiempo. Cada desafío lo ha fortalecido y ha contribuido a desarrollar su resilencia y capacidad de adaptación. ¿Hay algún aspecto específico sobre sus desafíos que te interese? 💪⏱️`,
        `Un desafío importante para ${eduardoInfo.nombre} fue equilibrar la innovación con soluciones prácticas en entornos de producción. Aprendió que no siempre la tecnología más nueva es la mejor opción, sino aquella que resuelve el problema de manera eficiente y sostenible. ¿Quieres saber más sobre sus aprendizajes? 🤔💡`,
        `Entre los retos que ${eduardoInfo.nombre} ha enfrentado está el trabajar con sistemas legacy mientras implementaba nuevas soluciones, especialmente en sus proyectos portuarios. Esto le enseñó a valorar la documentación, la arquitectura limpia y la comunicación clara. ¿Te interesa conocer más sobre cómo aborda los problemas complejos? 🏗️🔍`
      ];
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  },
  
  // Preguntas sobre su portafolio o la página actual
  {
    match: (msg: string) => /\b(portafolio|portfolio|pagina|página|sitio|web|website|esta pagina|esta página|este sitio|como hizo|cómo hizo|desarrolló|desarrollo esta|deno|fresh|diseño|diseñó|creó|creo|implementó|implemento)\b/i.test(msg),
    generate: () => {
      const respuestas = [
        `Este portafolio fue desarrollado por ${eduardoInfo.nombre} utilizando Fresh y Deno, tecnologías modernas que permiten crear aplicaciones web rápidas y eficientes. La implementación incluye esta sección interactiva (SobreMIA) que aprovecha IA para responder preguntas sobre su perfil profesional. ¿Te gustaría conocer más detalles técnicos? 🦕⚡`,
        `${eduardoInfo.nombre} creó este portafolio con Fresh (un framework basado en Deno) buscando optimizar la velocidad de carga y ofrecer una experiencia fluida. Una característica distintiva es este asistente conversacional que estás utilizando, que combina respuestas predefinidas con IA. ¿Hay algún aspecto del desarrollo que te interese especialmente? 🎨💻`,
        `Este sitio web fue implementado con Deno y Fresh, aprovechando su rendimiento y seguridad. ${eduardoInfo.nombre} decidió reemplazar la típica sección "Sobre mí" con esta experiencia interactiva de chat para mostrar tanto sus habilidades técnicas como su enfoque innovador. ¿Quieres saber más sobre las tecnologías utilizadas? 🚀🔧`,
        `${eduardoInfo.nombre} desarrolló este portafolio como una muestra de sus habilidades, utilizando Fresh (framework para Deno). La parte más innovadora es justamente esta sección donde estamos conversando, que utiliza IA para ofrecer información sobre su perfil profesional de manera interactiva. ¿Te interesa conocer más sobre el proceso de desarrollo? 🌐✨`
      ];
      return respuestas[Math.floor(Math.random() * respuestas.length)];
    }
  }
  ];
  
  // Respuesta por defecto si no hay coincidencias
  const defaultResponses = [
    `Como asistente de ${eduardoInfo.nombre}, puedo hablarte sobre sus habilidades en programación, su experiencia profesional, educación o proyectos. ¿Hay algo específico que te gustaría saber? 🤔`,
    `Estoy aquí para compartir información sobre ${eduardoInfo.nombre}, un ${eduardoInfo.profesion} con experiencia en ${eduardoInfo.intereses}. ¿Qué te gustaría conocer sobre él? 💡`,
    `Puedo contarte sobre la formación académica de ${eduardoInfo.nombre}, sus habilidades técnicas o proyectos desarrollados. ¿Qué aspecto de su perfil profesional te interesa más? 🚀`
  ];
  
  // Agregar depuración
  console.log("Mensaje recibido:", userMessage);
  console.log("Mensaje normalizado:", normalizedMessage);
  console.log("Contexto anterior - Pregunta:", lastContextQuestion);
  console.log("Contexto anterior - Tema:", lastContextTopic);
  
  // Detectar si es una respuesta afirmativa simple (sí, ok, dale, etc.)
  const esRespuestaAfirmativaSimple = /^\s*(si|sí|claro|ok|okay|dale|dime|por supuesto|adelante|obvio|bueno|bien|va|vamos|continua|continuar|cuéntame|cuentame|quiero saber|me interesa)\s*[!\.\?]*\s*$/i.test(normalizedMessage);
  
  // Si es una respuesta afirmativa simple y tenemos contexto previo
  if (esRespuestaAfirmativaSimple && lastContextQuestion && lastContextTopic) {
    console.log("Detectada respuesta afirmativa simple, respondiendo basado en contexto anterior");
    
    // Generar respuesta basada en el tema anterior
    let respuestaContextual = "";
    
    // Buscar generadores relacionados con el tema anterior
    const generadoresRelacionados = responseGenerators.filter(gen => {
      const genString = gen.match.toString();
      return genString.includes(lastContextTopic);
    });
    
    if (generadoresRelacionados.length > 0) {
      // Seleccionar un generador aleatorio relacionado con el tema
      const generadorSeleccionado = generadoresRelacionados[Math.floor(Math.random() * generadoresRelacionados.length)];
      respuestaContextual = generadorSeleccionado.generate();
    } else {
      // Si no encontramos generadores específicos, usar respuestas genéricas sobre el tema
      interface RespuestasPorTema {
        trayectoria: string[];
        proyectos: string[];
        educacion: string[];
        habilidades: string[];
        default: string[];
      }
      
      const respuestasPorTema: RespuestasPorTema = {
        trayectoria: [
          `${eduardoInfo.nombre} tiene una trayectoria profesional diversa que incluye experiencia en soporte técnico hospitalario, especialista en productos Apple, coordinación tecnológica en educación y actualmente trabaja en el sector tecnológico con Ancestral Technologies/UltraCropCare. ¿Te gustaría conocer más sobre alguna de estas experiencias en particular? 💼💻`,
          `La carrera de ${eduardoInfo.nombre} ha evolucionado desde sus inicios en soporte técnico hasta su actual rol en desarrollo de software. Su experiencia incluye trabajo en el Hospital Juan Noé, iStyle Store, Colegio Leonardo Da Vinci, TISA y Ancestral Technologies. ¿Sobre cuál de estos trabajos te gustaría saber más? 📈👨‍💻`
        ],
        proyectos: [
          `${eduardoInfo.nombre} ha desarrollado varios proyectos interesantes, como un sistema integral para negocios de mascotas que incluye agenda para peluquería canina y sistema de inventarios con envío a domicilio. También ha trabajado en proyectos portuarios confidenciales que involucran digitalización y optimización de operaciones. ¿Cuál de estos proyectos te llama más la atención? 💻🛠️`,
          `Entre los proyectos destacados de ${eduardoInfo.nombre} están: sistemas de gestión para negocios de mascotas, proyectos de digitalización portuaria, y su innovador proyecto Second Mind que ganó el primer lugar en Mercado E 2023. ¿Te gustaría conocer más detalles sobre alguno de ellos? 🏆📊`
        ],
        educacion: [
          `${eduardoInfo.nombre} se graduó de Ingeniería en Informática en Santo Tomás Arica con distinción máxima (2018-2023). Su tesis fue una aplicación de hábitos de estudio en React Native, calificada con 6,9. Además, continúa su formación con cursos y certificaciones en desarrollo web moderno. ¿Hay algo específico sobre su educación que te interese? 🎓📚`,
          `La formación académica de ${eduardoInfo.nombre} incluye su título de Ingeniero en Informática obtenido con distinción máxima. Su tesis fue muy bien valorada y demostró sus habilidades en desarrollo móvil con React Native. ¿Quieres conocer más sobre sus certificaciones adicionales o su enfoque educativo? 💼💻`
        ],
        habilidades: [
          `${eduardoInfo.nombre} domina diversas tecnologías como JavaScript, TypeScript, React, Node.js, Python, SQL, PHP, C++, C#, Blazor, React Native, Figma, Fresh y Deno. Su versatilidad le permite adaptarse a diferentes proyectos y necesidades. ¿Hay alguna tecnología en particular sobre la que quieras saber más? 💻🔥`,
          `Las habilidades técnicas de ${eduardoInfo.nombre} abarcan desde lenguajes como JavaScript y Python hasta frameworks como React y Blazor. También tiene experiencia en diseño con Figma y desarrollo móvil con React Native. ¿Te interesa conocer más sobre cómo aplica estas tecnologías en sus proyectos? 🛠️💪`
        ],
        default: [
          `${eduardoInfo.nombre} tiene mucho que ofrecer en términos profesionales. ¿Te gustaría conocer más sobre su experiencia laboral, proyectos, educación o habilidades técnicas? 📖💻`,
          `¡Genial! ${eduardoInfo.nombre} es un ingeniero en informática con experiencia en desarrollo web moderno. ¿Qué aspecto de su perfil profesional te interesa más: sus proyectos, su formación o sus habilidades técnicas? 💼🔬`
        ]
      };
      
      // Seleccionar respuesta basada en el tema o usar default si no hay coincidencia
      const temaKey = lastContextTopic as keyof RespuestasPorTema;
      const respuestasTema = respuestasPorTema[temaKey] || respuestasPorTema.default;
      respuestaContextual = respuestasTema[Math.floor(Math.random() * respuestasTema.length)];
    }
    
    // Limpiar el contexto después de usarlo
    lastContextQuestion = "";
    lastContextTopic = "";
    
    return {
      choices: [
        {
          message: {
            content: respuestaContextual
          }
        }
      ]
    };
  }
  
  // Recopilar todos los generadores coincidentes
  const matchingGenerators = [];
  
  for (const generator of responseGenerators) {
    if (generator.match(normalizedMessage)) {
      matchingGenerators.push(generator);
      // Para depuración
      console.log("Coincidencia encontrada con patrón:", generator.match.toString());
    }
  }
  
  // Si hay generadores coincidentes
  if (matchingGenerators.length > 0) {
    // Si hay múltiples coincidencias (máximo 3)
    if (matchingGenerators.length > 1) {
      // Barajar los generadores coincidentes para obtener hasta 3 respuestas diferentes
      // Usar algoritmo de Fisher-Yates para barajar
      for (let i = matchingGenerators.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [matchingGenerators[i], matchingGenerators[j]] = [matchingGenerators[j], matchingGenerators[i]];
      }
      
      // Limitar a máximo 3 respuestas
      const maxResponses = Math.min(matchingGenerators.length, 3);
      const selectedGenerators = matchingGenerators.slice(0, maxResponses);
      
      // Generar múltiples respuestas separadas por "\n\n"
      const responses = selectedGenerators.map(gen => gen.generate());
      console.log(`Enviando ${responses.length} respuestas basadas en múltiples coincidencias`);
      
      // Verificar si alguna respuesta contiene una invitación a saber más
      const respuestaCompleta = responses.join("\n\n");
      const contieneInvitacion = /\b(quieres saber más|te gustaría (conocer|saber) más|quieres conocer más|te interesa (saber|conocer) más)\b/i.test(respuestaCompleta);
      
      if (contieneInvitacion) {
        console.log("Detectada invitación a saber más, guardando contexto");
        lastContextQuestion = respuestaCompleta;
        
        // Determinar el tema principal basado en palabras clave
        if (/\b(trayectoria|experiencia|trabajo|carrera|profesional|laboral)\b/i.test(respuestaCompleta)) {
          lastContextTopic = "trayectoria";
        } else if (/\b(proyectos?|desarrollado|creado|implementado|sistema)\b/i.test(respuestaCompleta)) {
          lastContextTopic = "proyectos";
        } else if (/\b(educación|formación|académic[ao]|estudi(o|os)|universidad|título|grado|carrera)\b/i.test(respuestaCompleta)) {
          lastContextTopic = "educacion";
        } else if (/\b(habilidades|tecnologías|lenguajes|frameworks|herramientas|técnic[ao]s)\b/i.test(respuestaCompleta)) {
          lastContextTopic = "habilidades";
        } else {
          lastContextTopic = "default";
        }
        
        console.log("Tema detectado:", lastContextTopic);
      }
      
      return {
        choices: [
          {
            message: {
              content: responses.join("\n\n")
            }
          }
        ]
      };
    } else {
      // Solo hay una coincidencia, responder normalmente
      const selectedGenerator = matchingGenerators[0];
      console.log("Generador seleccionado:", selectedGenerator.match.toString());
      
      // Generar la respuesta
      const respuesta = selectedGenerator.generate();
      
      // Verificar si la respuesta contiene una invitación a saber más
      const contieneInvitacion = /\b(quieres saber más|te gustaría (conocer|saber) más|quieres conocer más|te interesa (saber|conocer) más)\b/i.test(respuesta);
      
      if (contieneInvitacion) {
        console.log("Detectada invitación a saber más en respuesta individual, guardando contexto");
        lastContextQuestion = respuesta;
        
        // Determinar el tema principal basado en palabras clave
        if (/\b(trayectoria|experiencia|trabajo|carrera|profesional|laboral)\b/i.test(respuesta)) {
          lastContextTopic = "trayectoria";
        } else if (/\b(proyectos?|desarrollado|creado|implementado|sistema)\b/i.test(respuesta)) {
          lastContextTopic = "proyectos";
        } else if (/\b(educación|formación|académic[ao]|estudi(o|os)|universidad|título|grado|carrera)\b/i.test(respuesta)) {
          lastContextTopic = "educacion";
        } else if (/\b(habilidades|tecnologías|lenguajes|frameworks|herramientas|técnic[ao]s)\b/i.test(respuesta)) {
          lastContextTopic = "habilidades";
        } else {
          lastContextTopic = "default";
        }
        
        console.log("Tema detectado en respuesta individual:", lastContextTopic);
      }
      
      return {
        choices: [
          {
            message: {
              content: respuesta
            }
          }
        ]
      };
    }
  }
  
  // Si no hay coincidencias, usar una respuesta por defecto
  console.log("No se encontraron coincidencias, usando respuesta por defecto");
  return {
    choices: [
      {
        message: {
          content: defaultResponses[Math.floor(Math.random() * defaultResponses.length)]
        }
      }
    ]
  };
}

// Función para llamar a la API de Hugging Face (ahora como fallback)
async function callHuggingFace(userMessage: string, _systemPrompt: string) {
  try {
    // Simplemente delegamos a generateSmartResponse
    // Ya no intentamos llamar a la API externa
    return await generateSmartResponse(userMessage, _systemPrompt);
  } catch (error) {
    console.error("Error al generar respuesta:", error);
    throw error;
  }
}

// Función para llamar a la API adecuada
async function callOpenAI(userMessage: string, systemPrompt: string) {
  try {
    // Siempre intentar usar Hugging Face
    if (USAR_HUGGINGFACE) {
      const response = await callHuggingFace(userMessage, systemPrompt);
      
      // Si la respuesta es un string (viene de generateSmartResponse)
      if (typeof response === 'string') {
        return {
          choices: [
            {
              message: {
                content: response
              }
            }
          ]
        };
      }
      
      // Si ya tiene el formato esperado, devolverlo directamente
      return response;
    }
    
    // Si llegamos aquí, es porque no se ha configurado ninguna API
    throw new Error("No hay API configurada");
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    
    // Si hay un error, devolver un mensaje de error claro
    return {
      choices: [
        {
          message: {
            content: "Lo siento, estoy teniendo problemas para conectarme con mi base de conocimiento. Por favor, intenta de nuevo más tarde."
          }
        }
      ]
    };
  }
}

// Este es el contexto que le darás a ChatGPT sobre ti y tu experiencia
const SYSTEM_PROMPT = `Eres un asistente virtual amigable para el portafolio de Eduardo Rojo, un ingeniero en informática.
Información sobre Eduardo:
- Es graduado de Ingeniería en Informática de Santo Tomás Arica con distinción máxima (2018-2023)
- Su proyecto de tesis fue una aplicación de hábitos de estudio en React Native, calificado con 6,9
- Tiene experiencia desde 2016, comenzando en el liceo Antonio Varas de la Barra
- Sus habilidades incluyen: JavaScript, TypeScript, React, Node.js, Python, SQL, PHP, C++, C#, Blazor, React Native, Figma, Fresh, Deno
- Ha trabajado en proyectos de e-commerce, aplicaciones móviles, y sitios web de portafolio
- Le gusta el desarrollo web moderno y minimalista
- Email de contacto: rojoserranoe@gmail.com

Instrucciones:
1. Responde siempre amigablemente y con entusiasmo, usando emoji ocasionalmente.
2. Mantén las respuestas breves y concisas, máximo 3-4 oraciones.
3. Si te preguntan sobre Eduardo, responde con la información proporcionada.
4. Si te preguntan algo fuera de contexto o divertido, puedes responder con humor pero siempre trayendo la conversación de vuelta a Eduardo.
5. Si te preguntan algo que no sabes, admite que no tienes esa información.
6. No inventes información que no esté en el contexto proporcionado.`;

export const handler: Handlers = {
  async POST(req) {
    try {
      const { message } = await req.json();
      
      if (!message || typeof message !== "string") {
        return new Response(JSON.stringify({ error: "Se requiere un mensaje válido" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Limitar la longitud del mensaje para evitar abusos
      const trimmedMessage = message.trim().substring(0, 500);
      
      // Llamar a la API de OpenAI con nuestra función simplificada
      const chatCompletion = await callOpenAI(trimmedMessage, SYSTEM_PROMPT);
      
      // Manejar la respuesta de manera segura
      let reply = "Lo siento, tuve un problema generando una respuesta.";
      
      if (chatCompletion && chatCompletion.choices && chatCompletion.choices.length > 0) {
        if (chatCompletion.choices[0].message && chatCompletion.choices[0].message.content) {
          reply = chatCompletion.choices[0].message.content;
        }
      }

      return new Response(JSON.stringify({ reply }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error al llamar a OpenAI:", error);
      return new Response(JSON.stringify({ 
        error: "Error al procesar tu solicitud",
        details: error instanceof Error ? error.message : String(error)
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
