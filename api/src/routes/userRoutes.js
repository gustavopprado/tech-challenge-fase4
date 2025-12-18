import express from "express";
import UserController from "../controllers/userController.js";

const routes = express.Router();

routes.get("/usuarios", UserController.listarUsuarios);
routes.put("/usuarios/:id/cargo", UserController.alterarCargo);

export default routes;