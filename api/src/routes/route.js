import express from "express";
import posts from "./postRoutes.js";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";

const routes = (app) => {
    app.route("/").get((req,res)=> res.status(200).send("API ONLINE"))

    app.use(express.json()); 
    
    // Rotas sem prefixo /api (conforme sua configuração atual)
    app.use(posts);
    app.use(authRoutes);
    app.use(userRoutes);
};

export default routes;