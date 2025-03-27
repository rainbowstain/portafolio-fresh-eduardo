// API para exportación de datos de SobremIA
import { Handlers } from "$fresh/server.ts";
import type { ChatInteraction } from "../../src/analytics/logger.ts";

export const handler: Handlers = {
  async GET(req) {
    // Verificar sesión
    const session = req.headers.get("cookie")?.split("admin_session=")[1]?.split(";")[0];
    
    if (!session) {
      return new Response("", {
        status: 302,
        headers: { Location: "/admin/login" }
      });
    }
    
    const url = new URL(req.url);
    const format = url.searchParams.get("format") || "json";
    
    try {
      // Cargar datos reales
      const interactions = await loadRealData();
      
      // Si no hay datos, devolver un conjunto vacío
      if (interactions.length === 0) {
        console.log("No hay datos disponibles para exportar");
        
        const emptyResponse = format === "csv" 
          ? "sessionId,timestamp,userMessage,aiResponse\n" 
          : "[]";
          
        const fileName = format === "csv" ? "sobremia_data.csv" : "sobremia_data.json";
        
        return new Response(emptyResponse, {
          headers: {
            "Content-Type": format === "csv" ? "text/csv" : "application/json",
            "Content-Disposition": `attachment; filename="${fileName}"`
          }
        });
      }
      
      console.log(`Exportando ${interactions.length} interacciones en formato ${format}`);
      
      // Generar respuesta según formato
      if (format === "csv") {
        // CSV export
        const headers = ["sessionId", "timestamp", "userMessage", "aiResponse"];
        
        let csv = headers.join(",") + "\n";
        
        for (const interaction of interactions) {
          const row = [
            interaction.sessionId,
            new Date(interaction.timestamp).toISOString(),
            `"${interaction.userMessage.replace(/"/g, '""')}"`,
            `"${interaction.aiResponse.replace(/"/g, '""')}"`
          ].join(",");
          
          csv += row + "\n";
        }
        
        return new Response(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="sobremia_data.csv"`
          }
        });
      } else {
        // JSON export
        return new Response(JSON.stringify(interactions, null, 2), {
          headers: {
            "Content-Type": "application/json",
            "Content-Disposition": `attachment; filename="sobremia_data.json"`
          }
        });
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      return new Response(`Error: ${error instanceof Error ? error.message : String(error)}`, { 
        status: 500,
        headers: { "Content-Type": "text/plain" }
      });
    }
  }
};

// Función para cargar datos reales
async function loadRealData(): Promise<ChatInteraction[]> {
  let interactions: ChatInteraction[] = [];
  
  try {
    // Asegurar que el directorio data existe
    await Deno.mkdir("./data", { recursive: true }).catch(() => {});
    
    const dataDir = await Deno.stat("./data").catch(() => null);
    
    if (dataDir && dataDir.isDirectory) {
      const now = new Date();
      
      // Cargar datos de los últimos 30 días
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(now.getDate() - i);
        const filename = `analytics_${date.toISOString().slice(0,10)}.json`;
        
        try {
          const text = await Deno.readTextFile(`./data/${filename}`);
          const data = JSON.parse(text) as ChatInteraction[];
          interactions.push(...data);
        } catch {
          // Si el archivo no existe, continuamos
          continue;
        }
      }
    }
  } catch (err) {
    console.error("Error al cargar datos reales:", err);
  }
  
  return interactions;
} 