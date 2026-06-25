require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const auth = require('./middleware/authMiddleware');

const empresaCtrl = require('./controllers/empresaController');
const usuarioCtrl = require('./controllers/usuarioController');
const vacanteCtrl = require('./controllers/vacanteController');

// Rutas Públicas (Registro y Login)
app.post('/api/empresas', empresaCtrl.createEmpresa);
app.post('/api/usuarios', usuarioCtrl.createUsuario);
app.post('/api/auth/login', usuarioCtrl.loginUsuario);

// Rutas Públicas (Lectura)
app.get('/api/vacantes', vacanteCtrl.getAllVacantes);
app.get('/api/vacantes/:id', vacanteCtrl.getVacanteById);

// Rutas Privadas (Requieren Token)
app.get('/api/empresas', auth, empresaCtrl.getAllEmpresas);
app.get('/api/empresas/:id', auth, empresaCtrl.getEmpresaById);
app.put('/api/empresas/:id', auth, empresaCtrl.updateEmpresa);
app.delete('/api/empresas/:id', auth, empresaCtrl.deleteEmpresa);

app.get('/api/usuarios', auth, usuarioCtrl.getAllUsuarios);
app.get('/api/usuarios/:id', auth, usuarioCtrl.getUsuarioById);
app.put('/api/usuarios/:id', auth, usuarioCtrl.updateUsuario);
app.delete('/api/usuarios/:id', auth, usuarioCtrl.deleteUsuario);

app.post('/api/vacantes', auth, vacanteCtrl.createVacante);
app.put('/api/vacantes/:id', auth, vacanteCtrl.updateVacante);
app.delete('/api/vacantes/:id', auth, vacanteCtrl.deleteVacante);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'Online', proyecto: 'TalentCloud API REST', version: '1.1' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
