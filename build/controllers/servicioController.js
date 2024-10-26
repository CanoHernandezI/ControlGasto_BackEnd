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
exports.servicioController = void 0;
const database_1 = __importDefault(require("../database"));
class ServicioController {
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
          SELECT S.*, CONCAT(U.Nombre, ' ', U.ApPaterno, ' ', U.ApMaterno) AS NombreCompleto
          FROM Servicio S
          INNER JOIN Usuario U ON S.IdUsuario = U.IdUsuario
          WHERE U.CodigoAdmin = ?
        `;
                    params = [CodigoAdmin];
                }
                else {
                    query = `
          SELECT S.*, CONCAT(U.Nombre, ' ', U.ApPaterno, ' ', U.ApMaterno) AS NombreCompleto
          FROM Servicio S
          INNER JOIN Usuario U ON S.IdUsuario = U.IdUsuario
          WHERE S.IdUsuario = ?
        `;
                    params = [idUser];
                }
                const servicios = yield database_1.default.query(query, params);
                res.json({ servicios });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al obtener los servicios' });
            }
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { idUser } = req.params;
            const servicio = req.body;
            servicio.IdUsuario = idUser;
            try {
                yield database_1.default.query('INSERT INTO Servicio SET ?', [servicio]);
                res.json({ message: 'Servicio guardado' });
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al crear el servicio' });
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
                    result = yield database_1.default.query('DELETE FROM Servicio WHERE IdServicio = ? AND EXISTS (SELECT 1 FROM Usuario WHERE IdUsuario = Servicio.IdUsuario AND CodigoAdmin = ?)', [id, CodigoAdmin]);
                }
                else {
                    result = yield database_1.default.query('DELETE FROM Servicio WHERE IdServicio = ? AND IdUsuario = ?', [id, idUser]);
                }
                if (result.affectedRows > 0) {
                    res.json({ message: 'Servicio eliminado' });
                }
                else {
                    res.status(404).json({ error: 'Servicio no encontrado o el usuario no coincide' });
                }
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al eliminar el servicio' });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, idUser } = req.params;
            const servicio = req.body;
            try {
                const usuario = yield database_1.default.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [idUser]);
                if (usuario.length === 0) {
                    res.status(404).json({ error: 'Usuario no encontrado' });
                    return;
                }
                const { Rol, CodigoAdmin } = usuario[0];
                let result;
                if (Rol === 'admin') {
                    result = yield database_1.default.query('UPDATE Servicio SET ? WHERE IdServicio = ? AND EXISTS (SELECT 1 FROM Usuario WHERE IdUsuario = Servicio.IdUsuario AND CodigoAdmin = ?)', [servicio, id, CodigoAdmin]);
                }
                else {
                    result = yield database_1.default.query('UPDATE Servicio SET ? WHERE IdServicio = ? AND IdUsuario = ?', [servicio, id, idUser]);
                }
                if (result.affectedRows > 0) {
                    res.json({ message: 'Servicio actualizado' });
                }
                else {
                    res.status(404).json({ error: 'Servicio no encontrado o el usuario no coincide' });
                }
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al actualizar el servicio' });
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
          SELECT * FROM Servicio WHERE IdServicio = ? AND EXISTS (
            SELECT 1 FROM Usuario WHERE IdUsuario = Servicio.IdUsuario AND CodigoAdmin = ?
          )
        `;
                    params = [id, CodigoAdmin];
                }
                else {
                    query = 'SELECT * FROM Servicio WHERE IdServicio = ? AND IdUsuario = ?';
                    params = [id, idUser];
                }
                const servicio = yield database_1.default.query(query, params);
                if (servicio.length > 0) {
                    servicio[0].FechaServicio = servicio[0].FechaServicio.toISOString().split('T')[0];
                    res.json(servicio[0]);
                }
                else {
                    res.status(404).json({ error: 'El servicio no existe o no tiene acceso' });
                }
            }
            catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Error al obtener el servicio' });
            }
        });
    }
}
exports.servicioController = new ServicioController();
exports.default = exports.servicioController;
