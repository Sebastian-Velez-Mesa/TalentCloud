require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const empresaCtrl = require('./controllers/empresaController');
const usuarioCtrl = require('./controllers/usuarioController');
const vacanteCtrl = require('./controllers/vacanteController');

app.post('/api/empresas', empresaCtrl.createEmpresa);
app.get('/api/empresas', empresaCtrl.getAllEmpresas);
app.get('/api/empresas/:id', empresaCtrl.getEmpresaById);
app.put('/api/empresas/:id', empresaCtrl.updateEmpresa);
app.delete('/api/empresas/:id', empresaCtrl.deleteEmpresa);

app.post('/api/usuarios', usuarioCtrl.createUsuario);
app.post('/api/auth/login', usuarioCtrl.loginUsuario);
app.get('/api/usuarios', usuarioCtrl.getAllUsuarios);
app.get('/api/usuarios/:id', usuarioCtrl.getUsuarioById);
app.put('/api/usuarios/:id', usuarioCtrl.updateUsuario);
app.delete('/api/usuarios/:id', usuarioCtrl.deleteUsuario);

app.post('/api/vacantes', vacanteCtrl.createVacante);
app.get('/api/vacantes', vacanteCtrl.getAllVacantes);
app.get('/api/vacantes/:id', vacanteCtrl.getVacanteById);
app.put('/api/vacantes/:id', vacanteCtrl.updateVacante);
app.delete('/api/vacantes/:id', vacanteCtrl.deleteVacante);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Online', proyecto: 'TalentCloud API REST', version: '1.1' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
