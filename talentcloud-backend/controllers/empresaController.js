const db = require('../config/db');
exports.createEmpresa = async (req, res) => {
    try {
        const { nit, nombre_empresa, sitio_web, sector_industrial } = req.body;
        if (!nit || !nombre_empresa) return res.status(400).json({ error: 'NIT y nombre son obligatorios.' });
        const [result] = await db.query('INSERT INTO empresas (nit, nombre_empresa, sitio_web, sector_industrial) VALUES (?, ?, ?, ?)', [nit, nombre_empresa, sitio_web, sector_industrial]);
        res.status(201).json({ message: 'Empresa creada', id: result.insertId });
    } catch (error) { res.status(500).json({ error: error.message }); }
};
exports.getAllEmpresas = async (req, res) => {
    try { const [rows] = await db.query('SELECT * FROM empresas'); res.status(200).json(rows); }
    catch (error) { res.status(500).json({ error: error.message }); }
};
exports.getEmpresaById = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM empresas WHERE id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Empresa no encontrada' });
        res.status(200).json(rows[0]);
    } catch (error) { res.status(500).json({ error: error.message }); }
};
exports.updateEmpresa = async (req, res) => {
    try {
        const { nit, nombre_empresa, sitio_web, sector_industrial } = req.body;
        const [result] = await db.query('UPDATE empresas SET nit = ?, nombre_empresa = ?, sitio_web = ?, sector_industrial = ? WHERE id = ?', [nit, nombre_empresa, sitio_web, sector_industrial, req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'No encontrada' });
        res.status(200).json({ message: 'Empresa actualizada' });
    } catch (error) { res.status(500).json({ error: error.message }); }
};
exports.deleteEmpresa = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM empresas WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'No encontrada' });
        res.status(200).json({ message: 'Empresa eliminada' });
    } catch (error) { res.status(500).json({ error: 'Error de integridad referencial', detalle: error.message }); }
};
