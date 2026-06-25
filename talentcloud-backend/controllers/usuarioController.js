const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUsuario = async (req, res) => {
    try {
        const { nombre, email, password_hash, rol, empresa_id } = req.body;
        if (!nombre || !email || !password_hash || !rol) return res.status(400).json({ error: 'Faltan campos' });
        
        const salt = await bcrypt.genSalt(10);
        const hashedPw = await bcrypt.hash(password_hash, salt);

        const [result] = await db.query('INSERT INTO usuarios (nombre, email, password_hash, rol, empresa_id) VALUES (?, ?, ?, ?, ?)', [nombre, email, hashedPw, rol, empresa_id || null]);
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

exports.loginUsuario = async (req, res) => {
    try {
        // En el request de login esperamos "email" y "password"
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ error: 'Faltan credenciales' });

        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length === 0) return res.status(401).json({ message: 'Credenciales inválidas' });

        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) return res.status(401).json({ message: 'Credenciales inválidas' });

        const token = jwt.sign(
            { id: user.id, rol: user.rol, empresa_id: user.empresa_id },
            process.env.JWT_SECRET,
            { expiresIn: '12h' }
        );

        res.status(200).json({ message: 'Login exitoso', token, user: { id: user.id, nombre: user.nombre, rol: user.rol } });
    } catch (error) { res.status(500).json({ error: error.message }); }
};
