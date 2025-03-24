import Layout from "../components/Layout.tsx";
import AIChat from "../islands/AIChat.tsx";
import Animations from "../islands/Animations.tsx";
import SpaceBackground from "../islands/SpaceBackground.tsx";
import PhotoViewer from "../islands/PhotoViewer.tsx";

export default function Home() {
  return (
    <Layout>
      {/* GSAP Animations Component */}
      <Animations />
      
      {/* Fondo espacial dinámico */}
      <SpaceBackground />
      
      {/* Los estilos glass-effect se han movido a un archivo CSS */}
      
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 min-h-screen max-w-full">
        {/* Header Section - Takes full width */}
        <header class="lg:col-span-12 p-6 rounded-lg glass-effect flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 class="text-4xl font-bold title-animation">
              <span class="text-nothing-white">Eduardo</span> <span class="text-nothing-red">Rojo</span>
            </h1>
            <p class="text-nothing-lightgray">Ingeniero en Informática | Desarrollador de Software en UltraCropCare</p>
          </div>
          <div class="flex flex-col items-end gap-4">
            <nav class="flex gap-4">
              {['SobremIA', 'Habilidades', 'Proyectos', 'Cómo funciona'].map((item, index) => (
                <a 
                  href={`#${item === 'SobremIA' ? 'sobremia' : item === 'Cómo funciona' ? 'chat' : item.toLowerCase()}`} 
                  class="text-nothing-lightgray hover:text-nothing-white border-b-2 border-transparent hover:border-nothing-red transition-colors duration-300"
                  key={index}
                >
                  {item}
                </a>
              ))}
            </nav>
            {/* Contact Icons */}
            <div class="flex gap-3">
              <a href="mailto:rojoserranoe@gmail.com" class="text-nothing-lightgray hover:text-nothing-red transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <a href="https://github.com/rainbowstain" target="_blank" class="text-nothing-lightgray hover:text-nothing-red transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/eduardo-rojo-serrano/" target="_blank" class="text-nothing-lightgray hover:text-nothing-red transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>

            </div>
          </div>
        </header>

        {/* SobreMIA Section - 12 columns on large screens */}
        <section id="sobremia" class="lg:col-span-12 p-6 rounded-lg glass-effect flex flex-col lg:flex-row h-full my-auto border-2 border-nothing-red shadow-lg shadow-nothing-red/20 relative overflow-hidden w-full">
          {/* Fondo decorativo */}
 
          
          <div class="lg:w-[25%] flex flex-col items-center justify-start p-3 border-r border-nothing-gray/30 relative z-10">
            <div class="text-center mb-2 w-full">
              <h3 class="text-nothing-white text-lg font-medium">Portafolios con</h3>
              <h2 class="text-3xl font-bold text-nothing-white relative overflow-hidden text-center">
                <span class="relative z-10">Sobrem<span class="text-nothing-red">IA</span></span>
                <span class="absolute bottom-0 left-0 w-full h-1 bg-nothing-red transform scale-x-0 origin-left transition-transform duration-500 hover:scale-x-100"></span>
              </h2>
            </div>
            
            <PhotoViewer />
            
            <div class="p-4 border-l-4 border-nothing-red bg-nothing-black bg-opacity-40 w-full backdrop-blur-sm mb-4 relative overflow-hidden">
              <div class="absolute -top-10 -right-10 w-20 h-20 bg-nothing-red opacity-10 rounded-full blur-xl"></div>
              <p class="text-nothing-lightgray text-sm leading-relaxed">
                Revolucionando el concepto de portafolio tradicional, SobremIA integra inteligencia artificial para ofrecerte una experiencia verdaderamente interactiva y personalizada.
              </p>
              <div class="w-full h-[1px] bg-gradient-to-r from-nothing-red/0 via-nothing-red/50 to-nothing-red/0 my-3"></div>
            </div>
          </div>
          
          <div class="lg:w-[75%] mt-4 lg:mt-0 lg:pl-4 flex flex-col relative z-10">
            <div class="flex-grow relative overflow-hidden rounded-lg h-full">
              <div class="relative z-10 h-full">
                <AIChat />
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section - 6 columns on large screens */}
        <section id="habilidades" class="lg:col-span-6 p-6 rounded-lg glass-effect flex flex-col h-full">
          <h2 class="text-2xl font-bold mb-4 text-nothing-white relative overflow-hidden">
            <span class="relative z-10">Habilidades</span>
            <span class="absolute bottom-0 left-0 w-full h-1 bg-nothing-red transform scale-x-0 origin-left transition-transform duration-500 hover:scale-x-100"></span>
          </h2>
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4 flex-grow overflow-y-auto pr-1 content-start">
            {/* Lenguajes de Programación */}
            <div class="contents">
              <h3 class="col-span-2 md:col-span-3 text-nothing-white text-lg font-semibold mt-2 mb-1 border-b border-nothing-red pb-1">Lenguajes de Programación</h3>
            </div>
            {[
              { name: "JavaScript" },
              { name: "TypeScript" },
              { name: "Python" },
              { name: "PHP" },
              { name: "C++" },
              { name: "C#" }
            ].map((skill, index) => (
              <div 
                class="bg-nothing-gray p-3 rounded-md hover:bg-nothing-red hover:text-nothing-white transition-colors duration-300 flex items-center justify-between skill-item w-full"
                key={index}
              >
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 bg-nothing-red rounded-full mr-2"></span>
                  <span>{skill.name}</span>
                </div>
              </div>
            ))}
            
            {/* Frameworks & Librerías */}
            <div class="contents">
              <h3 class="col-span-2 md:col-span-3 text-nothing-white text-lg font-semibold mt-4 mb-1 border-b border-nothing-red pb-1">Frameworks & Librerías</h3>
            </div>
            {[
              { name: "React" },
              { name: "Node.js" },
              { name: "Laravel" },
              { name: "Blazor" },
              { name: "React Native" },
              { name: "Fresh" },
              { name: "Deno" }
            ].map((skill, index) => (
              <div 
                class="bg-nothing-gray p-3 rounded-md hover:bg-nothing-red hover:text-nothing-white transition-colors duration-300 flex items-center justify-between skill-item w-full"
                key={index}
              >
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 bg-nothing-red rounded-full mr-2"></span>
                  <span>{skill.name}</span>
                </div>
              </div>
            ))}

            {/* Herramientas & Sistemas */}
            <div class="contents">
              <h3 class="col-span-2 md:col-span-3 text-nothing-white text-lg font-semibold mt-4 mb-1 border-b border-nothing-red pb-1">Herramientas & Sistemas</h3>
            </div>
            {[
              { name: "Git" },
              { name: "Linux" },
              { name: "macOS" },
              { name: "Docker" },
              { name: "VS Code" },
              { name: "GitHub" }
            ].map((skill, index) => (
              <div 
                class="bg-nothing-gray p-3 rounded-md hover:bg-nothing-red hover:text-nothing-white transition-colors duration-300 flex items-center justify-between skill-item w-full"
                key={index}
              >
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 bg-nothing-red rounded-full mr-2"></span>
                  <span>{skill.name}</span>
                </div>
              </div>
            ))}
            
            {/* Bases de Datos */}
            <div class="contents">
              <h3 class="col-span-2 md:col-span-3 text-nothing-white text-lg font-semibold mt-4 mb-1 border-b border-nothing-red pb-1">Bases de Datos</h3>
            </div>
            {[
              { name: "SQL Server" },
              { name: "MySQL" },
              { name: "MongoDB" },
              { name: "PostgreSQL" }
            ].map((skill, index) => (
              <div 
                class="bg-nothing-gray p-3 rounded-md hover:bg-nothing-red hover:text-nothing-white transition-colors duration-300 flex items-center justify-between skill-item w-full"
                key={index}
              >
                <div class="flex items-center gap-2">
                  <span class="w-3 h-3 bg-nothing-red rounded-full mr-2"></span>
                  <span>{skill.name}</span>
                </div>
              </div>
            ))}

          </div>
        </section>

        {/* Projects Section - 6 columns on large screens */}
        <section id="proyectos" class="lg:col-span-6 p-6 rounded-lg glass-effect">
          <h2 class="text-2xl font-bold mb-4 text-nothing-white relative overflow-hidden">
            <span class="relative z-10">Proyectos</span>
            <span class="absolute bottom-0 left-0 w-full h-1 bg-nothing-red transform scale-x-0 origin-left transition-transform duration-500 hover:scale-x-100"></span>
          </h2>
          {/* Grupo de proyectos de Mundo Animal Arica */}
          <div class="mb-6">
            <h3 class="text-nothing-white text-lg font-semibold border-b border-nothing-red pb-1 mb-3 inline-block">Proyecto: Mundo Animal Arica</h3>
            
            <a href="https://www.mundoanimalarica.cl" target="_blank" rel="noopener noreferrer" class="block border border-nothing-gray p-4 rounded-md hover:border-nothing-red transition-colors duration-300 project-card relative overflow-hidden">
              <div class="absolute top-0 left-0 w-1 h-0 bg-nothing-red transition-all duration-300"></div>
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-nothing-white">Página Web de Mundo Animal Arica</h3>
                <div class="text-nothing-red hover:text-nothing-white transition-colors duration-300 text-sm flex items-center">
                  <span>Visitar</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ml-1">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </div>
              </div>
              <p class="text-nothing-lightgray text-sm mb-2">Tienda de accesorios y comida de mascotas</p>
              <div class="flex gap-2 flex-wrap">
                <span class="text-xs px-2 py-1 bg-nothing-black text-nothing-red rounded-full">HTML</span>
                <span class="text-xs px-2 py-1 bg-nothing-black text-nothing-red rounded-full">CSS</span>
                <span class="text-xs px-2 py-1 bg-nothing-black text-nothing-red rounded-full">JS</span>
                <span class="text-xs px-2 py-1 bg-nothing-black text-nothing-red rounded-full">Python</span>
              </div>
            </a>
          </div>

          {/* Otros proyectos */}
          <div class="space-y-4 mb-6">
            <h3 class="text-nothing-white text-lg font-semibold border-b border-nothing-red pb-1 mb-3 inline-block">Proyectos Personales</h3>
            
            {[
              { title: "Portafolio Web", desc: "Sitio web personal con animaciones y efectos visuales", tech: "Fresh, Deno, GSAP, TypeScript" },
              { title: "Chat de IA", desc: "Asistente de chat impulsado por inteligencia artificial", tech: "TypeScript, OpenAI API" }
            ].map((project, index) => (
              <div 
                class="border border-nothing-gray p-4 rounded-md hover:border-nothing-red transition-colors duration-300 project-card relative overflow-hidden"
                key={index}
              >
                <div class="absolute top-0 left-0 w-1 h-0 bg-nothing-red transition-all duration-300"></div>
                <h3 class="font-bold text-nothing-white">{project.title}</h3>
                <p class="text-nothing-lightgray text-sm mb-2">{project.desc}</p>
                <div class="flex gap-2 flex-wrap">
                  {project.tech.split(", ").map((tech, i) => (
                    <span key={i} class="text-xs px-2 py-1 bg-nothing-black text-nothing-red rounded-full">{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Proyectos confidenciales */}
          <div class="space-y-4 mb-6">
            <h3 class="text-nothing-white text-lg font-semibold border-b border-nothing-red pb-1 mb-3 inline-block">Proyectos Confidenciales</h3>
            
            {[
              { title: "Optimización de procesos portuarios", desc: "Sistema de gestión y optimización de operaciones", tech: "C#, Blazor, .NET, SQL Server" },
              { title: "Migración de entornos legacy", desc: "Actualización y migración de sistemas heredados", tech: "Laravel, PHP, MySQL" }
            ].map((project, index) => (
              <div 
                class="border border-nothing-gray p-4 rounded-md hover:border-nothing-red transition-colors duration-300 project-card relative overflow-hidden"
                key={index}
              >
                <div class="absolute top-0 left-0 w-1 h-0 bg-nothing-red transition-all duration-300"></div>
                <h3 class="font-bold text-nothing-white">{project.title}</h3>
                <p class="text-nothing-lightgray text-sm mb-2">{project.desc}</p>
                <div class="flex gap-2 flex-wrap">
                  {project.tech.split(", ").map((tech, i) => (
                    <span key={i} class="text-xs px-2 py-1 bg-nothing-black text-nothing-red rounded-full">{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div class="mt-6 text-center">
            <a href="https://github.com/rainbowstain" class="text-nothing-red hover:underline inline-flex items-center gap-2">
              Más proyectos en mi GitHub
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </a>
          </div>
        </section>

        {/* Sección explicativa sobre SobreMIA */}
        <div id="chat" class="lg:col-span-12 p-6 rounded-lg glass-effect mb-6">
          <div class="flex flex-col gap-6">
            <h2 class="text-3xl font-bold mb-4 text-nothing-white relative overflow-hidden">
              <span class="relative z-10">Cómo funciona SobremIA</span>
              <span class="absolute bottom-0 left-0 w-full h-1 bg-nothing-red transform scale-x-0 origin-left transition-transform duration-500 hover:scale-x-100"></span>
            </h2>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="bg-nothing-black bg-opacity-50 p-5 rounded-lg border-l-4 border-nothing-red">
                <div class="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-nothing-red mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 class="text-nothing-white font-bold">Arquitectura Técnica</h3>
                </div>
                <p class="text-nothing-lightgray text-sm">SobremIA utiliza la API gratuita de Hugging Face con el modelo gpt2 para generar respuestas contextuales. El sistema está construido con Deno y Fresh, aprovechando TypeScript para un código robusto y mantenible.</p>
              </div>
              
              <div class="bg-nothing-black bg-opacity-50 p-5 rounded-lg border-l-4 border-nothing-red">
                <div class="flex items-center mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-nothing-red mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 class="text-nothing-white font-bold">Respuestas Inteligentes</h3>
                </div>
                <p class="text-nothing-lightgray text-sm">El chatbot está programado para reconocer patrones en las preguntas y seleccionar respuestas relevantes de una base de conocimiento personalizada. Incluye categorías como habilidades técnicas, experiencia profesional, proyectos y más.</p>
              </div>
              
             
              <div class="bg-nothing-black bg-opacity-50 p-5 rounded-lg border-l-4 border-nothing-red">
  <div class="flex items-center mb-3">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-nothing-red mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-4 0h4" />
    </svg>
    <h3 class="text-nothing-white font-bold">Experiencia Inmersiva</h3>
  </div>
  <p class="text-nothing-lightgray text-sm">
    Con SobremIA, cada interacción se transforma en una experiencia única. Sumérgete en un entorno dinámico donde la inteligencia artificial te guía a través de un universo de conocimiento y posibilidades.
  </p>
</div>

            </div>
            
            <div class="mt-4 p-5 bg-nothing-black bg-opacity-30 rounded-lg border-t border-nothing-gray/30">
              <p class="text-nothing-lightgray text-center">SobremIA representa una nueva forma de presentar información profesional, permitiéndote interactuar directamente con mi perfil en lugar de simplemente leer contenido estático. Prueba haciendo preguntas específicas sobre mis habilidades, experiencia o proyectos.</p>
            </div>
          </div>
        </div>

        {/* Footer - Takes full width */}
        <footer class="lg:col-span-12 p-6 border-t border-nothing-gray text-center text-nothing-lightgray glass-effect rounded-lg mt-8">
          <div class="flex flex-col md:flex-row justify-between items-center gap-4">
            <p> 2024 Eduardo Rojo. Todos los derechos reservados.</p>
            <p class="text-sm typing-text font-mono"></p>
          </div>
        </footer>
      </div>
    </Layout>
  );
}
