#!/bin/bash

# Script para desplegar manualmente a Deno Deploy

echo "🚀 Iniciando despliegue manual a Deno Deploy..."

# Verificar si deployctl está instalado
if ! command -v deployctl &> /dev/null; then
    echo "⚠️ deployctl no está instalado. Instalando..."
    deno install --allow-all --no-check -r -f https://deno.land/x/deploy/deployctl.ts
    echo "✅ deployctl instalado correctamente"
else
    echo "✅ deployctl ya está instalado"
fi

# Construir el proyecto
echo "🛠️ Construyendo el proyecto..."
deno task build
echo "✅ Proyecto construido correctamente"

# Verificar si hay un token de Deno Deploy
if [ -z "$DENO_DEPLOY_TOKEN" ]; then
    echo "⚠️ No se ha configurado el token de Deno Deploy."
    echo "Por favor, crea un token en https://dash.deno.com/account#access-tokens"
    echo "y configúralo como una variable de entorno con:"
    echo "export DENO_DEPLOY_TOKEN=tu_token"
    exit 1
fi

# Desplegar a Deno Deploy
echo "📤 Desplegando a Deno Deploy..."
deployctl deploy --project=eduardo-ia-portafolio --prod main.ts

echo "✅ Despliegue completado. Verifica en https://eduardo-ia-portafolio.deno.dev/"
