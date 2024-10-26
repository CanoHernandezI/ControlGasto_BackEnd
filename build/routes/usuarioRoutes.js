"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioController_1 = __importDefault(require("../controllers/usuarioController"));
class UsuarioRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', usuarioController_1.default.list);
        this.router.post('/', usuarioController_1.default.create);
        this.router.delete('/:idUser', usuarioController_1.default.delete);
        this.router.put('/:idUser', usuarioController_1.default.update);
        this.router.get('/:identifier', usuarioController_1.default.getUserOrCheckUsername);
    }
}
const usuarioRoutes = new UsuarioRoutes();
exports.default = usuarioRoutes.router;
