import { useSignal } from "@preact/signals";
import { useRef, useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
// GSAP import con interfaz TypeScript para evitar errores
const gsap = IS_BROWSER 
  ? (window as unknown as { 
      gsap: { 
        fromTo: (elements: any, fromVars: any, toVars: any) => any;
        to: (elements: any, vars: any) => any;
      } 
    }).gsap 
  : null;

// Temas que la IA puede responder (para los botones de sugerencia)
const temasSugeridos = [
  "Proyectos",
  "Educación",
  "Habilidades",
  "Experiencia",
  "Contacto",
  "Hobbies",
  "Tecnologías",
  "Música",
  "Videojuegos"
];

export default function AIChat() {
  const input = useSignal("");
  const userName = useSignal(""); // Estado para almacenar el nombre del usuario
  const isNamePopupOpen = useSignal(false); // Estado para controlar la visibilidad del popup de nombre
  const nameInput = useSignal(""); // Estado para el input del nombre en el popup
  const messages = useSignal<{ role: "user" | "assistant"; content: string }[]>([
    { 
      role: "assistant", 
      content: "¡Hola! Soy SobremIA, creada por Eduardo. ¿En qué puedo ayudarte hoy? 🚀" 
    }
  ]);
  const isLoading = useSignal(false);
  const isError = useSignal(false);
  const showSuggestions = useSignal(true); // Mostrar sugerencias inicialmente
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const chatWrapperRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const namePopupRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages change y GSAP animations más sutiles
  useEffect(() => {
    // Usar setTimeout para asegurar que el scroll se ejecute después de la renderización
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 10);
    
    // Animate the newest message if there's more than one - animación más sutil
    if (IS_BROWSER && gsap && messages.value.length > 1) {
      const messageElements = document.querySelectorAll('.message-bubble');
      const lastMessage = messageElements[messageElements.length - 1];
      
      if (lastMessage) {
        gsap.fromTo(lastMessage, 
          { opacity: 0.9, y: 5 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power1.out" }
        );
      }
    }
  }, [messages.value]);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    // Si no hay contenido en el input, no hacer nada
    if (!input.value.trim() || isLoading.value) return;

    // Si no tenemos nombre de usuario, abrir el popup para pedirlo
    if (!userName.value) {
      isNamePopupOpen.value = true;
      return;
    }

    // Proceso normal para mensajes
    const userMessage = input.value.trim();
    messages.value = [...messages.value, { role: "user", content: userMessage }];
    input.value = "";
    isLoading.value = true;
    isError.value = false;
    showSuggestions.value = false; // Ocultar sugerencias cuando se envía un mensaje
    showTopicButtons.value = false; // Ocultar botones de temas mientras se procesa la respuesta

    try {
      // Mostrar mensaje temporal con puntos de carga
      messages.value = [...messages.value, { role: "assistant", content: "" }];
      const msgIndex = messages.value.length - 1;
      
      // Llamar a la API de OpenAI con el nombre del usuario
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          userName: userName.value // Incluir el nombre en la petición
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      // Personalizar la respuesta con el nombre si no está ya incluido
      let aiResponse = data.reply;
      
      // Solo añadir el nombre si no está ya incluido en la respuesta
      // y si es una respuesta que podría beneficiarse de personalización
      if (!aiResponse.includes(userName.value) && 
          !aiResponse.startsWith("Lo siento") && 
          !aiResponse.startsWith("¡Claro!") && 
          Math.random() > 0.3) { // Solo personalizar algunas respuestas para que no sea repetitivo
        
        // Lista de posibles saludos personalizados
        const personalizaciones = [
          `${userName.value}, `, 
          `Bueno ${userName.value}, `, 
          `Mira ${userName.value}, `, 
          `${userName.value}... `,
          `Verás ${userName.value}, `
        ];
        
        // Seleccionar uno al azar
        const personalizacion = personalizaciones[Math.floor(Math.random() * personalizaciones.length)];
        
        // Añadir al inicio de la respuesta
        aiResponse = personalizacion + aiResponse.charAt(0).toLowerCase() + aiResponse.slice(1);
      }
      
      // Dividir la respuesta en múltiples mensajes si contiene "\n\n"
      // Esto permite que SobremIA envíe hasta 3 mensajes consecutivos
      if (aiResponse.includes("\n\n")) {
        // Eliminar el mensaje temporal con puntos de carga
        messages.value = messages.value.slice(0, -1);
        
        // Separar las respuestas
        const multipleResponses = aiResponse.split("\n\n");
        
        // Agregar cada respuesta como un mensaje independiente con efecto de tipeo
        for (let j = 0; j < multipleResponses.length; j++) {
          const response = multipleResponses[j];
          
          // Agregar un nuevo mensaje vacío para esta respuesta
          messages.value = [...messages.value, { role: "assistant", content: "" }];
          const newMsgIndex = messages.value.length - 1;
          
          // Aplicar efecto de tipeo a esta respuesta
          for (let i = 0; i < response.length; i++) {
            await new Promise(r => setTimeout(r, 5));
            const updatedMessages = [...messages.value];
            updatedMessages[newMsgIndex].content += response[i];
            messages.value = updatedMessages;
          }
          
          // Pequeña pausa entre mensajes
          if (j < multipleResponses.length - 1) {
            await new Promise(r => setTimeout(r, 500));
          }
        }
      } else {
        // Comportamiento normal para una sola respuesta
        // Typing effect character by character
        for (let i = 0; i < aiResponse.length; i++) {
          await new Promise(r => setTimeout(r, 5)); // Velocidad de tipeo
          const updatedMessages = [...messages.value];
          updatedMessages[msgIndex].content += aiResponse[i];
          messages.value = updatedMessages;
        }
      }
      
      // Mostrar los botones de temas después de recibir una respuesta
      showTopicButtons.value = true;
    } catch (error) {
      console.error("Error:", error);
      isError.value = true;
      messages.value = [...messages.value.slice(0, -1), { 
        role: "assistant", 
        content: userName.value ? 
          `¡Ups, ${userName.value}! No pude conectarme con mi cerebro AI. ¿Podrías intentarlo de nuevo en unos momentos? 🤖💥` :
          "¡Ups! No pude conectarme con mi cerebro AI. ¿Podrías intentarlo de nuevo en unos momentos? 🤖💥" 
      }];
    } finally {
      isLoading.value = false;
    }
  };

  // Función para sugerir respuestas al hacer clic en las sugerencias
  const handleSuggestionClick = (suggestion: string) => {
    input.value = suggestion;
    const event = new Event("submit");
    document.querySelector("form")?.dispatchEvent(event);
  }

  // Ejemplos de preguntas para sugerir al usuario
  const suggestionExamples = [
    "¿Cuáles son tus habilidades principales?",
    "Cuéntame sobre tu proyecto de tesis",
    "¿Qué tecnologías dominas?",
    "¿Cuál es tu experiencia profesional?",
    "¿Cómo puedo contactarte?",
    "¿Qué proyectos destacados has desarrollado?"
  ];
  
  // Estado para controlar la visibilidad de los botones de temas
  const showTopicButtons = useSignal(false); // Inicialmente ocultos

  // Click handler para las sugerencias de texto en el chat
  useEffect(() => {
    if (IS_BROWSER) {
      const suggestionItems = document.querySelectorAll('#ia-chat-suggestions span');
      suggestionItems.forEach(item => {
        item.addEventListener('click', () => {
          const text = item.textContent || '';
          handleSuggestionClick(text);
        });
      });

      // Cleanup
      return () => {
        suggestionItems.forEach(item => {
          item.removeEventListener('click', () => {});
        });
      };
    }
  }, []);
  
  // Click handler para los botones de temas - se actualiza cada vez que cambia showTopicButtons
  useEffect(() => {
    if (IS_BROWSER && showTopicButtons.value) {
      const topicButtons = document.querySelectorAll('#topic-buttons button');
      topicButtons.forEach(button => {
        button.addEventListener('click', () => {
          const topic = button.textContent || '';
          // Personalizar la pregunta con el nombre del usuario
          handleSuggestionClick(`Cuéntame sobre ${topic} para mi perfil, ${userName.value}`);
          showTopicButtons.value = false;
        });
      });
      
      // Cleanup
      return () => {
        topicButtons.forEach(button => {
          button.removeEventListener('click', () => {});
        });
      };
    }
  }, [showTopicButtons.value]);
  
  // GSAP animations para elementos del chat cuando se carga
  useEffect(() => {
    if (IS_BROWSER && gsap) {
      // Animación para el header
      if (headerRef.current) {
        gsap.fromTo(headerRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
        );
      }
      
      // Animación para el chat completo
      if (chatWrapperRef.current) {
        gsap.fromTo(chatWrapperRef.current,
          { opacity: 0, scale: 0.98 },
          { opacity: 1, scale: 1, duration: 0.8, ease: "expo.out", delay: 0.2 }
        );
      }
      
      // Animación para las sugerencias
      const suggestions = document.querySelectorAll('#ia-chat-suggestions span');
      gsap.fromTo(suggestions,
        { opacity: 0, y: 10, stagger: 0.05 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.4, delay: 0.5, ease: "power1.out" }
      );
      
      // Animación para los botones de temas
      const topicButtons = document.querySelectorAll('#topic-buttons button');
      gsap.fromTo(topicButtons,
        { opacity: 0, y: 10, stagger: 0.05 },
        { opacity: 1, y: 0, stagger: 0.05, duration: 0.4, delay: 0.3, ease: "power1.out" }
      );
      
      // Efecto hover para sugerencias y botones de temas
      const hoverElements = document.querySelectorAll('#ia-chat-suggestions span, #topic-buttons button');
      hoverElements.forEach(item => {
        item.addEventListener('mouseenter', () => {
          gsap.to(item, { scale: 1.05, duration: 0.2, ease: "power1.out" });
        });
        
        item.addEventListener('mouseleave', () => {
          gsap.to(item, { scale: 1, duration: 0.2, ease: "power1.out" });
        });
      });
      
      // Animación para el primer mensaje
      const firstMessage = document.querySelector('.message-bubble');
      if (firstMessage) {
        gsap.fromTo(firstMessage,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.6, delay: 0.3, ease: "back.out(1.4)" }
        );
      }
    }
  }, []);

  // Función para guardar el nombre en analytics y sesiones activas
  useEffect(() => {
    // Este efecto se ejecuta cuando el nombre del usuario cambia de vacío a tener un valor
    if (IS_BROWSER && userName.value) {
      // Aquí podemos implementar la lógica para guardar el nombre en analytics
      try {
        // Almacenar en sessionStorage para persistir durante la sesión
        sessionStorage.setItem('sobremIA_userName', userName.value);
        
        // Se podría enviar a un endpoint de analytics para registrar el usuario
        // Esta parte dependería de la implementación específica de analytics que uses
        console.log(`Usuario '${userName.value}' registrado en la sesión`);
        
        // También se podría enviar como evento a analytics
        if (typeof window !== 'undefined' && 'gtag' in window) {
          // @ts-ignore - Ignorar error de tipado para gtag
          window.gtag?.('event', 'user_registered', {
            'user_name': userName.value,
            'session_start': new Date().toISOString()
          });
        }
      } catch (error) {
        console.error("Error al guardar el nombre de usuario:", error);
      }
    }
  }, [userName.value]);

  // Manejar la animación del popup
  useEffect(() => {
    if (IS_BROWSER && gsap && namePopupRef.current) {
      if (isNamePopupOpen.value) {
        // Animación para el fondo del popup (overlay)
        const overlay = document.querySelector('.name-popup-overlay') as HTMLElement;
        if (overlay) {
          gsap.fromTo(
            overlay,
            { opacity: 0 },
            { opacity: 1, duration: 0.3, ease: "power1.out" }
          );
        }
        
        // Animación para mostrar el popup
        gsap.fromTo(
          namePopupRef.current,
          { opacity: 0, scale: 0.9, y: 10 },
          { 
            opacity: 1, 
            scale: 1, 
            y: 0, 
            duration: 0.3, 
            ease: "power2.out" 
          }
        );
        
        // Poner focus en el input del nombre
        setTimeout(() => {
          document.getElementById("name-input")?.focus();
        }, 100);
      }
    }
  }, [isNamePopupOpen.value]);

  // Función para manejar el envío del nombre
  const handleNameSubmit = (e: Event) => {
    e.preventDefault();
    if (!nameInput.value.trim()) return;
    
    const name = nameInput.value.trim();
    userName.value = name;
    isNamePopupOpen.value = false;
    
    // Mostrar mensaje de bienvenida personalizado como primer mensaje de la IA
    messages.value = [
      {
        role: "assistant",
        content: `¡Hola ${name}! 😊 Soy SobremIA, creada por Eduardo. ¿En qué puedo ayudarte hoy?`
      }
    ];
    
    // Procesar la consulta del usuario que intentó enviar
    if (input.value.trim()) {
      const event = new Event("submit");
      document.querySelector("form")?.dispatchEvent(event);
    }
  };

  // Recuperar el nombre del usuario de sessionStorage al cargar el componente
  useEffect(() => {
    if (IS_BROWSER) {
      try {
        const savedUserName = sessionStorage.getItem('sobremIA_userName');
        if (savedUserName) {
          userName.value = savedUserName;
          
          // Actualizar el mensaje de bienvenida para usuarios que regresan
          messages.value = [{ 
            role: "assistant", 
            content: `¡Hola de nuevo, ${savedUserName}! 😊 Me alegra verte otra vez. ¿En qué puedo ayudarte hoy?` 
          }];
          
          console.log(`Usuario recuperado de la sesión: ${savedUserName}`);
        }
      } catch (error) {
        console.error("Error al recuperar el nombre de usuario:", error);
      }
    }
  }, []);

  if (!IS_BROWSER) {
    return <div>Cargando chat...</div>;
  }

  return (
    <div>
      {/* Título SobreMIA fuera del chat */}
      <div class="flex items-center text-white font-bold mb-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 sm:h-7 sm:w-7 mr-2 relative z-10">
          <path d="M12 6V2H8"/>
          <path d="m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z"/>
          <path d="M2 12h2"/>
          <path d="M9 11v2"/>
          <path d="M15 11v2"/>
          <path d="M20 12h2"/>
        </svg>
        <span class="text-xl sm:text-2xl tracking-tight">SobremIA Chat</span>
        <a href="#chat" class="ml-2 sm:ml-3 flex items-center text-nothing-red hover:text-nothing-red/80 transition-colors duration-300 group relative">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z"/>
          </svg>
          <span class="ml-1 text-xs sm:text-sm">Modelo e1</span>
          <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-nothing-black text-nothing-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Arquitectura neuronal propia desarrollada por Eduardo Rojo
          </div>
        </a>
      </div>
      
      <div ref={chatWrapperRef} class="flex flex-col h-auto max-h-[calc(100vh-14rem)] sm:max-h-[calc(100vh-16rem)] bg-nothing-black/50 rounded-lg border border-nothing-gray/30 shadow-lg overflow-hidden">
        {/* Estilos globales para la scrollbar roja */}
        <style>
          {`
            /* Estilo para scrollbar roja - compatible con todos los navegadores */
            .chat-messages {
              overflow-y: auto;
              scrollbar-width: thin;
              scrollbar-color: #ff0000 #1a1a1a;
              -webkit-overflow-scrolling: touch;
              scroll-behavior: smooth;
              position: relative;
            }
            
            .chat-messages::-webkit-scrollbar {
              width: 12px;
              background-color: #1a1a1a;
            }
            
            .chat-messages::-webkit-scrollbar-thumb {
              background-color: #ff0000;
              border-radius: 6px;
              border: 3px solid #1a1a1a;
              min-height: 50px;
            }
            
            .chat-messages::-webkit-scrollbar-thumb:hover {
              background-color: #ff3333;
            }
            
            .chat-messages::-webkit-scrollbar-track {
              background-color: #1a1a1a;
              border-radius: 6px;
            }
            
            /* Asegurar que el contenido no se superponga a la scrollbar */
            .chat-messages > * {
              margin-right: 5px;
            }
          `}
        </style>

        {/* Chat messages */}
        <div 
          ref={chatContainerRef} 
          class="flex-1 overflow-y-auto p-4 space-y-4 chat-messages"
          style="min-height: 350px; max-height: 550px; background: linear-gradient(to bottom, #000000, #0a0a0a 15%, #000000 40%); background-attachment: local; will-change: scroll-position;"
        >
        {/* Sugerencias de preguntas - mostrar desde el principio independientemente del nombre del usuario */}
        {showSuggestions.value && messages.value.length === 1 && (
          <div class="mb-6 bg-gradient-to-br from-nothing-gray/30 to-nothing-gray/10 p-4 rounded-lg border border-nothing-gray/30 backdrop-blur-sm shadow-lg">
            <p class="text-nothing-white mb-2 font-medium flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2 text-nothing-red"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              {userName.value ? `${userName.value}, estas` : "Estas"} son algunas preguntas populares:
            </p>
            <div id="ia-chat-suggestions" class="flex flex-wrap gap-2">
              {suggestionExamples.map((suggestion, index) => (
                <span 
                  key={index}
                  class="px-3 py-1.5 bg-gradient-to-r from-nothing-gray/40 to-nothing-gray/20 text-nothing-white text-sm rounded-full cursor-pointer border border-nothing-gray/40 hover:border-nothing-red/50 hover:from-nothing-red/20 hover:to-nothing-red/10 transition-all duration-300 shadow-sm"
                  onClick={() => {
                    // Si no hay nombre, mostrar popup primero
                    if (!userName.value) {
                      nameInput.value = ""; // Limpiar input por si acaso
                      isNamePopupOpen.value = true;
                      // Guardar la sugerencia para usarla después
                      input.value = suggestion;
                    } else {
                      handleSuggestionClick(suggestion);
                    }
                  }}
                >
                  {suggestion}
                </span>
              ))}
            </div>
          </div>
        )}
        {messages.value.map((message, index) => (
          <div
            key={index}
            class={`flex ${message.role === "user" ? "justify-end" : "justify-start"} message-item`}
          >
            {/* Avatar para SobremIA */}
            {message.role === "assistant" && (
              <div class="h-6 w-6 sm:h-8 sm:w-8 rounded-full flex-shrink-0 mr-2 overflow-hidden relative">
                <img src="/sparkle.png" alt="SobremIA" class="w-full h-full object-cover" />
              </div>
            )}
            
            <div
              class={`max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-3 message-bubble shadow-lg ${
                message.role === "user"
                  ? "bg-gradient-to-br from-nothing-red to-nothing-red/90 text-nothing-white rounded-tr-none"
                  : "bg-gradient-to-br from-nothing-gray/90 to-nothing-gray/80 text-nothing-white rounded-tl-none border border-nothing-gray/50"
              }`}
            >
              {message.role === "assistant" ? (
                <div class="prose prose-invert prose-sm max-w-none">{message.content}</div>
              ) : (
                <div class="flex items-start justify-between">
                  <span class="text-sm sm:text-base">{message.content}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2 mt-1 text-nothing-white/70">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                </div>
              )}
            </div>
            
            {/* Icono de usuario */}
            {message.role === "user" && (
              <div class="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-nothing-red/80 flex items-center justify-center ml-2 border border-nothing-red/30 shadow">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-nothing-white">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            )}
          </div>
        ))}
        {isLoading.value && (
          <div class="flex justify-start message-item">
            <div class="h-6 w-6 sm:h-8 sm:w-8 rounded-full flex-shrink-0 mr-2 overflow-hidden relative">
              <img src="/sparkle.png" alt="SobremIA" class="w-full h-full object-cover" />
            </div>
            <div class="max-w-[85%] sm:max-w-[80%] rounded-lg px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-nothing-gray/80 to-nothing-gray/70 text-nothing-white flex items-center border border-nothing-gray/40 shadow-lg rounded-tl-none">
              <div class="relative mr-3 flex space-x-1">
                <span class="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-nothing-red/80 animate-bounce" style="animation-delay: 0ms"></span>
                <span class="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-nothing-red/80 animate-bounce" style="animation-delay: 150ms"></span>
                <span class="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-nothing-red/80 animate-bounce" style="animation-delay: 300ms"></span>
              </div>
              <span class="text-sm sm:text-base">SobremIA está escribiendo...</span>
            </div>
          </div>
        )}
        </div>

        {/* Botones de temas después de cada respuesta */}
        {showTopicButtons.value && (
          <div id="topic-buttons" class="px-3 sm:px-4 py-2 bg-gradient-to-r from-nothing-black to-nothing-black/95 border-t border-nothing-gray/30">
            <div class="flex flex-wrap gap-1 sm:gap-1.5 justify-center">
              {temasSugeridos.map((tema, index) => (
                <button 
                  key={index}
                  type="button"
                  onClick={() => {
                    if (!userName.value) {
                      nameInput.value = ""; // Limpiar input por si acaso
                      isNamePopupOpen.value = true;
                      // Guardar el tema para usarlo después
                      input.value = `Háblame sobre ${tema}`;
                    } else {
                      handleSuggestionClick(`Háblame sobre ${tema}, ${userName.value}`);
                      showTopicButtons.value = false;
                    }
                  }}
                  class="px-2 py-1 bg-gradient-to-r from-nothing-red/20 to-nothing-red/10 text-nothing-white text-xs rounded-full cursor-pointer border border-nothing-red/20 hover:border-nothing-red/50 hover:from-nothing-red/30 hover:to-nothing-red/20 transition-all duration-300 shadow-sm transform hover:scale-105"
                >
                  {tema}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Input area */}
        <form onSubmit={handleSubmit} class="border-t border-nothing-gray/50 p-3 sm:p-5 flex gap-2 sm:gap-3 chat-input-container bg-gradient-to-b from-nothing-black via-nothing-black to-nothing-black/95 shadow-lg">
          <div class="relative flex-grow group">
            <div class="absolute inset-0 bg-gradient-to-r from-nothing-red/30 to-nothing-red/20 rounded-lg blur opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition duration-200"></div>
            <div class="relative">
              <input
                type="text"
                value={input.value}
                onInput={(e) => (input.value = (e.target as HTMLInputElement).value)}
                onClick={() => {
                  // Abrir popup al hacer clic en el input si no hay nombre
                  if (!userName.value) {
                    isNamePopupOpen.value = true;
                  }
                }}
                placeholder="Pregunta a SobremIA..."
                class="w-full bg-nothing-gray/90 text-nothing-white p-2.5 sm:p-3.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-nothing-red transition-all duration-300 border border-nothing-gray/50 shadow-inner text-sm sm:text-base"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading.value}
            class={`px-4 sm:px-5 py-2.5 sm:py-3.5 bg-gradient-to-r from-nothing-red to-nothing-red/90 text-nothing-white rounded-lg font-bold flex items-center justify-center transition-all duration-300 relative overflow-hidden text-sm sm:text-base
              ${isLoading.value ? 'animate-pulse shadow-lg shadow-nothing-red/50' : 'hover:from-red-600 hover:to-nothing-red shadow-lg hover:shadow-nothing-red/50 shadow-nothing-red/30'}`}
          >
            <div class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-20 transition-opacity duration-300"></div>
            <div class={`w-5 h-5 sm:w-6 sm:h-6 mr-2 relative ${isLoading.value ? 'animate-pulse' : ''}`}>
              <img 
                src="/estrellas.png" 
                alt="IA" 
                class={`w-full h-full object-contain ${isLoading.value ? '' : ''}`} 
              />
              {isLoading.value && (
                <>
                  <div class="absolute inset-0 bg-nothing-red rounded-full opacity-30 animate-ping"></div>
                  <div class="absolute inset-0 bg-white rounded-full opacity-10 scale-150 animate-pulse blur-md"></div>
                </>
              )}
            </div>
            <span class="relative z-10">Enviar</span>
          </button>
        </form>
        
        {/* Mensaje de advertencia - sin espacio extra */}
        <div class="text-center border-t border-nothing-gray/10">
          <span class="text-nothing-red/70 text-[8px] sm:text-[10px] block py-0.5">
            SobremIA puede cometer errores. Considera verificar la información importante.
          </span>
        </div>
      </div>

      {/* Popup para pedir el nombre del usuario */}
      {isNamePopupOpen.value && (
        <div class="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm name-popup-overlay">
          <div 
            ref={namePopupRef}
            class="bg-nothing-black border border-nothing-red/50 rounded-lg p-5 shadow-lg max-w-sm w-full mx-4 relative overflow-hidden"
          >
            {/* Efecto de fondo visual */}
            <div class="absolute -top-24 -right-24 w-48 h-48 bg-nothing-red/20 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-nothing-red/10 rounded-full blur-3xl"></div>
            
            <div class="absolute top-2 right-2 z-10">
              <button 
                onClick={() => {isNamePopupOpen.value = false}}
                class="bg-nothing-red text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
              </button>
            </div>
            
            <div class="relative z-10">
              <h3 class="text-nothing-white text-lg font-bold mb-3 flex items-center">
                <img src="/sparkle.png" alt="SobremIA" class="w-6 h-6 mr-2" />
                Personalizar SobremIA
              </h3>
              
              <p class="text-nothing-white/80 text-sm mb-4">
                Para brindarte una experiencia más personalizada, ¿podrías decirme tu nombre?
              </p>
              
              <form onSubmit={handleNameSubmit} class="space-y-4">
                <div class="relative">
                  <div class="absolute inset-0 bg-gradient-to-r from-nothing-red/30 to-nothing-red/20 rounded-lg blur opacity-0 focus-within:opacity-100 transition duration-200"></div>
                  <input
                    id="name-input"
                    type="text"
                    value={nameInput.value}
                    onInput={(e) => (nameInput.value = (e.target as HTMLInputElement).value)}
                    placeholder="Escribe tu nombre..."
                    class="w-full bg-nothing-gray/90 text-nothing-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-nothing-red transition-all duration-300 border border-nothing-gray/50 shadow-inner"
                    autoFocus
                  />
                </div>
                
                <div class="flex justify-end">
                  <button
                    type="submit"
                    class="px-4 py-2 bg-gradient-to-r from-nothing-red to-nothing-red/90 text-nothing-white rounded-lg font-bold flex items-center justify-center transition-all duration-300 hover:from-red-600 hover:to-nothing-red shadow-lg relative overflow-hidden group"
                  >
                    <div class="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                    <div class="w-5 h-5 mr-2 relative z-10">
                      <img src="/estrellas.png" alt="IA" class="w-full h-full object-contain" />
                    </div>
                    <span class="relative z-10">Continuar</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
