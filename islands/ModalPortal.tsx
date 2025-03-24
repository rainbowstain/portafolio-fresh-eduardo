import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect, useRef } from "preact/hooks";
import { render } from "preact";

interface ModalPortalProps {
  isOpen: boolean;
  onClose: () => void;
  children: preact.ComponentChildren;
}

export default function ModalPortal({ isOpen, onClose, children }: ModalPortalProps) {
  const portalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!IS_BROWSER) return;

    // Crear el elemento del portal si no existe
    if (!portalRef.current) {
      const div = document.createElement("div");
      div.id = "modal-portal";
      div.style.position = "fixed";
      div.style.top = "0";
      div.style.left = "0";
      div.style.width = "100vw";
      div.style.height = "100vh";
      div.style.zIndex = "999999";
      div.style.display = "none";
      document.body.appendChild(div);
      portalRef.current = div;
    }

    // Mostrar u ocultar el portal según el estado
    if (portalRef.current) {
      portalRef.current.style.display = isOpen ? "block" : "none";
    }

    // Manejar la tecla Escape
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      globalThis.addEventListener("keydown", handleEsc);
      // Bloquear el scroll
      document.body.style.overflow = "hidden";
    }

    return () => {
      globalThis.removeEventListener("keydown", handleEsc);
      // Restaurar el scroll
      if (isOpen) {
        document.body.style.overflow = "";
      }
    };
  }, [isOpen, onClose]);

  // Renderizar el contenido en el portal
  useEffect(() => {
    if (!IS_BROWSER || !portalRef.current) return;

    if (isOpen) {
      const modalContent = (
        <div 
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.95)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999999
          }}
          onClick={onClose}
        >
          <div onClick={(e) => e.stopPropagation()}>
            {children}
          </div>
        </div>
      );

      render(modalContent, portalRef.current);
    }
  }, [isOpen, children, onClose]);

  // No renderizar nada en el componente actual
  return null;
}
