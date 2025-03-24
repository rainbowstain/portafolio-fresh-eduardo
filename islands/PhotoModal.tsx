import { useState, useEffect } from "preact/hooks";

interface PhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoSrc: string;
  altText: string;
}

export default function PhotoModal({ isOpen, onClose, photoSrc, altText }: PhotoModalProps) {
  // Manejar cierre con tecla Escape
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    
    if (isOpen) {
      window.addEventListener("keydown", handleEsc);
    }
    
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      class="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999 }}
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
}
