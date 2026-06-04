const db = require('../config/db');
exports.createVacante = async (req, res) => {
    try {
        const { reclutador_id, titulo, descripcion_puesto, modalidad, salario_ofrecido } = req.body;
        if (!reclutador_id || !titulo || !modalidad) return res.status(400).json({ error: 'Campos obligatorios faltantes' });
        const [result] = await db.query('INSERT INTO vacantes (reclutador_id, titulo, descripcion_puesto, modalidad, salario_ofrecido) VALUES (?, ?, ?, ?, ?)', [reclutador_id, titulo, descripcion_puesto, modalidad, salario_ofrecido]);
        res.status(201).json({ message: 'Vacante creada', id: result.insertId });
    } catch (error) { res.status(500).json({ error: error.message }); }
};
exports.getAllVacantes = async (req, res) => {
    try { const [rows] = await db.query('SELECT * FROM vacantes'); res.status(200).json(rows); }
    catch (error) { res.status(500).json({ error: error.message }); }
};
exports.getVacanteById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM vacantes WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Vacante no encontrada' });
        res.status(200).json(rows[0]);
    } catch (error) { res.status(500).json({ error: error.message }); }
};
exports.updateVacante = async (req, res) => {
    try {
        const { titulo, descripcion_puesto, modalidad, salario_ofrecido, estado } = req.body;
        const [result] = await db.query('UPDATE vacantes SET titulo = ?, descripcion_puesto = ?, modalidad = ?, salario_ofrecido = ?, estado = ? WHERE id = ?', [titulo, descripcion_puesto, modalidad, salario_ofrecido, estado, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'No encontrada' });
        res.status(200).json({ message: 'Vacante actualizada' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};
exports.deleteVacante = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM vacantes WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'No encontrada' });
        res.status(200).json({ message: 'Vacante eliminada' });
    } catch (error) { res.status(500).json({ error: 'Error de llave foránea', detalle: error.message }); }
};
