// Panel de administración para analíticas de SobremIA - Versión simplificada
// Esta versión ligera está diseñada para funcionar 100% en Deno Deploy

import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { ChatAnalyzer } from "../../src/analytics/analyzer.ts";
import type { ChatInteraction } from "../../src/analytics/logger.ts";

// Contraseña para acceder al panel admin
const ADMIN_ACCESS_KEY = "sobremia2024";

// Datos mínimos para la página
interface BasicStats {
  timestamp: string;
  message: string;
}

interface AnalyticsData {
  totalInteractions: number;
  commonQuestions: {question: string, count: number}[];
  commonIntents: {intent: string, count: number}[];
  keywordFrequency: {keyword: string, count: number}[];
  entityTrends: Record<string, {entity: string, count: number}[]>;
  timeDistribution: Record<string, number>;
  responseTimeAvg: number;
  messageLengthStats: {
    avgUserMessageLength: number,
    avgAiResponseLength: number,
    shortestUserMessage: string,
    longestUserMessage: string
  };
  activeSessions: {
    sessionId: string, 
    userName?: string,
    count: number, 
    duration: number, 
    keywords: string[]
  }[];
  questionLog: {
    messages: {
      userMessage: string, 
      aiResponse: string, 
      timestamp: string,
      userName?: string
    }[];
    totalPages: number;
    currentPage: number;
  };
}

export const handler: Handlers = {
  async GET(req, ctx) {
    // Verificar sesión
    const session = req.headers.get("cookie")?.split("admin_session=")[1]?.split(";")[0];
    
    if (!session) {
      return new Response("", {
        status: 302,
        headers: { Location: "/admin/login" }
      });
    }
    
    try {
      // Asegurar que el directorio data existe
      try {
        await Deno.mkdir("./data", { recursive: true });
      } catch (err) {
        console.error("Error al crear directorio data:", err);
      }
      
      // Cargar datos reales
      let interactions: ChatInteraction[] = [];
      
      try {
        const dataDir = await Deno.stat("./data").catch(() => null);
        
        if (dataDir && dataDir.isDirectory) {
          const now = new Date();
          for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(now.getDate() - i);
            const filename = `analytics_${date.toISOString().slice(0,10)}.json`;
            
            try {
              const text = await Deno.readTextFile(`./data/${filename}`);
              const data = JSON.parse(text) as ChatInteraction[];
              interactions.push(...data);
            } catch {
              continue;
            }
          }
        }
      } catch (err) {
        console.error("Error al leer datos reales:", err);
      }
      
      // Si no hay datos reales, mostrar panel vacío en lugar de error
      if (interactions.length === 0) {
        console.log("No hay datos disponibles");
        
        // Crear datos vacíos para el panel
        const emptyData: AnalyticsData = {
          totalInteractions: 0,
          commonQuestions: [],
          commonIntents: [],
          keywordFrequency: [],
          entityTrends: {},
          timeDistribution: {
            "0": 0, "3": 0, "6": 0, "9": 0, "12": 0, "15": 0, "18": 0, "21": 0
          },
          responseTimeAvg: 0,
          messageLengthStats: {
            avgUserMessageLength: 0,
            avgAiResponseLength: 0,
            shortestUserMessage: "",
            longestUserMessage: ""
          },
          activeSessions: [],
          questionLog: {
            messages: [],
            totalPages: 1,
            currentPage: 1
          }
        };
        
        return ctx.render(emptyData);
      }
      
      console.log(`Cargados ${interactions.length} datos reales`);
      
      // Obtener página actual para el log de preguntas
      const url = new URL(req.url);
      const currentPage = parseInt(url.searchParams.get("page") || "1");
      const itemsPerPage = 10;
      
      // Ordenar interacciones por fecha (más recientes primero)
      const sortedInteractions = [...interactions].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      // Calcular paginación
      const totalPages = Math.ceil(sortedInteractions.length / itemsPerPage);
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      
      // Obtener mensajes para la página actual
      const pageMessages = sortedInteractions
        .slice(startIndex, endIndex)
        .map(i => ({
          userMessage: i.userMessage,
          aiResponse: i.aiResponse,
          timestamp: new Date(i.timestamp).toLocaleString(),
          userName: i.userName
        }));
      
      // Generar análisis
      const analyticsData: AnalyticsData = {
        totalInteractions: interactions.length,
        commonQuestions: ChatAnalyzer.getMostCommonQuestions(interactions),
        commonIntents: ChatAnalyzer.getMostCommonIntents(interactions),
        keywordFrequency: ChatAnalyzer.getKeywordFrequency(interactions),
        entityTrends: ChatAnalyzer.getEntityTrends(interactions),
        timeDistribution: ChatAnalyzer.getTimeDistribution(interactions),
        responseTimeAvg: ChatAnalyzer.getAverageResponseTime(interactions),
        messageLengthStats: ChatAnalyzer.getMessageLengthStats(interactions),
        activeSessions: ChatAnalyzer.getMostActiveSessionsStats(interactions),
        questionLog: {
          messages: pageMessages,
          totalPages,
          currentPage
        }
      };
      
      return ctx.render(analyticsData);
    } catch (err) {
      console.error("Error generating analytics:", err);
      return new Response("Error interno del servidor", { status: 500 });
    }
  },
  
  async POST(req, ctx) {
    // Manejar cierre de sesión
    const formData = await req.formData();
    const action = formData.get("action");
    
    if (action === "logout") {
      const response = new Response("", {
        status: 302,
        headers: { Location: "/admin/login" }
      });
      
      // Eliminar la cookie de sesión
      response.headers.set(
        "Set-Cookie",
        "admin_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0"
      );
      
      return response;
    }
    
    return new Response("Acción no válida", { status: 400 });
  }
};

