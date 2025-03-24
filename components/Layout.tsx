import { ComponentChildren } from "preact";
import { Head } from "$fresh/runtime.ts";

interface LayoutProps {
  children: ComponentChildren;
  title?: string;
}

export default function Layout({ children, title = "Eduardo Rojo" }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Eduardo Rojo - Ingeniero en Informática & Desarrollador" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" />
        <link rel="stylesheet" href="/styles/glass-effect.css" />
        {/* GSAP para animaciones avanzadas */}
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/TextPlugin.min.js"></script>
        
        {/* Estilo inicial para evitar el flash de contenido antes de las animaciones */}
        <style>{`
          /* Ocultar contenido inicialmente para evitar flash */
          body > div > main > * {
            opacity: 0;
            visibility: hidden;
          }
        `}</style>
      </Head>
      <div class="min-h-screen text-nothing-white font-sans antialiased selection:bg-nothing-red selection:text-nothing-white overflow-x-hidden">
        <div class="min-h-screen max-w-7xl mx-auto relative z-10">
          {children}
        </div>
      </div>
    </>
  );
}
