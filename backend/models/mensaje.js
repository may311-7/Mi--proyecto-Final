import mongoose from "mongoose";

const { Schema, model } = mongoose;

const mensajeSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
      maxlength: [100, "Nombre demasiado largo"],
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Email inválido"],
    },
    texto: {
      type: String,
      required: [true, "El mensaje es obligatorio"],
      trim: true,
      maxlength: [1000, "Mensaje demasiado largo"],
    },
    telefono: {
      type: String,
      trim: true,
      maxlength: [30, "Teléfono demasiado largo"],
      default: "",
    },
  },
  { timestamps: true }
);

export default model("Mensaje", mensajeSchema);
