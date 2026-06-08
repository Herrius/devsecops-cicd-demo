// ============================================================================
//  Configuración de PagoFácil
// ----------------------------------------------------------------------------
//  ⚠️  ANTI-PATRÓN INTENCIONAL (VULN 1 — detectable por Gitleaks)
//      Estos secretos están hardcodeados a propósito para la demo.
//      En producción JAMÁS deben vivir en el código: van en variables de
//      entorno o en un gestor de secretos (Vault, AWS Secrets Manager, etc.).
// ============================================================================

module.exports = {
  port: process.env.PORT || 3000,

  // Clave de firma de los tokens JWT — nunca debería estar en el repositorio.
  jwtSecret: "pf_jwt_2f9a1c7e8b4d63a05e1f9c2d7b6a4e3f1029384756abcdef",

  // API key de la pasarela de pago — Gitleaks la marca (regla generic-api-key).
  // Se evita un prefijo de proveedor real (p. ej. "sk_live_") a propósito: así
  // GitHub Push Protection no bloquea el push y la demo es replicable por cualquiera.
  paymentGatewayKey: "pf_pay_7Hq3Lz9Tx2Vb8Nm4Rk6Wp1Yc5Dg0Fj7Hs2Ln9Qt4Bv6",

  // Credenciales de base de datos hardcodeadas.
  db: {
    host: "127.0.0.1",
    user: "pagofacil_app",
    password: "Sup3rS3cr3tDBp@ss!2026"
  }
};
