import { useState, useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

// Creamos un portal para renderizar el modal fuera del árbol DOM normal
function createPortalContainer() {
  if (!IS_BROWSER) return null;
  
  // Buscar si ya existe un contenedor
  let container = document.getElementById("global-modal-container");
  
  // Si no existe, crearlo
  if (!container) {
    container = document.createElement("div");
    container.id = "global-modal-container";
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100vw";
    container.style.height = "100vh";
    container.style.zIndex = "999999"; // Valor extremadamente alto
    container.style.pointerEvents = "none"; // Por defecto no captura eventos
    document.body.appendChild(container);
  }
  
  return container;
}

export function useGlobalModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  
  return { isOpen, openModal, closeModal };
}

interface GlobalPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoSrc: string;
  altText: string;
}

export default function GlobalPhotoModal({ isOpen, onClose, photoSrc, altText }: GlobalPhotoModalProps) {
  useEffect(() => {
    if (!IS_BROWSER) return;
    
    // Crear el contenedor del portal si no existe
    createPortalContainer();
    
    // Manejar cierre con tecla Escape
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
      // Bloquear el scroll del body cuando el modal está abierto
      document.body.style.overflow = "hidden";
      
      // Asegurarse de que el contenedor capture eventos cuando el modal está abierto
      const container = document.getElementById("global-modal-container");
      if (container) {
        container.style.pointerEvents = "auto";
      }
    }
    
    return () => {
      window.removeEventListener("keydown", handleEsc);
      // Restaurar el scroll cuando se desmonta
      document.body.style.overflow = "";
      
      // Restaurar el comportamiento de eventos cuando el modal se cierra
      const container = document.getElementById("global-modal-container");
      if (container) {
        container.style.pointerEvents = "none";
      }
    };
  }, [isOpen, onClose]);

  // No renderizar nada en el servidor
  if (!IS_BROWSER || !isOpen) return null;

  // Renderizar el modal en el portal
  const container = document.getElementById("global-modal-container");
  if (!container) return null;

  // Crear el contenido del modal
  const modalContent = (
    <div 
      class="fixed inset-0 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999
      }}
      onClick={onClose}
    >
      <div 
        class="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg border-2 border-nothing-red shadow-xl shadow-nothing-red/40"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          class="absolute top-3 right-3 bg-nothing-black/80 text-nothing-red p-2 rounded-full hover:bg-nothing-red hover:text-nothing-white transition-colors duration-300 z-10"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img 
          src={photoSrc} 
          alt={altText} 
          class="w-full h-full object-contain"
        />
      </div>
    </div>
  );

  // Usar el DOM para renderizar en el portal
  if (typeof container.appendChild === "function") {
    // Crear un div para el contenido del modal
    const modalDiv = document.createElement("div");
    modalDiv.className = "global-modal";
    container.appendChild(modalDiv);
    
    // Renderizar el contenido en el div
    modalDiv.innerHTML = "";
    modalDiv.appendChild(document.createTextNode(JSON.stringify(modalContent)));
    
    // Limpiar al desmontar
    return () => {
      container.removeChild(modalDiv);
    };
  }

  return null;
}
