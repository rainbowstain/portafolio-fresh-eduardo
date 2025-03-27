// Sistema de análisis de datos para SobremIA
// Procesa las interacciones registradas para extraer estadísticas,
// tendencias y patrones que ayuden a mejorar el sistema

import type { ChatInteraction } from "./logger.ts";

export class ChatAnalyzer {
  // Análisis de preguntas frecuentes
  static getMostCommonQuestions(interactions: ChatInteraction[], limit = 10): {question: string, count: number}[] {
    const questionMap = new Map<string, number>();
    
    // Normalizar y contar preguntas similares
    for (const interaction of interactions) {
      const normalizedQuestion = this.normalizeQuestion(interaction.userMessage);
      questionMap.set(normalizedQuestion, (questionMap.get(normalizedQuestion) || 0) + 1);
    }
    
    // Convertir y ordenar
    return Array.from(questionMap.entries())
      .map(([question, count]) => ({question, count}))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
  
  // Análisis de intenciones más comunes
  static getMostCommonIntents(interactions: ChatInteraction[], limit = 10): {intent: string, count: number}[] {
    const intentMap = new Map<string, number>();
    
    for (const interaction of interactions) {
      const intent = interaction.detectedIntent || "unknown";
      intentMap.set(intent, (intentMap.get(intent) || 0) + 1);
    }
    
    return Array.from(intentMap.entries())
      .map(([intent, count]) => ({intent, count}))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
  
  // Extracción de palabras clave
  static getKeywordFrequency(interactions: ChatInteraction[], limit = 20): {keyword: string, count: number}[] {
    const stopWords = ["el", "la", "los", "las", "un", "una", "unos", "unas", "y", "o", "pero", "porque", "como", "que", "en", "con", "para", "por", "a", "de", "del", "al"];
    const keywordMap = new Map<string, number>();
    
    for (const interaction of interactions) {
      const words = interaction.userMessage.toLowerCase()
        .replace(/[^\w\sáéíóúüñ]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3 && !stopWords.includes(word));
      
      for (const word of words) {
        keywordMap.set(word, (keywordMap.get(word) || 0) + 1);
      }
    }
    
    return Array.from(keywordMap.entries())
      .map(([keyword, count]) => ({keyword, count}))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
  
  // Análisis de sentimiento por sesión
  static getSentimentTrends(interactions: ChatInteraction[]): {sessionId: string, sentimentStart: number, sentimentEnd: number, trend: string}[] {
    const sessionSentiments = new Map<string, {values: number[], timestamps: (Date | string)[]}>();
    
    // Agrupar sentimientos por sesión
    for (const interaction of interactions) {
      if (!sessionSentiments.has(interaction.sessionId)) {
        sessionSentiments.set(interaction.sessionId, {values: [], timestamps: []});
      }
      
      const session = sessionSentiments.get(interaction.sessionId)!;
      session.values.push(interaction.userSentiment);
      session.timestamps.push(interaction.timestamp);
    }
    
    // Analizar tendencias
    return Array.from(sessionSentiments.entries())
      .map(([sessionId, data]) => {
        if (data.values.length < 2) return null;
        
        // Convertir timestamps a Date si son strings
        const timestamps = data.timestamps.map(t => 
          typeof t === 'string' ? new Date(t) : t
        );
        
        // Ordenar por timestamp
        const pairs = data.values.map((v, i) => ({value: v, time: timestamps[i]}))
          .sort((a, b) => a.time.getTime() - b.time.getTime());
        
        const sentimentStart = pairs[0].value;
        const sentimentEnd = pairs[pairs.length - 1].value;
        const diff = sentimentEnd - sentimentStart;
        
        let trend = "stable";
        if (diff > 0.2) trend = "improving";
        else if (diff < -0.2) trend = "declining";
        
        return {sessionId, sentimentStart, sentimentEnd, trend};
      })
      .filter(item => item !== null) as {sessionId: string, sentimentStart: number, sentimentEnd: number, trend: string}[];
  }
  
  // Estadísticas temporales (preguntas por hora del día)
  static getTimeDistribution(interactions: ChatInteraction[]): Record<string, number> {
    const hourCounts: Record<string, number> = {};
    
    for (let i = 0; i < 24; i++) {
      hourCounts[i.toString().padStart(2, '0')] = 0;
    }
    
    for (const interaction of interactions) {
      const timestamp = typeof interaction.timestamp === 'string' 
        ? new Date(interaction.timestamp) 
        : interaction.timestamp;
      
      const hour = timestamp.getHours().toString().padStart(2, '0');
      hourCounts[hour]++;
    }
    
    return hourCounts;
  }
  
  // Tendencias de entidades mencionadas
  static getEntityTrends(interactions: ChatInteraction[], limit = 10): Record<string, {entity: string, count: number}[]> {
    const entityTypes: Record<string, Map<string, number>> = {
      tecnologias: new Map(),
      habilidades: new Map(),
      proyectos: new Map(),
      temas: new Map(),
      empresas: new Map()
    };
    
    for (const interaction of interactions) {
      if (!interaction.detectedEntities) continue;
      
      for (const [type, entities] of Object.entries(interaction.detectedEntities)) {
        if (type in entityTypes) {
          for (const entity of entities) {
            const map = entityTypes[type];
            map.set(entity, (map.get(entity) || 0) + 1);
          }
        }
      }
    }
    
    const result: Record<string, {entity: string, count: number}[]> = {};
    
    for (const [type, map] of Object.entries(entityTypes)) {
      result[type] = Array.from(map.entries())
        .map(([entity, count]) => ({entity, count}))
        .sort((a, b) => b.count - a.count)
        .slice(0, limit);
    }
    
    return result;
  }
  
  // Tiempo promedio de respuesta
  static getAverageResponseTime(interactions: ChatInteraction[]): number {
    if (interactions.length === 0) return 0;
    
    const times = interactions.map(i => i.processingTime).filter(t => t > 0);
    if (times.length === 0) return 0;
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }
  
  // Análisis de longitud de preguntas y respuestas
  static getMessageLengthStats(interactions: ChatInteraction[]): {
    avgUserMessageLength: number,
    avgAiResponseLength: number,
    shortestUserMessage: string,
    longestUserMessage: string
  } {
    if (interactions.length === 0) {
      return {
        avgUserMessageLength: 0,
        avgAiResponseLength: 0,
        shortestUserMessage: "",
        longestUserMessage: ""
      };
    }
    
    let totalUserLength = 0;
    let totalAiLength = 0;
    let shortestLength = Infinity;
    let longestLength = 0;
    let shortestMessage = "";
    let longestMessage = "";
    
    for (const interaction of interactions) {
      const userLength = interaction.userMessage.length;
      totalUserLength += userLength;
      totalAiLength += interaction.aiResponse.length;
      
      if (userLength < shortestLength) {
        shortestLength = userLength;
        shortestMessage = interaction.userMessage;
      }
      
      if (userLength > longestLength) {
        longestLength = userLength;
        longestMessage = interaction.userMessage;
      }
    }
    
    return {
      avgUserMessageLength: totalUserLength / interactions.length,
      avgAiResponseLength: totalAiLength / interactions.length,
      shortestUserMessage: shortestMessage,
      longestUserMessage: longestMessage
    };
  }
  
  // Análisis de sesiones con muchas interacciones
  static getMostActiveSessionsStats(interactions: ChatInteraction[], limit = 5): 
    {sessionId: string, userName?: string, count: number, duration: number, keywords: string[]}[] {
    
    // Agrupar por sesión
    const sessionMap = new Map<string, {
      count: number, 
      timestamps: (Date | string)[],
      messages: string[],
      userName?: string
    }>();
    
    for (const interaction of interactions) {
      if (!sessionMap.has(interaction.sessionId)) {
        sessionMap.set(interaction.sessionId, {
          count: 0,
          timestamps: [],
          messages: [],
          userName: interaction.userName
        });
      }
      
      const session = sessionMap.get(interaction.sessionId)!;
      session.count++;
      session.timestamps.push(interaction.timestamp);
      session.messages.push(interaction.userMessage);
      
      if (!session.userName && interaction.userName) {
        session.userName = interaction.userName;
      }
    }
    
    // Calcular estadísticas
    return Array.from(sessionMap.entries())
      .map(([sessionId, data]) => {
        // Convertir timestamps a Date si son strings
        const timestamps = data.timestamps.map(t => 
          typeof t === 'string' ? new Date(t) : t
        ) as Date[];
        
        // Ordenar timestamps
        timestamps.sort((a, b) => a.getTime() - b.getTime());
        
        // Calcular duración en minutos
        const duration = timestamps.length > 1 
          ? (timestamps[timestamps.length - 1].getTime() - timestamps[0].getTime()) / (1000 * 60) 
          : 0;
        
        // Extraer palabras clave
        const allText = data.messages.join(" ");
        const keywords = ChatAnalyzer.extractTopKeywords(allText, 5);
        
        return {
          sessionId,
          userName: data.userName,
          count: data.count,
          duration,
          keywords
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }
  
  // Extracción de palabras clave de un texto
  private static extractTopKeywords(text: string, limit = 5): string[] {
    const stopWords = ["el", "la", "los", "las", "un", "una", "unos", "unas", "y", "o", "pero", "porque", "como", "que", "en", "con", "para", "por", "a", "de", "del", "al"];
    
    const words = text.toLowerCase()
      .replace(/[^\w\sáéíóúüñ]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !stopWords.includes(word));
    
    const wordCounts = new Map<string, number>();
    for (const word of words) {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    }
    
    return Array.from(wordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([word]) => word);
  }
  
  // Ayuda a normalizar preguntas para identificar similitudes
  private static normalizeQuestion(question: string): string {
    return question.toLowerCase()
      .replace(/[^\w\sáéíóúüñ]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
} 