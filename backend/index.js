import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import Mensaje from "./models/Mensaje.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("🍃 Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

// Ruta para guardar mensajes
app.post("/api/contacto", async (req, res) => {
  try {
    const nuevoMsg = new Mensaje(req.body);
    await nuevoMsg.save();
    res.status(200).json({ ok: true, msg: "Mensaje guardado correctamente" });
  } catch (error) {
    res.status(500).json({ ok: false, msg: "Error guardando", error });
  }
});

// Ruta para ver todos los mensajes (opcional)
app.get("/api/contacto", async (req, res) => {
  const mensajes = await Mensaje.find();
  res.json(mensajes);
});

// Inicio del servidor
app.listen(process.env.PORT, () =>
  console.log(`🚀 Servidor en http://localhost:${process.env.PORT}`)
);
