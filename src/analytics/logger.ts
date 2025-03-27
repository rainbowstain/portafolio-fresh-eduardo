// Sistema de recolección de datos - Logger para SobremIA
// Registra todas las interacciones del usuario con el chatbot
// para análisis posterior y mejora continua del sistema

export interface ChatInteraction {
  sessionId: string;
  userName?: string;
  userMessage: string;
  aiResponse: string;
  detectedIntent: string;
  detectedEntities: Record<string, string[]>;
  timestamp: Date;
  processingTime: number; // milisegundos
  userSentiment: number;
  userAgent?: string;
  geoData?: {
    country?: string;
    region?: string;
    city?: string;
  };
}

class AnalyticsLogger {
  private interactions: ChatInteraction[] = [];
  private static instance: AnalyticsLogger;
  
  private constructor() {
    // Programar guardado periódico
    if (typeof window === 'undefined') { // Solo en el servidor
      setInterval(() => {
        if (this.interactions.length > 0) {
          this.persistToStorage();
        }
      }, 5 * 60 * 1000); // Cada 5 minutos
    }
  }
  
  static getInstance(): AnalyticsLogger {
    if (!AnalyticsLogger.instance) {
      AnalyticsLogger.instance = new AnalyticsLogger();
    }
    return AnalyticsLogger.instance;
  }
  
  logInteraction(interaction: ChatInteraction): void {
    // Asegurar que siempre hay un timestamp
    if (!interaction.timestamp) {
      interaction.timestamp = new Date();
    }
    
    this.interactions.push(interaction);
    
    // Guardar datos inmediatamente en lugar de esperar
    this.forceFlush().catch(err => {
      console.error("[Analytics] Error al guardar inmediatamente:", err);
    });
    
    // Log para depuración
    console.log(`[Analytics] Logged: "${interaction.userMessage}" → ${interaction.detectedIntent}`);
  }
  
  async persistToStorage(): Promise<void> {
    if (this.interactions.length === 0) return;
    
    try {
      // Asegurar que el directorio data existe
      try {
        await Deno.mkdir("./data", { recursive: true });
      } catch (err) {
        console.error("[Analytics] Error al crear directorio data:", err);
      }
      
      const today = new Date().toISOString().slice(0, 10);
      const filename = `analytics_${today}.json`;
      
      // Intentar leer datos existentes primero
      let existingData: ChatInteraction[] = [];
      try {
        const existingContent = await Deno.readTextFile(`./data/${filename}`);
        existingData = JSON.parse(existingContent);
      } catch (err) {
        // Si el archivo no existe o hay error, empezamos con un array vacío
        console.log(`[Analytics] Creating new log file for ${today}`);
      }
      
      // Combinar datos existentes con nuevos
      const combinedData = [...existingData, ...this.interactions];
      
      // Guardar archivo
      await Deno.writeTextFile(
        `./data/${filename}`, 
        JSON.stringify(combinedData, (key, value) => {
          // Convertir Dates a strings ISO para JSON
          if (value instanceof Date) {
            return value.toISOString();
          }
          return value;
        }, 2)
      );
      
      console.log(`[Analytics] Saved ${this.interactions.length} interactions to ${filename}`);
      
      // Limpiar el buffer después de guardar
      this.interactions = [];
    } catch (error) {
      console.error("[Analytics] Error persisting data:", error);
    }
  }
  
  // Para uso en casos de cierre del servidor
  async forceFlush(): Promise<void> {
    if (this.interactions.length > 0) {
      await this.persistToStorage();
    }
  }
}

export const analyticsLogger = AnalyticsLogger.getInstance(); 