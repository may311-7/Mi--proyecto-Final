import mongoose from "mongoose";

const mensajeSchema = new mongoose.Schema({
  nombre: String,
  correo: String,
  mensaje: String,
  fecha: { type: Date, default: Date.now }
});

export default mongoose.model("Mensaje", mensajeSchema);
