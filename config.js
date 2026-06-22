// ============================================================================
//  Configuración de PagoFácil  (RAMA fix — secretos fuera del código)
// ----------------------------------------------------------------------------
//  Los secretos se leen de variables de entorno (un .env en .gitignore o un
//  gestor de secretos). Ya NO viven en el repositorio → Gitleaks no encuentra
//  nada que reportar.
// ============================================================================

module.exports = {
  port: process.env.PORT || 3000,

  // Clave de firma de los tokens JWT — inyectada por entorno.
  jwtSecret: process.env.JWT_SECRET,

  // API key de la pasarela de pago — inyectada por entorno.
  paymentGatewayKey: process.env.PAYMENT_GATEWAY_KEY,

  // Credenciales de base de datos — inyectadas por entorno.
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  }
};
