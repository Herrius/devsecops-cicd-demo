#!/usr/bin/env bash
# ============================================================================
#  DEMO — Bloque 4: DAST (Dynamic Application Security Testing) con OWASP ZAP
# ----------------------------------------------------------------------------
#  Idea: a diferencia del SAST (que lee el código), el DAST ATACA la app
#  CORRIENDO, como un atacante externo. Encuentra cosas que solo existen en
#  ejecución (headers de seguridad ausentes, configuración del servidor...),
#  pero NO te dice en qué línea del código está el fallo.
#
#  Requisito: la app debe estar levantada en http://localhost:3000
#     npm start    (o)    docker run -d -p 3000:3000 pagofacil:demo
#
#  Uso en vivo:  bash scripts/demo-dast.sh
# ============================================================================
set -e
TARGET="http://localhost:3000"

echo "==> Comprobando que la app responde en $TARGET ..."
curl -s -o /dev/null -w "    HTTP %{http_code}\n" "$TARGET" || {
  echo "    ⚠️  La app no responde. Arráncala con 'npm start' antes de la demo."; exit 1; }

echo
echo "==> Lanzando OWASP ZAP en modo 'baseline' contra la app en ejecución."
echo "    (--network host -> el contenedor ZAP llega a localhost del equipo)"
echo
# zap-baseline.py: escaneo pasivo rápido (~1-2 min), ideal para demo.
# Devuelve exit-code != 0 si encuentra alertas -> por eso el '|| true'.
docker run --rm --network host \
  zaproxy/zap-stable zap-baseline.py \
  -t "$TARGET" -I || true

echo
echo "==> Lectura: ZAP reporta alertas de RUNTIME (cabeceras de seguridad"
echo "    ausentes como CSP / X-Content-Type-Options, cookies, etc.)."
echo "    El SAST no las veía porque solo aparecen con la app corriendo."
echo "    Contraste clave para la charla: SAST=código muerto, DAST=app viva."
