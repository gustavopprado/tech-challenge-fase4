import request from "supertest";
import express from "express";
import routes from "./authRoutes.js";

// Mock completo do controller
jest.mock("../controllers/authController.js", () => ({
  registrar: jest.fn((req, res) => res.status(201).json({ message: "registrar" })),
  login: jest.fn((req, res) => res.status(200).json({ message: "login" })),
}));

const app = express();
app.use(express.json());
app.use(routes);

describe("authRoutes", () => {
  it("POST /auth/registrar deve chamar registrar", async () => {
    const res = await request(app)
      .post("/auth/registrar")
      .send({ nome: "Pedro", email: "pedro@teste.com", senha: "1234", cargo: "aluno" });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe("registrar");
  });

  it("POST /auth/login deve chamar login", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "pedro@teste.com", senha: "1234" });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("login");
  });
});
