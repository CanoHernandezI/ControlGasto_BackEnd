"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ubicacionController_1 = require("../controllers/ubicacionController");
class UbicacionRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        // Ruta para iniciar una nueva ruta
        this.router.post('/iniciar-ruta', ubicacionController_1.ubicacionController.iniciarRuta);
        // Ruta para guardar una ubicación
        this.router.post('/guardar', ubicacionController_1.ubicacionController.guardarUbicacion);
        // Ruta para actualizar la hora de salida de una ubicación
        this.router.put('/actualizar-salida', ubicacionController_1.ubicacionController.actualizarHoraSalida);
        // Ruta para finalizar una ruta
        this.router.put('/finalizar-ruta', ubicacionController_1.ubicacionController.finalizarRuta);
        // Ruta para obtener todas las rutas de un usuario
        this.router.get('/rutas/:idUsuario', ubicacionController_1.ubicacionController.obtenerRutas);
    }
}
const ubicacionRoutes = new UbicacionRoutes();
exports.default = ubicacionRoutes.router;
