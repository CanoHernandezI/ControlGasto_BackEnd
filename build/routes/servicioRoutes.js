"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const servicioController_1 = require("./../controllers/servicioController");
const express_1 = require("express");
class ServicioRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/:idUser', servicioController_1.servicioController.list);
        this.router.post('/:idUser', servicioController_1.servicioController.create);
        this.router.delete('/:idUser/:id', servicioController_1.servicioController.delete);
        this.router.put('/:idUser/:id', servicioController_1.servicioController.update);
        this.router.get('/:idUser/:id', servicioController_1.servicioController.getOne);
    }
}
const servicioRoutes = new ServicioRoutes();
exports.default = servicioRoutes.router;
