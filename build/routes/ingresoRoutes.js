"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ingresoController_1 = __importDefault(require("../controllers/ingresoController"));
class IngresoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/:idUser', ingresoController_1.default.list);
        this.router.post('/:idUser', ingresoController_1.default.create);
        this.router.delete('/:idUser/:id', ingresoController_1.default.delete);
        this.router.put('/:idUser/:id', ingresoController_1.default.update);
        this.router.get('/:idUser/:id', ingresoController_1.default.getOne);
    }
}
const ingresoRoutes = new IngresoRoutes();
exports.default = ingresoRoutes.router;