// Función para crear datos de demostración
function createDemoData(): ChatInteraction[] {
  const now = new Date();
  const demoData: ChatInteraction[] = [];
  
  const intents = [
    "saludo", "idiomas", "lenguajes_programacion", "experiencia_laboral", 
    "habilidades_tecnologias", "proyectos", "intereses_personales"
  ];
  
  const questions = [
    "Hola, ¿cómo estás?",
    "¿Cuál es tu nivel de inglés?",
    "¿En qué lenguaje de programación tienes más experiencia?",
    "Háblame sobre tu experiencia laboral",
    "¿Qué tecnologías conoces?",
    "Cuéntame sobre tus proyectos",
    "¿Qué hobbies tienes?"
  ];
  
  const responses = [
    "¡Hola! Soy SobremIA, creada por Eduardo. ¿En qué puedo ayudarte hoy? 🚀",
    "Eduardo tiene un nivel intermedio-avanzado de inglés. Cursó 5 asignaturas de idioma durante su carrera universitaria.",
    "Eduardo tiene mayor experiencia con JavaScript/TypeScript, que ha utilizado en numerosos proyectos de desarrollo web.",
    "Eduardo ha trabajado en múltiples empresas y proyectos desde 2016, comenzando en el liceo Antonio Varas de la Barra.",
    "Eduardo maneja varias tecnologías, incluyendo JavaScript, TypeScript, React, Node.js, Python, SQL, PHP, C++, y más.",
    "Entre los proyectos destacados de Eduardo están aplicaciones de e-commerce, aplicaciones móviles, y sitios web de portafolio.",
    "A Eduardo le gusta la música electrónica, el rock, y juega videojuegos como Call of Duty y League of Legends."
  ];
  
  // Crear 30 sesiones con 5-10 interacciones cada una
  for (let s = 0; s < 30; s++) {
    const sessionId = `demo_session_${s}`;
    const interactionCount = 5 + Math.floor(Math.random() * 6);
    
    for (let i = 0; i < interactionCount; i++) {
      const intentIndex = Math.floor(Math.random() * intents.length);
      const timestamp = new Date(now);
      timestamp.setHours(now.getHours() - Math.floor(Math.random() * 24));
      timestamp.setMinutes(now.getMinutes() - Math.floor(Math.random() * 60));
      
      demoData.push({
        sessionId,
        userMessage: questions[intentIndex],
        aiResponse: responses[intentIndex],
        detectedIntent: intents[intentIndex],
        detectedEntities: {},
        timestamp,
        processingTime: 100 + Math.floor(Math.random() * 400),
        userSentiment: -0.5 + Math.random()
      });
    }
  }
  
  return demoData;
}

