import { useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

type GSAPTarget = string | Element | Element[] | NodeList;
type GSAPVars = Record<string, unknown>;

interface GSAP {
  to: (target: GSAPTarget, vars: GSAPVars) => GSAPTimeline;
  set: (target: GSAPTarget, vars: GSAPVars) => void;
  timeline: (vars?: GSAPVars) => GSAPTimeline;
  utils: {
    toArray: (target: string | NodeList | Element[]) => Element[];
  };
}

interface GSAPTimeline {
  to: (target: GSAPTarget, vars: GSAPVars, position?: string) => GSAPTimeline;
  from: (target: GSAPTarget, vars: GSAPVars, position?: string) => GSAPTimeline;
}

export default function SpaceBackground() {
  useEffect(() => {
    if (!IS_BROWSER) return;
    
    const gsap = (globalThis as unknown as { gsap: GSAP }).gsap;
    
    // Función para crear el fondo estrellado
    function createStarryBackground() {
      const spaceContainer = document.getElementById("space-background");
      if (!spaceContainer) return;
      
      // Limpiar cualquier estrella existente
      const existingStars = spaceContainer.querySelectorAll(".star");
      existingStars.forEach(star => star.remove());
      
      // Crear estrellas
      for (let i = 0; i < 200; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.position = "absolute";
        star.style.width = i % 10 === 0 ? "3px" : i % 5 === 0 ? "2px" : "1px";
        star.style.height = star.style.width;
        star.style.backgroundColor = i % 20 === 0 ? "#ff8a8a" : i % 15 === 0 ? "#8a8aff" : "#ffffff";
        star.style.borderRadius = "50%";
        star.style.opacity = "0.7";
        star.style.zIndex = "0";
        
        spaceContainer.appendChild(star);
        
        // Posicionar aleatoriamente
        gsap.set(star, {
          x: Math.random() * globalThis.innerWidth,
          y: Math.random() * globalThis.innerHeight
        });
        
        // Animar parpadeo
        gsap.to(star, {
          opacity: Math.random() * 0.8 + 0.2,
          duration: 1 + Math.random() * 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 2
        });
      }
    }
    
    // Eliminamos la función de estrellas fugaces ya que no se ve bien
    
    // Crear el fondo espacial
    createStarryBackground();
    
    // Ya no creamos estrellas fugaces
    
    // Manejar el redimensionamiento de la ventana
    const handleResize = () => {
      createStarryBackground();
    };
    
    globalThis.addEventListener("resize", handleResize);
    
    return () => {
      globalThis.removeEventListener("resize", handleResize);
      // Ya no hay estrellas fugaces que limpiar
    };
  }, []);
  
  // Renderizar el contenedor del fondo espacial con un color de fondo inicial
  return (
    <div id="space-background" class="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden" style="z-index: -1; background: linear-gradient(135deg, #0a0a14, #14050f, #050a14);"></div>
  );
}
