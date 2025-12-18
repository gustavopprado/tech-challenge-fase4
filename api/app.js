import express from "express";
import cors from "cors";
import swaggerDocs from "./swagger.js";
import conectaNaDatabase from "./src/config/dbConfig.js";
import routes from "./src/routes/route.js";
import { ensureAdminUser } from "./src/utils/ensureAdmin.js";

const app = express();
app.use(cors());

const conexao = await conectaNaDatabase();

conexao.on("error", (erro) => {
  console.error("Erro de conexão:", erro);
});

conexao.once("open", async () => {
  console.log("Conexão com o banco feita com sucesso");
  try {
    await ensureAdminUser();
  } catch (err) {
    console.error("Erro ao criar/garantir usuário admin:", err);
  }
});

app.use(express.json());

routes(app);
swaggerDocs(app);

export default app;
