import { useState } from "preact/hooks";
import ModalPortal from "./ModalPortal.tsx";

export default function PhotoViewer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  return (
    <>
      {/* Foto de perfil clickeable */}
      <div 
        className="relative w-48 h-48 rounded-full overflow-hidden border-2 border-nothing-red shadow-lg shadow-nothing-red/20 mb-3 group cursor-pointer" 
        onClick={openModal}
      >
        <img 
          src="/eduardo.jpeg" 
          alt="Eduardo Rojo" 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-nothing-red/0 via-nothing-red/20 to-nothing-red/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
            <path d="M5 8a1 1 0 011-1h1V6a1 1 0 012 0v1h1a1 1 0 110 2H9v1a1 1 0 11-2 0V9H6a1 1 0 01-1-1z" />
            <path fillRule="evenodd" d="M2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8zm6-4a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Modal Portal para mostrar la foto */}
      <ModalPortal isOpen={isModalOpen} onClose={closeModal}>
        <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg border-2 border-nothing-red shadow-xl shadow-nothing-red/40">
          <button 
            type="button"
            className="absolute top-3 right-3 bg-nothing-black/80 text-nothing-red p-2 rounded-full hover:bg-nothing-red hover:text-nothing-white transition-colors duration-300 z-10"
            onClick={closeModal}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            src="/eduardo.jpeg" 
            alt="Eduardo Rojo" 
            className="w-full h-full object-contain"
          />
        </div>
      </ModalPortal>
    </>
  );
}
