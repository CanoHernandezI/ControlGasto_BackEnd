import paypal from '@paypal/checkout-server-sdk';

let environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID || 'AYszAPSV9EbjGaOHv5tKqtwQmZJS5DB6apf2Al71bCekujWAlZgWKy_nDZwWrXzAdqVfoWIiByMCZy7d', 
  process.env.PAYPAL_CLIENT_SECRET || 'ELX-CNJuthOejR8Dp11NpLxebmfHg64BodEmrHNio7tM1iP8M5KqatkA37YaF-Im7kCCP2u8l19xzlil'
);

let client = new paypal.core.PayPalHttpClient(environment);

export default client;
