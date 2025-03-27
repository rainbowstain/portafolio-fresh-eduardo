#!/bin/bash

# Generar los archivos estáticos
deno task build

# Crear directorio temporal
mkdir -p _site

# Copiar archivos estáticos a _site
cp -r _fresh/* _site/

# Crear archivo .nojekyll para evitar procesamiento Jekyll
touch _site/.nojekyll

# Crear archivo index.html en la raíz
echo '<!DOCTYPE html>
<html>
<head>
  <meta http-equiv="refresh" content="0;url=./_fresh/index.html">
</head>
<body>
  Redireccionando...
</body>
</html>' > _site/index.html

echo "Archivos preparados para GitHub Pages en _site/"
