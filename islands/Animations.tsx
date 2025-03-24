import { useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

// Define tipos para GSAP
interface GSAP {
  to: (target: HTMLElement | HTMLElement[] | string, config: Record<string, unknown>) => GSAPTween;
  from: (target: HTMLElement | HTMLElement[] | string, config: Record<string, unknown>) => GSAPTween;
  set: (target: HTMLElement | HTMLElement[] | string, config: Record<string, unknown>) => void;
  timeline: (config?: Record<string, unknown>) => GSAPTimeline;
  registerPlugin: (...plugins: unknown[]) => void;
  utils: {
    toArray: (target: string | HTMLElement | HTMLElement[]) => HTMLElement[];
  };
}

interface GSAPTween {
  pause: () => GSAPTween;
  play: () => GSAPTween;
  resume: () => GSAPTween;
  reverse: () => GSAPTween;
}

interface GSAPTimeline extends GSAPTween {
  from: (target: HTMLElement | HTMLElement[] | string, config: Record<string, unknown>, position?: string) => GSAPTimeline;
  to: (target: HTMLElement | HTMLElement[] | string, config: Record<string, unknown>, position?: string) => GSAPTimeline;
  // Para poder controlar el tiempo total de la animación
  totalDuration: (newDuration?: number) => number | GSAPTimeline;
  // Para añadir callbacks
  add: (callback: () => void, position?: string) => GSAPTimeline;
}

interface ScrollTriggerPlugin {
  create: (config: Record<string, unknown>) => void;
}

// Declare gsap as a global variable to use it with CDN
declare global {
  interface GlobalThis {
    gsap: GSAP;
    ScrollTrigger: ScrollTriggerPlugin;
  }
}

export default function Animations() {
  useEffect(() => {
    if (!IS_BROWSER) return;

    // Primero, asegurarse de que todo esté oculto inicialmente con CSS
    // Este estilo permanecerá hasta que todas las animaciones estén listas
    const style = document.createElement('style');
    style.innerHTML = `
      body > div > main > * {
        opacity: 0 !important;
        visibility: hidden !important;
      }
    `;
    document.head.appendChild(style);

    const gsap = (globalThis as unknown as { gsap: GSAP }).gsap;
    const ScrollTrigger = (globalThis as unknown as { ScrollTrigger: ScrollTriggerPlugin }).ScrollTrigger;
    const TextPlugin = (globalThis as unknown as { TextPlugin: unknown }).TextPlugin;

    // Register plugins
    gsap.registerPlugin(ScrollTrigger, TextPlugin);
    
    // El estilo inicial no se elimina inmediatamente, sino al finalizar la animación principal
    
    // Configurar las posiciones iniciales para la animación inmediata
    // Simplemente establecemos opacidad 0 sin mover los elementos de su posición
    // para evitar el efecto de "desaparecer y volver"
    gsap.set("header", { opacity: 0 });
    gsap.set("#sobre-mí", { opacity: 0 });
    gsap.set(".lg\\:col-span-4", { opacity: 0 });
    gsap.set("#habilidades", { opacity: 0 });
    gsap.set("#proyectos", { opacity: 0 });
    gsap.set("#ia-chat", { opacity: 0 });
    gsap.set("footer", { opacity: 0 });
    
    // Timeline principal - arranca con transiciones más suaves
    const mainTl = gsap.timeline({
      defaults: {
        ease: "sine.inOut", // Curva de easing más suave
        duration: 0.5 // Duración un poco mayor para fluidez
      },
      onComplete: () => {
        // Asegurar que todo sea 100% visible al finalizar
        gsap.set("header, #sobre-mí, .lg\\:col-span-4, #habilidades, #proyectos, #ia-chat, footer, .project-card", {
          opacity: 1,
          clearProps: "all" // Limpiar todas las propiedades GSAP
        });
        
        // Eliminar el estilo inicial solo DESPUÉS de que todas las animaciones hayan terminado
        if (document.head.contains(style)) {
          document.head.removeChild(style);
        }
      }
    });
    
    // Nos aseguramos de que el chat de IA esté correctamente configurado para la animación
    // pero no ocultamos su contenedor completamente

    // 1. PRIMERO: Header - aparece gradualmente
    mainTl.to("header", {
      opacity: 1,
      duration: 0.6,
      ease: "sine.inOut" // Efecto más suave y fluido
    })
      
    // Animación suave para el título 
    .from(".title-animation .text-nothing-white", {
      opacity: 0,
      y: 15, // Menos movimiento
      duration: 0.7,
      ease: "sine.out", // Efecto más suave sin rebote
      stagger: 0.04, // Stagger más rápido
    }, "-=0.4")
    .from(".title-animation .text-nothing-red", {
      opacity: 0,
      y: 15, // Menos movimiento
      duration: 0.7,
      ease: "sine.out", // Efecto más suave sin rebote
      stagger: 0.04, // Stagger más rápido
    }, "-=0.6")
      .from("header p", {
        opacity: 0,
        y: 10, // Menos movimiento
        duration: 0.5,
        ease: "sine.out"
      }, "-=0.4")
      .from("header nav a", {
        opacity: 0,
        y: 10, // Menos movimiento
        stagger: 0.05, // Más rápido
        duration: 0.4,
        ease: "sine.out"
      }, "-=0.4")
      .from("header .flex.gap-3 a", {
        opacity: 0,
        y: 5, // Menos movimiento
        stagger: 0.05, // Más rápido
        duration: 0.3,
        ease: "sine.out"
      }, "-=0.3");
    // 2. SEGUNDO: Sobre mí - aparece suavemente después del header
    mainTl.to("#sobre-mí", {
      opacity: 1,
      duration: 0.6,
      ease: "sine.inOut"
    }, "-=0.2") // Ligero overlap
    
    // Animar foto con una transición fluida
    .to(".lg\\:col-span-4", { // Columna de foto
      opacity: 1,
      duration: 0.6,
      ease: "sine.inOut"
    }, "-=0.5") // Mayor overlap para que aparezcan casi juntos
    
    // Elementos internos de la foto con animación suave
    .to(".w-48.h-48", { // Círculo de perfil
      opacity: 1,
      duration: 0.5,
      ease: "sine.out" // Efecto suave sin rebote
    }, "-=0.4")
      // Animación para el texto principal - usar el texto original del HTML
      .to(".typing-animation", {
        opacity: 1,
        duration: 0.2,
        onStart: () => {
          const element = document.querySelector(".typing-animation");
          if (element instanceof HTMLElement) {
            // Guardar el texto original antes de borrarlo
            const originalText = element.textContent || "";
            // Asegurarse de que tengamos el texto correcto
            const text = originalText.trim() || "Soy un ingeniero en informática apasionado por crear soluciones digitales innovadoras. Con una sólida formación en computación desde 2016, me especializo en desarrollo web y aplicaciones modernas.";
            
            // Borrar el texto para la animación
            element.textContent = "";
            
            // Animar la escritura del texto original
            gsap.to(element, {
              duration: 1.5,
              text: {
                value: text,
                delimiter: ""
              },
              ease: "none"
            });
          }
        }
      }, "-=0.1")
      // Animación para la cita - usar el texto original del HTML
      .from(".typing-quote", {
        opacity: 0,
        duration: 0.2,
        onStart: () => {
          const element = document.querySelector(".typing-quote");
          if (element instanceof HTMLElement) {
            // Guardar el texto original antes de borrarlo
            const originalText = element.textContent || "";
            // Usar el texto original o un texto predeterminado si está vacío
            const text = originalText.trim() || "Mi objetivo es crear experiencias digitales que combinen funcionalidad con diseño intuitivo.";
            
            // Aplicar el texto
            element.textContent = text;
          }
        }
      }, "-=0.1");

    // 3. TERCERO: Habilidades - aparece con un efecto en cascada más fluido
    mainTl.to("#habilidades", {
      opacity: 1,
      duration: 0.6,
      ease: "sine.inOut",
      delay: 0.2, // Delay más corto para mantener un ritmo suave
      onComplete: () => {
        gsap.to("#habilidades h2 .absolute", {
          scaleX: 1,
          duration: 0.3,
          ease: "sine.inOut"
        });
      }
    })
    
    // Skills items con efecto de cascada más suave
    .from("#habilidades h3", {
      opacity: 0,
      y: -10, // Menos movimiento
      duration: 0.5,
      stagger: 0.08, // Stagger más suave
      ease: "sine.out" // Efecto más fluido
    }, "-=0.2")
    
    // Habilidades individuales con efecto en cascada suave
    .from("#habilidades .skill-item", {
      opacity: 0,
      y: -8, // Menos movimiento
      duration: 0.4,
      stagger: 0.03, // Stagger más suave
      ease: "sine.out" // Efecto más fluido
    }, "-=0.3"); // Mayor overlap
    
    // Añadir efecto de hover a las habilidades
    const skillItems = document.querySelectorAll(".skill-item");
    skillItems.forEach((skill) => {
      if (!(skill instanceof HTMLElement)) return;
      
      skill.addEventListener("mouseenter", () => {
        gsap.to(skill, {
          backgroundColor: "#ff0000",
          color: "#ffffff",
          scale: 1.1,
          duration: 0.3,
          ease: "power1.out"
        });
      });
      
      skill.addEventListener("mouseleave", () => {
        gsap.to(skill, {
          backgroundColor: "",
          color: "",
          scale: 1,
          duration: 0.3,
          ease: "power1.in"
        });
      });
    }, 2000); // 2 seconds delay

    // Proyectos - aparecen con efecto en cascada suave después de habilidades
    mainTl.to("#proyectos", {
      opacity: 1,
      duration: 0.6,
      ease: "sine.inOut",
      delay: 0.3, // Delay moderado para mantener flujo
      onComplete: () => {
        gsap.to("#proyectos h2 .absolute", {
          scaleX: 1,
          duration: 0.3,
          ease: "sine.inOut"
        });
      }
    })
    
    // Títulos de proyectos con efecto de cascada suave
    .from("#proyectos h3", {
      opacity: 0,
      y: -10, // Menos movimiento
      duration: 0.5,
      stagger: 0.08, // Stagger más suave
      ease: "sine.out" // Efecto más fluido
    }, "-=0.2")
    
    // Project cards con efecto en cascada suave
    .from(".project-card", {
      opacity: 0,
      y: -12, // Menos movimiento
      duration: 0.5,
      stagger: 0.06, // Stagger más suave pero visible
      ease: "sine.out" // Efecto más fluido sin rebote
    }, "-=0.3"); // Mayor overlap

    // Continuous hover animation for project cards
    const projectCards = document.querySelectorAll(".project-card");
    projectCards.forEach((card) => {
      if (!(card instanceof HTMLElement)) return;
      
      // Animación de la línea roja
      const redLine = card.querySelector(".absolute");
      if (redLine instanceof HTMLElement) {
        gsap.set(redLine, { height: 0 });
      }
      
      // Add hover state
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          scale: 1.03,
          boxShadow: "0 10px 25px rgba(255, 0, 0, 0.2)",
          duration: 0.3
        });
        
        if (redLine instanceof HTMLElement) {
          gsap.to(redLine, {
            height: "100%",
            duration: 0.4,
            ease: "power2.out"
          });
        }
        
        // Animar las etiquetas de tecnología
        const techTags = card.querySelectorAll(".text-xs");
        const techTagsArray = Array.from(techTags) as HTMLElement[];
        gsap.to(techTagsArray, {
          backgroundColor: "#ff0000",
          color: "#ffffff",
          stagger: 0.1,
          duration: 0.3
        });
      });
      
      // Remove hover state
      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          scale: 1,
          boxShadow: "none",
          duration: 0.3
        });
        
        if (redLine instanceof HTMLElement) {
          gsap.to(redLine, {
            height: 0,
            duration: 0.4,
            ease: "power2.in"
          });
        }
        
        // Restaurar las etiquetas de tecnología
        const techTags = card.querySelectorAll(".text-xs");
        const techTagsArray = Array.from(techTags) as HTMLElement[];
        gsap.to(techTagsArray, {
          backgroundColor: "#000000",
          color: "#ff0000",
          stagger: 0.1,
          duration: 0.3
        });
      });
    }, 2000); // 2 seconds delay

    // Eliminamos la animación ScrollTrigger separada para el chat de IA
    // ya que causa conflicto con la animación principal
    
    // 4. CUARTO: IA Chat - aparece suavemente después de proyectos/habilidades
    mainTl.to("#ia-chat", {
      opacity: 1,
      visibility: "visible",
      duration: 0.6,
      ease: "sine.inOut",
      delay: 0.1, // Pequeño delay para mantener el flujo
      onComplete: () => {
        // Aplicar animación al título
        gsap.to("#ia-chat h2 .absolute", {
          scaleX: 1,
          duration: 0.3,
          ease: "sine.inOut"
        });
        
        // Nos aseguramos de que el componente completo del chat de IA sea visible
        // y permanezca visible
        gsap.set("#ia-chat, #ia-chat .md\\:w-2\\/3, #ia-chat .rounded-lg.border", {
          opacity: 1,
          visibility: "visible",
          clearProps: "opacity,visibility"
        });
      }
    })

    // Elementos internos del chat con efecto de aparición suave
    .to("#ia-chat .border-l-4 li", {
      opacity: 1,
      stagger: 0.04, // Stagger más suave
      ease: "sine.out",
      duration: 0.4
    }, "-=0.3")
    .to("#ia-chat .md\\:w-2\\/3", {
      opacity: 1,
      ease: "sine.out",
      duration: 0.4
    }, "-=0.2");

    // Add continuous effects immediately without delay
    // Efecto que invita a escribir un mensaje en el chat
    const chatInputContainer = document.querySelector(".chat-input-container");
    if (chatInputContainer) {
      // Efecto de brillo en el borde del input
      gsap.to(".chat-input-container", {
        boxShadow: "0 0 8px rgba(255, 0, 0, 0.6)",
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      
     
    }
    
    // Añadir un efecto de pulso al borde rojo del cuadro de sugerencias
    gsap.to("#ia-chat .border-l-4", {
      borderLeftColor: "rgba(255, 0, 0, 0.5)",
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    // 5. QUINTO: Footer con animación suave al final
    mainTl.to("footer", {
      opacity: 1,
      duration: 0.6,
      ease: "sine.inOut",
      delay: 0.2 // Pequeño delay para flujo natural
    }, "-=0.1") // Overlap suave
    
    // Texto del footer con efecto suave
    .to(".typing-text", {
      opacity: 1,
      duration: 0.4,
      ease: "sine.out",
      onStart: () => {
        const typingText = document.querySelector(".typing-text");
        if (typingText instanceof HTMLElement) {
          typingText.style.color = "#ff0000";
          typingText.textContent = "Diseñado con ❤️ usando Fresh, Deno y GSAP";
        }
      }
    }, "-=0.3");
    
    // Asegurar que todo cargue en menos de 1.5 segundos
    mainTl.totalDuration(1.2);
    
    // Asegurarse de que el chat de IA permanezca visible después de las animaciones
    // Usar un enfoque alternativo para evitar problemas con TypeScript
    mainTl.to("#ia-chat", { 
      opacity: 1, 
      visibility: "visible",
      immediateRender: false,  // No renderizar inmediatamente
      delay: 1.0  // Asegurar que se ejecute después de todas las animaciones
    });

    // Add parallax effect to sections - happens after main animation sequence
    gsap.utils.toArray(".parallax-section").forEach((section: HTMLElement) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        onEnter: () => {
          gsap.to(section, {
            y: 30,
            duration: 1.5,
            ease: "power1.out"
          });
        },
        onLeaveBack: () => {
          gsap.to(section, {
            y: 0,
            duration: 1.5,
            ease: "power1.in"
          });
        }
      });
    }, 2000); // 2 seconds delay

    // Create particles in the background
    createParticles();

  }, []);

  function createParticles() {
    if (!IS_BROWSER) return;
    
    const gsap = (globalThis as unknown as { gsap: GSAP }).gsap;
    const particleContainer = document.getElementById("particle-container");
    if (!particleContainer) return;
    
    // Clear any existing particles
    particleContainer.innerHTML = "";
    
    // Create particles
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.position = "absolute";
      particle.style.width = "4px";
      particle.style.height = "4px";
      particle.style.backgroundColor = i % 3 === 0 ? "#ff0000" : "#ffffff";
      particle.style.borderRadius = "50%";
      particle.style.opacity = "0.3"; // Establecer una opacidad inicial visible
      
      particleContainer.appendChild(particle);
      
      // Position randomly
      gsap.set(particle, {
        x: Math.random() * globalThis.innerWidth,
        y: Math.random() * globalThis.innerHeight
      });
      
      // Animate
      gsap.to(particle, {
        duration: 10 + Math.random() * 20,
        opacity: 0.2 + Math.random() * 0.5, // Mínimo 0.2 de opacidad
        x: "+=" + (Math.random() * 300 - 150),
        y: "+=" + (Math.random() * 300 - 150),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: Math.random() * 5
      });
    }
  }

  // Only render a hidden container for particles in the browser
  if (!IS_BROWSER) {
    return null;
  }

  return (
    <div id="particle-container" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}></div>
  );
  // Cambiamos zIndex de -1 a 0 para asegurar que las partículas sean visibles
}
