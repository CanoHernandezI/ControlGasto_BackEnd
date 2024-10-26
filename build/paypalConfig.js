"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const checkout_server_sdk_1 = __importDefault(require("@paypal/checkout-server-sdk"));
let environment = new checkout_server_sdk_1.default.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID || 'AYszAPSV9EbjGaOHv5tKqtwQmZJS5DB6apf2Al71bCekujWAlZgWKy_nDZwWrXzAdqVfoWIiByMCZy7d', process.env.PAYPAL_CLIENT_SECRET || 'ELX-CNJuthOejR8Dp11NpLxebmfHg64BodEmrHNio7tM1iP8M5KqatkA37YaF-Im7kCCP2u8l19xzlil');
let client = new checkout_server_sdk_1.default.core.PayPalHttpClient(environment);
exports.default = client;
