import { Request, Response } from 'express';
import pool from '../database';
import paypalClient from '../paypalConfig';
import paypal from '@paypal/checkout-server-sdk';

class TarjetaController {
    public async getAllTarjetas(req: Request, res: Response): Promise<void> {
        const tarjetas = await pool.query('SELECT * FROM Tarjeta');
        res.json(tarjetas);
    }

    public async addTarjeta(req: Request, res: Response): Promise<void> {
        const { NumeroTarjeta, NombreTitular, FechaVencimiento, CVV, IdUsuario } = req.body;

        const Saldo = Math.floor(Math.random() * (15000 - 5000 + 1)) + 5000;

        await pool.query(
            'INSERT INTO Tarjeta (NumeroTarjeta, NombreTitular, FechaVencimiento, CVV, Saldo, IdUsuario) VALUES (?, ?, ?, ?, ?, ?)',
            [NumeroTarjeta, NombreTitular, FechaVencimiento, CVV, Saldo, IdUsuario]
        );

        res.json({ message: 'Tarjeta agregada exitosamente', saldoInicial: Saldo });
    }

    public async simularTransferencia(req: Request, res: Response): Promise<void> {
        const { IdUsuario, IdTarjeta, monto } = req.body;

        // Obtener la tarjeta del usuario
        const tarjeta = await pool.query('SELECT * FROM Tarjeta WHERE IdTarjeta = ? AND IdUsuario = ?', [IdTarjeta, IdUsuario]);
        if (tarjeta.length === 0) {
            res.status(404).json({ message: 'Tarjeta no encontrada o no pertenece al usuario' });
            return;
        }

        const saldoActual = tarjeta[0].Saldo;
        if (saldoActual < monto) {
            res.status(400).json({ message: 'Saldo insuficiente' });
            return;
        }

        const request = new paypal.orders.OrdersCreateRequest();
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
            const order = await paypalClient.execute(request);
            console.log('Order ID: ', order.result.id);

            const nuevoSaldo = saldoActual - monto;
            await pool.query('UPDATE Tarjeta SET Saldo = ? WHERE IdTarjeta = ?', [nuevoSaldo, IdTarjeta]);

            const descripcion = order.result.id;
            const categoria = 'Transferencia Bancaria';
            const metodoPago = tarjeta[0].NumeroTarjeta;
            const fechaTransaccion = new Date();

            await pool.query(
                'INSERT INTO Gasto (IdUsuario, Descripcion, Categoria, Monto, FechaTransaccion, MetodoPago) VALUES (?, ?, ?, ?, ?, ?)',
                [IdUsuario, descripcion, categoria, monto, fechaTransaccion, metodoPago]
            );

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
        } catch (err) {
            if (err instanceof Error) {
                res.status(500).json({ message: 'Error en la simulación de transferencia con PayPal', error: err.message });
            } else {
                res.status(500).json({ message: 'Error desconocido en la simulación de transferencia con PayPal' });
            }
        }
    }
    
    public async getTarjetasByUsuario(req: Request, res: Response): Promise<void> {
        const { IdUsuario } = req.params;
        const tarjetas = await pool.query('SELECT * FROM Tarjeta WHERE IdUsuario = ?', [IdUsuario]);
        res.json(tarjetas);
    }

    public async eliminarTarjeta(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        await pool.query('DELETE FROM Tarjeta WHERE IdTarjeta = ?', [id]);
        res.json({ message: 'Tarjeta eliminada exitosamente' });
    }
    
}

const tarjetaController = new TarjetaController();
export default tarjetaController;
