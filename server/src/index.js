const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
let db;

async function connectToDatabase() {
  try {
    await client.connect();
    const db = client.db("organoidDB"); 
    return db;
  } catch (err) {
    console.error("Error conectando a MongoDB:", err);
  }
}

// Configuración de Multer para manejar la carga de archivos
const storage = multer.memoryStorage();  // Guardamos la imagen en memoria
const upload = multer({ storage: storage }); // Usamos multer con almacenamiento en memoria

// Endpoint para subir imágenes
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    console.log(file);
    if (!file) {
      return res.status(400).json({ message: 'No se ha subido un archivo' });
    }
    console.log(file);
    const { originalname, buffer } = file;
    const db = await connectToDatabase();
    const result = await db.collection('images').insertOne({
      name: originalname,  // El nombre del archivo
      image: buffer,       // Guardamos la imagen como un buffer
    });

    res.status(201).json({
      message: 'Imagen subida con éxito',
      imageId: result.insertedId,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error subiendo la imagen', error: err.message });
  }
});

app.post('/uploadMask', upload.single('file'), async (req, res) => {
  try {
    const { file } = req;
    console.log(file);
    if (!file) {
      return res.status(400).json({ message: 'No se ha subido un archivo' });
    }
    const { originalname, buffer } = file;
    const db = await connectToDatabase();
    const result = await db.collection('masks').insertOne({
      name: originalname,  
      image: buffer,       
    });

    res.status(201).json({
      message: 'Imagen subida con éxito',
      imageId: result.insertedId,
    });
  } catch (err) {
    res.status(500).json({ message: 'Error subiendo la imagen', error: err.message });
  }
});

// Endpoint para obtener las imágenes desde MongoDB
app.get('/images', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const images = await db.collection('images').find({}).toArray();
    res.status(200).json(images);
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo las imágenes', error: err.message });
  }
});

// Endpoint para obtener una imagen específica
app.get('/images/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const image = await db.collection('images').findOne({ _id: new ObjectId(id) });

    if (!image) {
      return res.status(404).json({ message: 'Imagen no encontrada' });
    }

    // Enviar la imagen como un archivo binario
    res.set('Content-Type', 'image/png');  // Ajusta el tipo de imagen según sea necesario
    res.send(image.image);  // Enviar el buffer de la imagen como respuesta
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo la imagen', error: err.message });
  }
});

app.get('/api/masks', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const masks = await db.collection('masks').find({}).toArray();
    res.status(200).json(masks);
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo las máscaras', error: err.message });
  }
});

app.get('/api/masks/:id', async (req, res) => {
  try {
    const db = await connectToDatabase();
    const mask = await db.collection('masks').findOne({ _id: new ObjectId(req.params.id) });
    if (!mask) {
      return res.status(404).json({ message: 'Máscara no encontrada' });
    }
    res.status(200).json(mask);
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo la máscara', error: err.message });
  }
});

app.get('/metrics/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const metrics = {
      area: Math.floor(Math.random() * 5000) + 1000,
      contrast: Math.random().toFixed(2), 
      brightness: Math.random().toFixed(2) 
    };

    res.status(200).json(metrics);
  } catch (err) {
    res.status(500).json({ message: 'Error calculando métricas', error: err.message });
  }
});


app.get('/', (req, res) => {
  res.send('API para visualización de organoides');
  
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

