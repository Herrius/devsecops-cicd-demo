// ============================================================================
//  Capa de datos — SQLite en memoria (built-in de Node, sin dependencias)
//  Siembra usuarios y movimientos de demo al arrancar el servidor.
// ============================================================================

const { DatabaseSync } = require('node:sqlite');

function initDb() {
  const db = new DatabaseSync(':memory:');

  db.exec(`
    CREATE TABLE users (
      id        INTEGER PRIMARY KEY,
      username  TEXT UNIQUE,
      password  TEXT,
      full_name TEXT,
      balance   REAL
    );
    CREATE TABLE transactions (
      id          INTEGER PRIMARY KEY,
      account_id  INTEGER,
      description TEXT,
      amount      REAL,
      created_at  TEXT
    );
  `);

  const insUser = db.prepare(
    'INSERT INTO users (username, password, full_name, balance) VALUES (?, ?, ?, ?)'
  );
  insUser.run('ana',   'ana123',     'Ana Torres',     1500.50);
  insUser.run('luis',  'luis123',    'Luis Pérez',      320.00);
  insUser.run('admin', 'admin#2026', 'Administrador',  99999.99);

  const insTx = db.prepare(
    'INSERT INTO transactions (account_id, description, amount, created_at) VALUES (?, ?, ?, ?)'
  );
  insTx.run(1, 'Depósito inicial',       1500.50, '2026-06-01');
  insTx.run(1, 'Pago servicio de luz',    -80.00, '2026-06-03');
  insTx.run(1, 'Recarga de celular',      -30.00, '2026-06-05');

  return db;
}

module.exports = { initDb };
