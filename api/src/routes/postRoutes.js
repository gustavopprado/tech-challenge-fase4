import express from  "express";
import postController from "../controllers/postController.js";

const routes = express.Router();

routes.get("/posts", postController.listarPosts); //Lista de posts ativos
routes.get("/posts/professor", postController.listarPostsProfessor); //Lista de posts para professor
routes.get("/posts/busca", postController.listarPostPorFiltro); //Lista de post por query string
routes.get("/posts/:id", postController.listarPostPorId); //Lista de post por ID
routes.post("/posts",postController.cadastrarPost);//Criação de postagem
routes.put("/posts/:id",postController.atualizarPost);//Edição de postagem
routes.delete("/posts/:id",postController.excluirPost);//Exclusão de postagem
routes.get("/posts/:id/comentarios", postController.listarComentarios);//Lista de comentários de um post
routes.post("/posts/:id/comentarios", postController.adicionarComentario);//Adiciona comentário a um post
routes.put("/posts/:postId/comentarios/:comentarioId", postController.editarComentario);//Edita comentário de um post
routes.delete("/posts/:postId/comentarios/:comentarioId", postController.excluirComentario);//Exclui comentário de um post


export default routes;