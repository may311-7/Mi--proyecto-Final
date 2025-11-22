import mongoose from "mongoose";
const { Schema, model, Types } = mongoose;

const resenaSchema = new Schema(
  {
    juego: { type: Types.ObjectId, ref: "Juego", required: false },
    usuario: { type: String, trim: true, default: "Anónimo" },
    rating: { type: Number, min: 1, max: 5, required: true },
    texto: { type: String, trim: true, default: "" },
    draft: { type: Boolean, default: false },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default model("Resena", resenaSchema);