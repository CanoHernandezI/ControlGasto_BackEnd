"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tarjetaController_1 = __importDefault(require("../controllers/tarjetaController"));
class TarjetaRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', tarjetaController_1.default.getAllTarjetas); // Obtener todas las tarjetas
        this.router.post('/agregar', tarjetaController_1.default.addTarjeta); // Agregar nueva tarjeta
        this.router.post('/transferencia', tarjetaController_1.default.simularTransferencia); // Simular transferencia
        this.router.get('/usuario/:IdUsuario', tarjetaController_1.default.getTarjetasByUsuario); // Nueva ruta para obtener tarjetas por usuario
        this.router.delete('/eliminar/:id', tarjetaController_1.default.eliminarTarjeta);
    }
}
const tarjetaRoutes = new TarjetaRoutes();
exports.default = tarjetaRoutes.router;
