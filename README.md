# Portafolio de Eduardo con Fresh

Este es mi portafolio personal construido con Fresh, un framework web de Deno. Incluye una funcionalidad de chat IA llamada SobremIA.

## Desarrollo local

Para ejecutar el proyecto localmente:

```bash
deno task start
```

## Construcción

Para construir el proyecto:

```bash
deno task build
```

## Sistema de Analíticas

El proyecto incluye un sofisticado sistema de recolección y análisis de datos que permite:

- Rastrear todas las interacciones de usuarios con el chatbot
- Analizar patrones de preguntas y respuestas
- Identificar las intenciones más comunes
- Extraer palabras clave y entidades mencionadas
- Generar estadísticas de uso y comportamiento

### Acceso al Panel de Analíticas

El panel de administración está disponible en:
```
/admin/analytics?token=sobremia2024
```

También puedes usar el token anterior `sobremia_admin` si ya lo tenías guardado.

### Exportación de Datos

Los datos pueden ser exportados en formato JSON o CSV desde:
```
/admin/export?format=json&token=sobremia2024
/admin/export?format=csv&token=sobremia2024
```

Los datos se almacenan en archivos diarios en el directorio `data/`.

## Despliegue

### Despliegue en Deno Deploy

Para desplegar en Deno Deploy:

1. Asegúrate de tener deployctl instalado:
   ```bash
   deno install -gArf jsr:@deno/deployctl
   ```

2. Añade el directorio bin de Deno a tu PATH si no está ya:
   ```bash
   export PATH="$HOME/.deno/bin:$PATH"
   ```

3. Construye el proyecto:
   ```bash
   deno task build
   ```

4. Despliega el proyecto:
   ```bash
   deno task deploy
   ```

El proyecto estará disponible en:
- https://eduardo.deno.dev

### Despliegue en GitHub Pages

Para desplegar en GitHub Pages:

```bash
./deploy-gh-pages.sh
```

## Tecnologías utilizadas

- [Deno](https://deno.land/)
- [Fresh](https://fresh.deno.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Preact](https://preactjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)

## Características Principales

- Asistente conversacional basado en el Modelo e1 (ver [documentación detallada](/docs/modelo-e1/README.md))
- Interfaz interactiva desarrollada con Fresh y Deno
- Diseño responsivo y accesible

## Tecnologías Utilizadas

- **Frontend**: Fresh, TypeScript, Tailwind CSS
- **Backend**: Deno, TypeScript
- **Modelo Conversacional**: Arquitectura neural personalizada "Modelo e1"

## Documentación

Para más información sobre el Modelo e1, consulta la [documentación detallada](/docs/modelo-e1/README.md).

## Licencia

MIT
