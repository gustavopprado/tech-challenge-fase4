import express from "express";
import AuthController from "../controllers/authController.js";

const routes = express.Router();

routes.post("/auth/registrar", AuthController.registrar);
routes.post("/auth/login", AuthController.login);

export default routes;