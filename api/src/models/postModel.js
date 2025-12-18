import mongoose from "mongoose";

// Subdocumento de comentários
const comentarioSchema = new mongoose.Schema(
  {
    usuario: { type: String, required: true },
    texto: { type: String, required: true },
    data: { type: Date, default: Date.now },
  },
  { _id: true } // <-- IMPORTANTE: garante que cada comentário tenha um _id único do Mongoose
);

const postSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descricao: { type: String, required: true },
    autor: { type: String, required: true },
    postAtivo: { type: Boolean, default: true },
    comentarios: { type: [comentarioSchema], default: [] },
  },
  {
    versionKey: false,
    timestamps: { createdAt: "dataCriacao", updatedAt: "dataAtualizacao" },
  }
);

const post = mongoose.model("posts", postSchema);
export { post, postSchema };
