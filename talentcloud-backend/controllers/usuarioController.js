const db = require('../config/db');
exports.createUsuario = async (req, res) => {
    try {
        const { nombre, email, password_hash, rol, empresa_id } = req.body;
        if (!nombre || !email || !password_hash || !rol) return res.status(400).json({ error: 'Faltan campos' });
        const [result] = await db.query('INSERT INTO usuarios (nombre, email, password_hash, rol, empresa_id) VALUES (?, ?, ?, ?, ?)', [nombre, email, password_hash, rol, empresa_id || null]);
        res.status(201).json({ message: 'Usuario creado', id: result.insertId });
    } catch (error) { res.status(500).json({ error: error.message }); }
};
exports.getAllUsuarios = async (req, res) => {
    try { const [rows] = await db.query('SELECT id, nombre, email, rol, empresa_id, creado_en FROM usuarios'); res.status(200).json(rows); }
    catch (error) { res.status(500).json({ error: error.message }); }
};
exports.getUsuarioById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, nombre, email, rol, empresa_id, creado_en FROM usuarios WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.status(200).json(rows[0]);
    } catch (error) { res.status(500).json({ error: error.message }); }
};
exports.updateUsuario = async (req, res) => {
    try {
        const { nombre, email, rol, empresa_id } = req.body;
        const [result] = await db.query('UPDATE usuarios SET nombre = ?, email = ?, rol = ?, empresa_id = ? WHERE id = ?', [nombre, email, rol, empresa_id || null, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'No encontrado' });
        res.status(200).json({ message: 'Usuario actualizado' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};
exports.deleteUsuario = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'No encontrado' });
        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};
