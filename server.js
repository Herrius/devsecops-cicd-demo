// ============================================================================
//  PagoFácil — API + servidor estático
//  DEMO EDUCATIVA: contiene vulnerabilidades plantadas a propósito.
//  No usar este código como referencia de cómo escribir una API segura.
// ============================================================================

const express = require('express');
const jwt = require('jsonwebtoken');
const { execFile } = require('child_process');
const _ = require('lodash');
const path = require('path');

const config = require('./config');
const { initDb } = require('./db');

const app = express();
const db = initDb();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ---------------------------------------------------------------------------
//  Middleware de autenticación (valida el JWT)
// ---------------------------------------------------------------------------
function auth(req, res, next) {
  const header = req.headers['authorization'] || '';
  const token = header.replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, config.jwtSecret);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o ausente' });
  }
}

// ---------------------------------------------------------------------------
//  POST /api/login
//  ✅ FIX VULN 2 — SQL Injection cerrada con consulta parametrizada.
//    El dato del usuario va por placeholders (?), nunca concatenado al SQL.
// ---------------------------------------------------------------------------
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  try {
    const row = db.prepare(
      'SELECT id, username, full_name, balance FROM users WHERE username = ? AND password = ?'
    ).get(username, password);
    if (!row) return res.status(401).json({ error: 'Credenciales inválidas' });

    const token = jwt.sign(
      { id: row.id, username: row.username },
      config.jwtSecret,
      { expiresIn: '1h' }
    );
    res.json({ token, user: row });
  } catch (e) {
    res.status(500).json({ error: 'Error al procesar la consulta' });
  }
});

// ---------------------------------------------------------------------------
//  GET /api/balance/:id  (saldo de la cuenta — consulta parametrizada, OK)
// ---------------------------------------------------------------------------
app.get('/api/balance/:id', auth, (req, res) => {
  const row = db.prepare(
    'SELECT full_name, balance FROM users WHERE id = ?'
  ).get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Cuenta no encontrada' });
  res.json(row);
});

// ---------------------------------------------------------------------------
//  GET /api/transactions/:id  (movimientos — consulta parametrizada, OK)
// ---------------------------------------------------------------------------
app.get('/api/transactions/:id', auth, (req, res) => {
  const rows = db.prepare(
    'SELECT description, amount, created_at FROM transactions WHERE account_id = ? ORDER BY id DESC'
  ).all(req.params.id);
  res.json(rows);
});

// ---------------------------------------------------------------------------
//  POST /api/transfer
//  ▶ VULN 4 — superficie SCA: usa lodash.defaultsDeep (CVE-2019-10744,
//    prototype pollution). El riesgo lo detecta Trivy en la dependencia.
// ---------------------------------------------------------------------------
app.post('/api/transfer', auth, (req, res) => {
  const defaults = { currency: 'PEN', note: '' };
  const opts = _.defaultsDeep({}, req.body || {}, defaults);

  if (!opts.to || !opts.amount) {
    return res.status(400).json({ error: 'Faltan datos de la transferencia' });
  }
  // Lógica simplificada para la demo (no persiste).
  res.json({ status: 'ok', transfer: opts });
});

// ---------------------------------------------------------------------------
//  GET /api/receipt
//  ✅ FIX VULN 3 — Command Injection cerrada: sin shell y con el dato saneado.
//    execFile no invoca shell, y 'account' se castea a número.
// ---------------------------------------------------------------------------
app.get('/api/receipt', auth, (req, res) => {
  const account = Number(req.query.account) || 0;

  execFile('date', [], (err, stdout) => {
    if (err) return res.status(500).json({ error: 'No se pudo generar el comprobante' });
    res.json({ receipt: `Comprobante de la cuenta ${account}\n${stdout.trim()}` });
  });
});

app.listen(config.port, () => {
  console.log(`PagoFácil escuchando en http://localhost:${config.port}`);
});
