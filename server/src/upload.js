// src/upload.js
const multer = require('multer');
const path = require('path');

// Configuración de multer para almacenar los archivos en la carpeta 'uploads'
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');  // La carpeta donde se almacenarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));  // Nombre único basado en el timestamp
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
