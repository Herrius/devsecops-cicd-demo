#!/usr/bin/env bash
# ============================================================================
#  DEMO — Bloque 3: Container Scanning con Trivy
# ----------------------------------------------------------------------------
#  Idea: el código puede estar limpio y la IMAGEN BASE venir podrida.
#  Trivy 'image' escanea las CVEs del sistema operativo de la imagen + las deps.
#
#  Uso en vivo:  bash scripts/demo-container.sh
#  (Corre paso a paso; pausa entre comandos para narrar.)
# ============================================================================
set -e
IMG="pagofacil:demo"

echo "==> 1) Construir la imagen de la app (incluye el SO base Debian)"
docker build -t "$IMG" .

echo
echo "==> 2) (opcional) Levantarla para mostrar que funciona igual que en local"
echo "    docker run -d --name pf -p 3001:3000 $IMG  # -> http://localhost:3001"

echo
echo "==> 3) Escanear la IMAGEN con Trivy (CVEs del SO + dependencias)"
echo "    Fíjate: aparecen CRITICAL del sistema operativo que NO están en tu código."
docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy:latest image \
  --scanners vuln --severity HIGH,CRITICAL --no-progress "$IMG"

echo
echo "==> Lección: el FIX es usar una imagen mínima (alpine/slim/distroless)."
echo "    Cambiar 'FROM node:24-bookworm' por 'node:24-alpine' recorta casi todas"
echo "    las CVEs del SO. Menos superficie = menos ataque."
