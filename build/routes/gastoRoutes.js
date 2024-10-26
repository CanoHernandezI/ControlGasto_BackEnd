"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const gastoController_1 = __importDefault(require("../controllers/gastoController"));
class GastoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/:idUser', gastoController_1.default.list);
        this.router.post('/:idUser', gastoController_1.default.create);
        this.router.delete('/:idUser/:id', gastoController_1.default.delete);
        this.router.put('/:idUser/:id', gastoController_1.default.update);
        this.router.get('/:idUser/:id', gastoController_1.default.getOne);
    }
}
const gastoRoutes = new GastoRoutes();
exports.default = gastoRoutes.router;
