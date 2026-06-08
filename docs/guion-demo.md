# 🎬 Guion de la demo en vivo — PagoFácil (8–10 min)

Mapeado a las slides finales de la exposición (bloque "Demo"). Cada paso indica
qué decir y qué mostrar. **Plan B:** ten capturas de cada pantalla por si falla
el wifi/proyector.

---

### 0. Encuadre (30 s)
> "Esta es PagoFácil, una billetera digital de juguete. Tiene 4 vulnerabilidades
> típicas plantadas a propósito. Vamos a ver cómo un pipeline gratuito las caza
> antes de que lleguen a producción."

Mostrar la app corriendo: `npm start` → http://localhost:3000 → login con `ana/ana123` → dashboard.

---

### 1. La app funciona… y es explotable (1.5 min)
- Login normal con `ana / ana123`. Mostrar saldo y movimientos.
- **PoC de SQLi en vivo:** cerrar sesión, entrar con usuario `admin'--` y cualquier contraseña → **entras como admin sin saber la clave.**
> "El login concatena mi texto dentro de la consulta SQL. Esto es lo que el SAST detecta sin siquiera ejecutar la app."

---

### 2. El repo y el pipeline (1 min)
- Mostrar `server.js` (las 3 vulns de código comentadas) y `config.js` (los secretos).
- Abrir `.github/workflows/devsecops.yml`: explicar los 4 pasos
  (Gitleaks → Semgrep → Trivy → Quality Gate).

---

### 3. Gitleaks — secretos (1.5 min)
- En la pestaña **Security → Code scanning**, mostrar el hallazgo de Gitleaks:
  la clave tipo Stripe y el JWT secret de `config.js`.
> "Una credencial filtrada en el repo es de las formas más rápidas de comprometer una empresa."

---

### 4. Semgrep — SAST (2 min)
- Mostrar los hallazgos de Semgrep en la pestaña Security: **SQL Injection** (login)
  y **Command Injection** (comprobante), cada uno con su CWE.
> "SAST analiza el código fuente sin ejecutarlo. Detecta el patrón vulnerable, pero
> no entiende el contexto de negocio — por eso al final sigue haciendo falta un pentest manual."

---

### 5. Trivy — SCA y el Quality Gate (2 min)
- Mostrar el hallazgo de Trivy: `lodash@4.17.4` → **CVE-2019-10744, CVSS 9.1 CRITICAL**.
- Mostrar el run de Actions en **rojo**: el **Quality Gate rompió el build** por la CVE crítica.
> "Aquí está el control automático: ninguna vulnerabilidad CRITICAL pasa a producción. El build se detiene solo."

---

### 6. Cierre en verde (1.5 min)
- Mostrar la rama `fix` (o `docs/SOLUCION.md`): los 4 fixes (env vars, query parametrizada,
  `execFile`, bump de lodash).
- Mostrar el PR de `fix` con el pipeline **en verde**.
> "Esto es lo mínimo viable y gratis. En enterprise se suma policy management centralizado,
> métricas ejecutivas e integración con Jira — y ahí es donde entran plataformas como Veracode."

---

## Checklist previo a presentar
- [ ] `npm install && npm start` probado en la máquina de la demo
- [ ] Repo público en GitHub con Actions habilitado
- [ ] Al menos 1 run completo ya indexado en la pestaña Security (la 1ª vez tarda 1-2 min)
- [ ] Rama `fix` creada y su PR en verde
- [ ] Capturas de respaldo: run en rojo, hallazgos por escáner, PR en verde
