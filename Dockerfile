# ============================================================================
#  PagoFácil — imagen de contenedor (DEMO de Container Scanning)
# ----------------------------------------------------------------------------
#  ⚠️  ELECCIÓN INTENCIONAL PARA LA DEMO:
#      Usamos una imagen base Debian "gorda" (bookworm) a propósito. Trae todo
#      el sistema operativo y, con él, decenas de CVEs a nivel de SO que NO
#      están en tu código ni en tus dependencias npm. Es justo lo que el
#      Container Scanning (Trivy image) saca a la luz.
#
#      El FIX real de seguridad es lo contrario: usar una imagen mínima
#      (alpine / slim / distroless) para reducir la superficie de ataque.
#      Eso se menciona en la demo como "cómo se cierra este hallazgo".
# ============================================================================
FROM node:24-bookworm

WORKDIR /app

# Instala dependencias a partir del lockfile (incluye lodash 4.17.4 vulnerable).
COPY package*.json ./
RUN npm ci || npm install

# Copia el resto de la app.
COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
