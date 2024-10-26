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
exports.ingresoController = void 0;
const database_1 = __importDefault(require("../database"));
class IngresoController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idUser } = req.params;
            try {
                const usuario = yield database_1.default.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [idUser]);
                if (usuario.length === 0) {
                    res.status(404).json({ error: 'Usuario no encontrado' });
                    return;
                }
                const { Rol, CodigoAdmin } = usuario[0];
                let query;
                let params;
                if (Rol === 'admin') {
                    query = `
          SELECT I.*, CONCAT(U.Nombre, ' ', U.ApPaterno, ' ', U.ApMaterno) AS NombreCompleto
          FROM Ingreso I 
          INNER JOIN Usuario U ON I.IdUsuario = U.IdUsuario 
          WHERE U.CodigoAdmin = ?
        `;
                    params = [CodigoAdmin];
                }
                else {
                    query = `
          SELECT I.*, CONCAT(U.Nombre, ' ', U.ApPaterno, ' ', U.ApMaterno) AS NombreCompleto
          FROM Ingreso I 
          INNER JOIN Usuario U ON I.IdUsuario = U.IdUsuario 
          WHERE I.IdUsuario = ?
        `;
                    params = [idUser];
                }
                const ingresos = yield database_1.default.query(query, params);
                res.json({ ingresos });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al obtener los ingresos' });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idUser } = req.params;
            const ingreso = req.body;
            ingreso.IdUsuario = idUser;
            try {
                yield database_1.default.query('INSERT INTO Ingreso SET ?', [ingreso]);
                res.json({ message: 'Ingreso guardado' });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al crear el ingreso' });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, idUser } = req.params;
            try {
                const usuario = yield database_1.default.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [idUser]);
                if (usuario.length === 0) {
                    res.status(404).json({ error: 'Usuario no encontrado' });
                    return;
                }
                const { Rol, CodigoAdmin } = usuario[0];
                let result;
                if (Rol === 'admin') {
                    result = yield database_1.default.query('DELETE FROM Ingreso WHERE IdIngreso = ? AND EXISTS (SELECT 1 FROM Usuario WHERE IdUsuario = Ingreso.IdUsuario AND CodigoAdmin = ?)', [id, CodigoAdmin]);
                }
                else {
                    result = yield database_1.default.query('DELETE FROM Ingreso WHERE IdIngreso = ? AND IdUsuario = ?', [id, idUser]);
                }
                if (result.affectedRows > 0) {
                    res.json({ message: 'Ingreso eliminado' });
                }
                else {
                    res.status(404).json({ error: 'Ingreso no encontrado o el usuario no coincide' });
                }
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al eliminar el ingreso' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, idUser } = req.params;
            const ingreso = req.body;
            try {
                const usuario = yield database_1.default.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [idUser]);
                if (usuario.length === 0) {
                    res.status(404).json({ error: 'Usuario no encontrado' });
                    return;
                }
                const { Rol, CodigoAdmin } = usuario[0];
                let result;
                if (Rol === 'admin') {
                    result = yield database_1.default.query('UPDATE Ingreso SET ? WHERE IdIngreso = ? AND EXISTS (SELECT 1 FROM Usuario WHERE IdUsuario = Ingreso.IdUsuario AND CodigoAdmin = ?)', [ingreso, id, CodigoAdmin]);
                }
                else {
                    result = yield database_1.default.query('UPDATE Ingreso SET ? WHERE IdIngreso = ? AND IdUsuario = ?', [ingreso, id, idUser]);
                }
                if (result.affectedRows > 0) {
                    res.json({ message: 'Ingreso actualizado' });
                }
                else {
                    res.status(404).json({ error: 'Ingreso no encontrado o el usuario no coincide' });
                }
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al actualizar el ingreso' });
            }
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, idUser } = req.params;
            try {
                const usuario = yield database_1.default.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [idUser]);
                if (usuario.length === 0) {
                    res.status(404).json({ error: 'Usuario no encontrado' });
                    return;
                }
                const { Rol, CodigoAdmin } = usuario[0];
                let query;
                let params;
                if (Rol === 'admin') {
                    query = `
          SELECT * FROM Ingreso WHERE IdIngreso = ? AND EXISTS (
            SELECT 1 FROM Usuario WHERE IdUsuario = Ingreso.IdUsuario AND CodigoAdmin = ?
          )
        `;
                    params = [id, CodigoAdmin];
                }
                else {
                    query = 'SELECT * FROM Ingreso WHERE IdIngreso = ? AND IdUsuario = ?';
                    params = [id, idUser];
                }
                const ingreso = yield database_1.default.query(query, params);
                if (ingreso.length > 0) {
                    ingreso[0].FechaIngreso = ingreso[0].FechaIngreso.toISOString().split('T')[0];
                    res.json(ingreso[0]);
                }
                else {
                    res.status(404).json({ text: 'El ingreso no existe o no tiene acceso' });
                }
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al obtener el ingreso' });
            }
        });
    }
}
exports.ingresoController = new IngresoController();
exports.default = exports.ingresoController;
