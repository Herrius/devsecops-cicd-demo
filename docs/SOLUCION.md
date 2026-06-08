# ✅ SOLUCIÓN — los 4 fixes para dejar el pipeline en verde

Aplicar estos cambios cierra las 4 vulnerabilidades y el Quality Gate pasa.
La forma limpia de demostrarlo es crear una rama `fix` con estos cambios.

---

## 1. Secretos hardcodeados → variables de entorno (Gitleaks)

**`config.js`** — reemplazar los valores literales por lectura de entorno:

```js
module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
};
```

Los secretos pasan a un `.env` (en `.gitignore`) o a un gestor de secretos.

---

## 2. SQL Injection → consulta parametrizada (Semgrep)

**`server.js`, `/api/login`** — usar placeholders en vez de concatenar:

```js
const row = db.prepare(
  'SELECT id, username, full_name, balance FROM users WHERE username = ? AND password = ?'
).get(username, password);
```

---

## 3. Command Injection → sin shell, con argumentos (Semgrep)

**`server.js`, `/api/receipt`** — evitar `exec` con concatenación. Lo ideal es
no usar shell para esto; si se necesita, `execFile` separa el comando de los datos:

```js
const { execFile } = require('child_process');
execFile('date', [], (err, stdout) => {
  if (err) return res.status(500).json({ error: 'No se pudo generar el comprobante' });
  res.json({ receipt: `Comprobante de la cuenta ${Number(account)}\n${stdout.trim()}` });
});
```

(El `account` se castea a número, eliminando la inyección.)

---

## 4. Dependencia vulnerable → actualizar lodash (Trivy)

**`package.json`** — subir lodash a una versión parcheada (≥ 4.17.12; usar la última 4.17.21):

```json
"lodash": "^4.17.21"
```

Luego:

```bash
npm install   # actualiza package-lock.json
```

Esto elimina la CVE-2019-10744 CRITICAL y el **Quality Gate deja de romper el build**.

---

## Verificación final

```bash
git checkout -b fix
# aplicar los 4 cambios
npm install
git commit -am "fix: cerrar las 4 vulnerabilidades de la demo"
git push origin fix
```

Abrir un PR de `fix` → el pipeline corre → **todo en verde**. Cierre perfecto para la exposición.
