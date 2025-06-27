const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;
const bcrypt = require('bcrypt');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexión a SQLite
const db = new sqlite3.Database('./db/database.sqlite', (err) => {
  if (err) return console.error(err.message);
  console.log('Conectado a SQLite');
});

// Crear tabla si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    correo TEXT NOT NULL,
    clave TEXT,
    numero_telefono TEXT
  )
`);

// Ruta para guardar datos del formulario
app.post('/registrar', async (req, res) => {
  const { nombre, correo, clave, numero_telefono } = req.body;

  try {
    const hash = await bcrypt.hash(clave, 10); // 🔐 Encriptar la contraseña

    const query = `INSERT INTO usuarios (nombre, correo, clave, numero_telefono) VALUES (?, ?, ?, ?)`;
    db.run(query, [nombre, correo, hash, numero_telefono], function (err) {
      if (err) {
        console.error(err.message);
        return res.status(500).json({ mensaje: 'Error al guardar.' });
      }
      res.status(200).json({ mensaje: 'Registro guardado exitosamente.' });
    });

  } catch (error) {
    console.error('Error en bcrypt:', error);
    res.status(500).json({ mensaje: 'Error al encriptar la contraseña.' });
  }
});

// Ruta para consultar todos los registros
app.get('/usuarios', (req, res) => {
  db.all('SELECT * FROM usuarios', (err, rows) => {
    if (err) {
      console.error(err.message);
      return res.status(500).json({ mensaje: 'Error al obtener registros.' });
    }
    res.status(200).json(rows);
  });
});
// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
