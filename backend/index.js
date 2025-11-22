import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Mensaje from "./models/Mensaje.js";
import Juego from "./models/Juego.js";
import Resena from "./models/Resena.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let isDbConnected = false;
const inMemoryMensajes = [];

// in-memory fallbacks
const inMemoryJuegos = [];
const inMemoryResenas = [];

// Conexión a MongoDB si existe MONGO_URI, si no usamos almacenamiento en memoria
if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("🍃 Conectado a MongoDB");
      isDbConnected = true;
    })
    .catch((err) => console.error("❌ Error conectando a MongoDB:", err));
} else {
  console.log("⚠️  MONGO_URI no definido — usando almacenamiento en memoria para mensajes (temporal)");
}

// Ruta para guardar mensajes
app.post("/api/contacto", async (req, res) => {
  try {
    if (isDbConnected) {
      const nuevoMsg = new Mensaje(req.body);
      await nuevoMsg.save();
      return res.status(200).json({ ok: true, msg: "Mensaje guardado correctamente" });
    }

    // Fallback en memoria
    const obj = { ...req.body, fecha: new Date().toISOString(), _id: `${Date.now()}` };
    inMemoryMensajes.push(obj);
    return res.status(200).json({ ok: true, msg: "Mensaje guardado en memoria (sin Mongo)" });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Error guardando", error });
  }
});

// Ruta para ver todos los mensajes (opcional)
app.get("/api/contacto", async (req, res) => {
  if (isDbConnected) {
    const mensajes = await Mensaje.find();
    return res.json(mensajes);
  }

  return res.json(inMemoryMensajes);
});

// Ruta para actualizar (autosave / editar)
app.patch("/api/contacto/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (isDbConnected) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ ok: false, msg: "ID inválido" });
      }
      const updated = await Mensaje.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updated) return res.status(404).json({ ok: false, msg: "Mensaje no encontrado" });
      return res.json({ ok: true, msg: "Mensaje actualizado", data: updated });
    }

    // Fallback en memoria
    const idx = inMemoryMensajes.findIndex((m) => m._id === id);
    if (idx === -1) return res.status(404).json({ ok: false, msg: "Mensaje no encontrado (memoria)" });
    inMemoryMensajes[idx] = { ...inMemoryMensajes[idx], ...req.body, updatedAt: new Date().toISOString() };
    return res.json({ ok: true, msg: "Mensaje actualizado (memoria)", data: inMemoryMensajes[idx] });
  } catch (error) {
    if (error.name === "ValidationError") {
      const details = formatMongooseError(error);
      return res.status(400).json({ ok: false, msg: "Errores de validación", errors: details });
    }
    res.status(500).json({ ok: false, msg: "Error actualizando mensaje", error: error.message });
  }
});

/* JUEGOS */
// listar y crear
app.get("/api/juegos", async (req, res) => {
  try {
    if (isDbConnected) {
      const docs = await Juego.find().sort({ createdAt: -1 });
      return res.json(docs);
    }
    return res.json(inMemoryJuegos);
  } catch (err) {
    return res.status(500).json({ ok: false, msg: "Error obteniendo juegos", error: err.message });
  }
});

app.post("/api/juegos", async (req, res) => {
  try {
    if (isDbConnected) {
      const doc = await Juego.create(req.body);
      return res.status(201).json({ ok: true, data: doc });
    }
    const obj = { ...req.body, _id: `${Date.now()}`, createdAt: new Date().toISOString() };
    inMemoryJuegos.push(obj);
    return res.status(201).json({ ok: true, data: obj });
  } catch (err) {
    return res.status(400).json({ ok: false, msg: "Error creando juego", error: err.message });
  }
});

/* RESEÑAS */
// listar y crear
app.get("/api/resenas", async (req, res) => {
  try {
    if (isDbConnected) {
      const docs = await Resena.find().sort({ createdAt: -1 });
      return res.json(docs);
    }
    return res.json(inMemoryResenas);
  } catch (err) {
    return res.status(500).json({ ok: false, msg: "Error obteniendo reseñas", error: err.message });
  }
});

app.post("/api/resenas", async (req, res) => {
  try {
    if (isDbConnected) {
      const doc = await Resena.create(req.body);
      return res.status(201).json({ ok: true, data: doc });
    }
    const obj = { ...req.body, _id: `${Date.now()}`, createdAt: new Date().toISOString() };
    inMemoryResenas.push(obj);
    return res.status(201).json({ ok: true, data: obj });
  } catch (err) {
    return res.status(400).json({ ok: false, msg: "Error creando reseña", error: err.message });
  }
});

// Inicio del servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
