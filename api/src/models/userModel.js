import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    senha: { type: String, required: true },
    cargo: {
      type: String,
      enum: ["aluno", "professor", "admin"],
      default: "aluno",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Usuario", userSchema);
