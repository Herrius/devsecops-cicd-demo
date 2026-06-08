# 💳 PagoFácil — Demo educativa de DevSecOps

Mini billetera digital (Node.js + Express + SQLite) construida **a propósito con vulnerabilidades plantadas** para mostrar, en vivo, cómo un pipeline de **DevSecOps con herramientas 100% gratuitas** las detecta antes de llegar a producción.

> ⚠️ **Aviso:** este proyecto es inseguro deliberadamente. Es material de capacitación. **No lo uses como base de una app real ni lo despliegues en Internet.**

---

## ¿Qué hace la app?

Una billetera de juguete con interfaz web: login, consulta de saldo, transferencia, generación de comprobante y lista de movimientos.

| Usuario | Contraseña |
|---|---|
| `ana`  | `ana123`  |
| `luis` | `luis123` |
| `admin`| `admin#2026` |

## Cómo correrla localmente

```bash
npm install
npm start
# abre http://localhost:3000
```

No requiere base de datos externa: usa **SQLite en memoria** (módulo `node:sqlite`, integrado en Node ≥ 22).

---

## Las 4 vulnerabilidades plantadas (1 por herramienta)

| # | Vulnerabilidad | Dónde | La detecta |
|---|---|---|---|
| 1 | **Secretos hardcodeados** (clave JWT + key tipo Stripe) | `config.js` | 🔑 **Gitleaks** |
| 2 | **SQL Injection** | `POST /api/login` en `server.js` | 🐞 **Semgrep (SAST)** |
| 3 | **Command Injection** | `GET /api/receipt` en `server.js` | 🐞 **Semgrep (SAST)** |
| 4 | **Dependencia vulnerable** `lodash@4.17.4` (CVE-2019-10744, CVSS 9.1) | `package.json` | 📦 **Trivy (SCA)** |

### Pruebas de concepto (manuales)
- **SQLi (bypass de login):** usuario `admin'--`, cualquier contraseña.
- **Command Injection:** la API arma `echo ... && date` con el parámetro `account`; un valor como `1; id` ejecutaría `id` en el servidor.

---

## El pipeline DevSecOps

`.github/workflows/devsecops.yml` ejecuta en cada push/PR:

1. 🔑 **Gitleaks** — escaneo de secretos
2. 🐞 **Semgrep** — SAST (reglas `p/owasp-top-ten` + reglas custom en `.semgrep.yml`)
3. 📦 **Trivy** — SCA de dependencias
4. 🚦 **Quality Gate** — **rompe el build si hay alguna vulnerabilidad CRITICAL**

Los hallazgos de los 3 escáneres se publican en formato **SARIF** en la pestaña **Security → Code scanning** del repositorio (gratis en repos públicos).

## Stack 100% gratuito

Semgrep CE, Trivy y Gitleaks son open source; GitHub Actions y Code Scanning son gratis en repositorios públicos. **No hay ningún costo** mientras el repo sea público.

## Cómo cerrar la demo "en verde"

Ver [`docs/SOLUCION.md`](docs/SOLUCION.md): aplica los 4 fixes y el pipeline pasa a verde.

## Guion de la demo

Ver [`docs/guion-demo.md`](docs/guion-demo.md): recorrido minuto a minuto para la exposición.