export default function AnalyticsPage({ data }: PageProps<AnalyticsData>) {
  return (
    <>
      <Head>
        <title>SobremIA - Panel de Analíticas</title>
        <meta name="description" content="Panel de administración para SobremIA" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
      </Head>
      
      <div className="min-h-screen bg-gray-900 text-white">
        <header className="bg-gray-800 p-4 border-b border-red-600">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">SobremIA - Panel de Analíticas</h1>
              <p className="text-gray-400">Análisis de interacciones y comportamiento de usuarios</p>
            </div>
            <div className="flex gap-4">
              <a 
                href="/admin/reset-data" 
                className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded-lg transition-colors duration-200"
                onClick={(e) => {
                  if (!confirm("¿Estás seguro de que quieres reiniciar todos los datos? Esta acción no se puede deshacer.")) {
                    e.preventDefault();
                  }
                }}
              >
                Reiniciar Datos
              </a>
              <form method="POST">
                <input type="hidden" name="action" value="logout" />
                <button 
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Cerrar Sesión
                </button>
              </form>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-8 px-4">
          {/* Resumen general */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <StatCard 
              title="Total Interacciones" 
              value={data.totalInteractions.toString()} 
              icon="📊"
            />
            <StatCard 
              title="Tiempo de Respuesta Promedio" 
              value={`${Math.round(data.responseTimeAvg)}ms`} 
              icon="⏱️"
            />
            <StatCard 
              title="Longitud Promedio de Respuestas" 
              value={`${Math.round(data.messageLengthStats.avgAiResponseLength)} caracteres`} 
              icon="📏"
            />
          </div>
          
          {/* Preguntas y intenciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">🔍</span> Preguntas más Frecuentes
              </h2>
              <div className="overflow-y-auto max-h-80">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-2">Pregunta</th>
                      <th className="text-right py-2">Frecuencia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.commonQuestions.map((item, index) => (
                      <tr key={index} className="border-t border-gray-700 hover:bg-gray-700/30">
                        <td className="py-2">{item.question}</td>
                        <td className="text-right py-2">{item.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">🎯</span> Intenciones Detectadas
              </h2>
              <div className="overflow-y-auto max-h-80">
                <div className="space-y-3">
                  {data.commonIntents.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden">
                        <div 
                          className="bg-red-600 h-6 rounded-full" 
                          style={{ width: `${(item.count / data.totalInteractions) * 100}%` }}
                        ></div>
                      </div>
                      <div className="ml-3 min-w-[120px] text-right">
                        <div className="font-medium">{item.intent}</div>
                        <div className="text-xs text-gray-400">{item.count} veces</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Palabras clave */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">🔤</span> Palabras Clave
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.keywordFrequency.map((item, index) => (
                <span key={index} 
                  className="bg-gray-700 rounded-full px-3 py-1"
                  style={{
                    fontSize: `${Math.max(0.8, Math.min(1.8, 0.8 + item.count / 10))}rem`,
                    opacity: Math.max(0.6, Math.min(1, 0.6 + item.count / 15))
                  }}>
                  {item.keyword}
                </span>
              ))}
            </div>
          </div>
          
          {/* Distribución horaria */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">🕒</span> Distribución por Hora
            </h2>
            <div className="h-60 flex items-end">
              {Object.entries(data.timeDistribution).map(([hour, count]) => {
                const percentage = data.totalInteractions ? (count / data.totalInteractions) * 100 : 0;
                return (
                  <div key={hour} className="flex-1 mx-px flex flex-col items-center">
                    <div className="text-xs mb-1">{count}</div>
                    <div 
                      className="w-full bg-red-600 transition-all duration-500 ease-in-out hover:bg-red-500" 
                      style={{height: `${Math.max(5, percentage * 3)}%`}}
                    ></div>
                    <div className="text-xs mt-2">{hour}h</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Sesiones activas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">👥</span> Sesiones más Activas
              </h2>
              <div className="space-y-6">
                {data.activeSessions.map((session, index) => (
                  <div key={index} className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between mb-1">
                      <div className="font-medium">
                        {session.userName ? (
                          <span className="text-red-400">{session.userName}</span>
                        ) : (
                          <span>{session.sessionId.substring(0, 15)}...</span>
                        )}
                      </div>
                      <div className="text-gray-400">{session.count} interacciones</div>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">Duración: {Math.round(session.duration)} minutos</div>
                    <div className="flex flex-wrap gap-1">
                      {session.keywords.map((kw, i) => (
                        <span key={i} className="bg-gray-700 rounded-full px-2 py-0.5 text-xs">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">📝</span> Estadísticas de Mensajes
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Longitud Promedio</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="text-3xl font-bold">{Math.round(data.messageLengthStats.avgUserMessageLength)}</div>
                      <div className="text-gray-400">Caracteres por pregunta</div>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <div className="text-3xl font-bold">{Math.round(data.messageLengthStats.avgAiResponseLength)}</div>
                      <div className="text-gray-400">Caracteres por respuesta</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Preguntas Extremas</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Más corta:</div>
                      <div className="italic">"{data.messageLengthStats.shortestUserMessage}"</div>
                    </div>
                    <div className="bg-gray-700 p-3 rounded-lg">
                      <div className="text-sm text-gray-400 mb-1">Más larga:</div>
                      <div className="italic">"{data.messageLengthStats.longestUserMessage.length > 100 
                        ? data.messageLengthStats.longestUserMessage.substring(0, 100) + '...' 
                        : data.messageLengthStats.longestUserMessage}"</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Log de Preguntas */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">📝</span> Log de Preguntas
            </h2>
            
            <div className="space-y-4">
              {data.questionLog.messages.map((msg, index) => (
                <div key={index} className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>
                      {msg.userName ? (
                        <span className="text-red-400 font-medium">{msg.userName}</span>
                      ) : (
                        <span className="italic">Usuario anónimo</span>
                      )} - {msg.timestamp}
                    </span>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg mb-2">
                    <div className="font-medium text-red-400 mb-1">Pregunta:</div>
                    <div className="text-white">{msg.userMessage}</div>
                  </div>
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <div className="font-medium text-green-400 mb-1">Respuesta:</div>
                    <div className="text-white">{msg.aiResponse}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Paginación */}
            {data.questionLog.totalPages > 1 && (
              <div className="mt-6 flex justify-center gap-2">
                {Array.from({ length: data.questionLog.totalPages }, (_, i) => i + 1).map(page => (
                  <a
                    key={page}
                    href={`/admin/analytics?page=${page}`}
                    className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                      page === data.questionLog.currentPage
                        ? "bg-red-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {page}
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {/* Exportación de datos */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-10">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">💾</span> Exportar Datos
            </h2>
            <div className="flex gap-4">
              <a 
                href="/admin/export?format=json" 
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Exportar JSON
              </a>
              <a 
                href="/admin/export?format=csv" 
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Exportar CSV
              </a>
            </div>
          </div>
        </main>
        
        <footer className="bg-gray-800 p-4 border-t border-red-600 text-center text-gray-400 text-sm">
          SobremIA Analytics Dashboard | Desarrollado por Eduardo Rojo
        </footer>
      </div>
    </>
  );
}

// Componente reutilizable para estadísticas
function StatCard({ title, value, icon }: { title: string, value: string, icon: string }) {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center gap-4">
        <div className="text-4xl">{icon}</div>
        <div>
          <div className="text-gray-400 mb-1">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>
    </div>
  );
} 