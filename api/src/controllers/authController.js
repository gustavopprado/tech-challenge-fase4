import Usuario from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  static async registrar(req, res, next) {
    /**
     * @swagger
     * /auth/registrar:
     *   post:
     *     summary: Registrar novo usuário
     *     tags:
     *       - Autenticação
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               nome:
     *                 type: string
     *               email:
     *                 type: string
     *               senha:
     *                 type: string
     *     responses:
     *       201:
     *         description: Usuário criado com sucesso
     *       400:
     *         description: Campos obrigatórios ausentes ou e-mail já cadastrado
     *       500:
     *         description: Erro interno do servidor
     */
    try {
      const { nome, email, senha } = req.body;

      if (!nome || !email || !senha) {
        return res
          .status(400)
          .json({ mensagem: "Todos os campos são obrigatórios." });
      }

      const usuarioExistente = await Usuario.findOne({ email });
      if (usuarioExistente) {
        return res.status(400).json({ mensagem: "E-mail já cadastrado." });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const novoUsuario = await Usuario.create({
        nome,
        email,
        senha: senhaHash,
        cargo: "aluno",
      });

      res.status(201).json({
        mensagem: "Usuário criado com sucesso!",
        usuario: {
          id: novoUsuario._id,
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          cargo: novoUsuario.cargo,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, res, next) {
    /**
     * @swagger
     * /auth/login:
     *   post:
     *     summary: Realiza login do usuário
     *     tags:
     *       - Autenticação
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *               senha:
     *                 type: string
     *     responses:
     *       200:
     *         description: Login realizado com sucesso
     *       401:
     *         description: Credenciais inválidas
     *       500:
     *         description: Erro interno do servidor
     */
    try {
      const { email, senha } = req.body;

      const usuarioEncontrado = await Usuario.findOne({ email });
      if (!usuarioEncontrado) {
        return res.status(401).json({ mensagem: "Credenciais inválidas." });
      }

      const senhaValida = await bcrypt.compare(
        senha,
        usuarioEncontrado.senha
      );
      if (!senhaValida) {
        return res.status(401).json({ mensagem: "Credenciais inválidas." });
      }

      const cargoNormalizado = usuarioEncontrado.cargo
        ? usuarioEncontrado.cargo.toLowerCase()
        : "aluno";

      const token = jwt.sign(
        {
          id: usuarioEncontrado._id,
          email: usuarioEncontrado.email,
          cargo: cargoNormalizado,
        },
        process.env.JWT_SECRET || "segredo",
        { expiresIn: "1h" }
      );

      res.status(200).json({
        mensagem: "Login realizado com sucesso",
        token,
        nome: usuarioEncontrado.nome,
        cargo: cargoNormalizado,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
