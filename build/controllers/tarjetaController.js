"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../database"));
const paypalConfig_1 = __importDefault(require("../paypalConfig"));
const checkout_server_sdk_1 = __importDefault(require("@paypal/checkout-server-sdk"));
class TarjetaController {
    getAllTarjetas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const tarjetas = yield database_1.default.query('SELECT * FROM Tarjeta');
            res.json(tarjetas);
        });
    }
    addTarjeta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { NumeroTarjeta, NombreTitular, FechaVencimiento, CVV, IdUsuario } = req.body;
            const Saldo = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;
            yield database_1.default.query('INSERT INTO Tarjeta (NumeroTarjeta, NombreTitular, FechaVencimiento, CVV, Saldo, IdUsuario) VALUES (?, ?, ?, ?, ?, ?)', [NumeroTarjeta, NombreTitular, FechaVencimiento, CVV, Saldo, IdUsuario]);
            res.json({ message: 'Tarjeta agregada exitosamente', saldoInicial: Saldo });
        });
    }
    simularTransferencia(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { IdUsuario, IdTarjeta, monto } = req.body;
            // Obtener la tarjeta del usuario
            const tarjeta = yield database_1.default.query('SELECT * FROM Tarjeta WHERE IdTarjeta = ? AND IdUsuario = ?', [IdTarjeta, IdUsuario]);
            if (tarjeta.length === 0) {
                res.status(404).json({ message: 'Tarjeta no encontrada o no pertenece al usuario' });
                return;
            }
            const saldoActual = tarjeta[0].Saldo;
            if (saldoActual < monto) {
                res.status(400).json({ message: 'Saldo insuficiente' });
                return;
            }
            const request = new checkout_server_sdk_1.default.orders.OrdersCreateRequest();
            request.requestBody({
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: monto.toFixed(2),
                        },
                    },
                ],
            });
            try {
                // Crear la orden de PayPal
                const order = yield paypalConfig_1.default.execute(request);
                console.log('Order ID: ', order.result.id);
                const nuevoSaldo = saldoActual - monto;
                yield database_1.default.query('UPDATE Tarjeta SET Saldo = ? WHERE IdTarjeta = ?', [nuevoSaldo, IdTarjeta]);
                const descripcion = order.result.id;
                const categoria = 'Transferencia Bancaria';
                const metodoPago = tarjeta[0].NumeroTarjeta;
                const fechaTransaccion = new Date();
                yield database_1.default.query('INSERT INTO Gasto (IdUsuario, Descripcion, Categoria, Monto, FechaTransaccion, MetodoPago) VALUES (?, ?, ?, ?, ?, ?)', [IdUsuario, descripcion, categoria, monto, fechaTransaccion, metodoPago]);
                const recibo = {
                    orderID: order.result.id,
                    fecha: fechaTransaccion,
                    monto: monto,
                    tarjeta: metodoPago,
                    descripcion: categoria
                };
                res.json({
                    message: 'Transferencia simulada exitosamente con PayPal',
                    saldoRestante: nuevoSaldo,
                    recibo: recibo
                });
            }
            catch (err) {
                if (err instanceof Error) {
                    res.status(500).json({ message: 'Error en la simulación de transferencia con PayPal', error: err.message });
                }
                else {
                    res.status(500).json({ message: 'Error desconocido en la simulación de transferencia con PayPal' });
                }
            }
        });
    }
    getTarjetasByUsuario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { IdUsuario } = req.params;
            const tarjetas = yield database_1.default.query('SELECT * FROM Tarjeta WHERE IdUsuario = ?', [IdUsuario]);
            res.json(tarjetas);
        });
    }
    eliminarTarjeta(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('DELETE FROM Tarjeta WHERE IdTarjeta = ?', [id]);
            res.json({ message: 'Tarjeta eliminada exitosamente' });
        });
    }
}
const tarjetaController = new TarjetaController();
exports.default = tarjetaController;
