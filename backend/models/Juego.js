import mongoose from "mongoose";
const { Schema, model } = mongoose;

const juegoSchema = new Schema(
  {
    titulo: { type: String, required: true, trim: true },
    plataforma: { type: String, trim: true, default: "" },
    descripcion: { type: String, trim: true, default: "" },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default model("Juego", juegoSchema);