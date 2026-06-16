# 🛡️ Integración con Veracode para la demo

Esta guía complementa la demo de PagoFácil añadiendo **Veracode** como ejemplo de plataforma enterprise unificada (ASPM).

## ¿Por qué Veracode no va en cada push?

Veracode Static Scan es un SAST de política completa: analiza el código en la nube de Veracode y puede tardar entre 10 y 30 minutos. Por eso este workflow se dispara **manualmente** (`workflow_dispatch`) y no en cada `push`/`pull_request`.

Para la exposición se recomienda:
1. Lanzar el scan al menos 1 hora antes.
2. Mostrar el dashboard con resultados ya listos.
3. Comparar con los escáneres OSS (Gitleaks/Semgrep/Trivy) del pipeline principal.

---

## 1. Generar API credentials en Veracode

1. Inicia sesión en la plataforma Veracode.
2. Haz clic en el dropdown de tu cuenta (arriba a la derecha).
3. Selecciona **API Credentials**.
4. Haz clic en **Generate API Credentials**.
5. Copia y guarda el **API ID** y la **API Key**.

> Cada usuario de Veracode solo puede tener una API key activa. Si ya existe una, úsala o regénerala.

---

## 2. Guardar credenciales en GitHub

1. Abre el repo en GitHub: `https://github.com/Herrius/devsecops-cicd-demo`.
2. Ve a **Settings → Secrets and variables → Actions**.
3. Asegúrate de estar en la pestaña **Secrets** (no Variables).
4. Crea dos secrets:
   - `VERACODE_API_ID`
   - `VERACODE_API_KEY`

> Captura de referencia: en Obsidian guarda la imagen como `github-secrets-veracode.png` junto a esta guía.

---

## 3. Ejecutar el workflow

Una vez los secrets existen, el workflow ya puede autenticarse con Veracode:

1. En el repo, ve a la pestaña **Actions**.
2. Selecciona **Veracode Static Scan — PagoFácil**.
3. Haz clic en **Run workflow → Run workflow**.
4. GitHub empaquetará el código y lo subirá a Veracode usando tus credenciales.

Con `scantimeout: 0` el workflow termina inmediatamente después de subir el código. El análisis se revisa directamente en el dashboard de Veracode.

---

## 4. Crear la aplicación manualmente (alternativa)

Si prefieres no usar GitHub Actions:

1. **My Portfolio → Applications → Add New Application**.
2. Nombre: `PagoFácil-Demo`.
3. Business Criticality: `High`.
4. Guarda y entra a la aplicación.
5. **Start a Scan → Start a Static Scan**.
6. Sube un ZIP del repo sin `node_modules` ni `.git`.
7. Activa **Auto-Scan after Prescan**.
8. Espera a que termine y revisa el dashboard.

---

## 5. Qué mostrar en la exposición

| Punto | Qué decir |
|---|---|
| Dashboard de aplicaciones | *"Así se ve el panel unificado: una app, su último scan, policy compliance y severidad."* |
| Findings de SAST | Muestra SQL injection y command injection; compara con Semgrep (mismo bug, otra UX). |
| Findings de SCA | Muestra la CVE de lodash; compara con Trivy. |
| Policy compliance | Explica que Veracode aplica una política corporativa automáticamente. |
| Diferencia con OSS | *"Lo que hicimos gratis con 4 herramientas, aquí está en un solo panel, con gobierno, métricas e integración con Jira."* |
