"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const presupuestoController_1 = __importDefault(require("../controllers/presupuestoController"));
class PresupuestoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/:idUser', presupuestoController_1.default.list);
    }
}
const presupuestoRoutes = new PresupuestoRoutes();
exports.default = presupuestoRoutes.router;
