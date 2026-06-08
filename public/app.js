// Front-end de PagoFácil (vanilla JS). Habla con la API del propio servidor.
let token = null;
let userId = null;

const $ = (id) => document.getElementById(id);

// ---- Login ----
$('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  $('login-error').textContent = '';
  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: $('username').value, password: $('password').value })
    });
    const data = await res.json();
    if (!res.ok) { $('login-error').textContent = data.error || 'Error'; return; }

    token = data.token;
    userId = data.user.id;
    enterDashboard(data.user);
  } catch {
    $('login-error').textContent = 'No se pudo conectar con el servidor';
  }
});

function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
}

async function enterDashboard(user) {
  $('login-view').classList.add('hidden');
  $('dashboard-view').classList.remove('hidden');
  $('user-name').textContent = user.full_name;
  $('balance').textContent = 'S/ ' + Number(user.balance).toFixed(2);
  loadTransactions();
}

async function loadTransactions() {
  const res = await fetch('/api/transactions/' + userId, { headers: authHeaders() });
  const rows = await res.json();
  const list = $('tx-list');
  list.innerHTML = '';
  if (!rows.length) { list.innerHTML = '<li class="muted">Sin movimientos</li>'; return; }
  for (const t of rows) {
    const li = document.createElement('li');
    const sign = t.amount < 0 ? 'neg' : 'pos';
    li.innerHTML = `<span>${t.description} <small class="muted">${t.created_at}</small></span>
                    <span class="amount ${sign}">S/ ${Number(t.amount).toFixed(2)}</span>`;
    list.appendChild(li);
  }
}

// ---- Transferencia ----
$('transfer-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const res = await fetch('/api/transfer', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ to: $('to').value, amount: Number($('amount').value), note: $('note').value })
  });
  const data = await res.json();
  $('transfer-result').textContent = res.ok
    ? `✓ Transferencia de S/ ${data.transfer.amount} a ${data.transfer.to} registrada`
    : (data.error || 'Error');
});

// ---- Comprobante ----
$('receipt-btn').addEventListener('click', async () => {
  const res = await fetch('/api/receipt?account=' + userId, { headers: authHeaders() });
  const data = await res.json();
  $('receipt-out').textContent = res.ok ? data.receipt : (data.error || 'Error');
});

// ---- Logout ----
$('logout-btn').addEventListener('click', () => {
  token = null; userId = null;
  $('dashboard-view').classList.add('hidden');
  $('login-view').classList.remove('hidden');
  $('login-form').reset();
});
