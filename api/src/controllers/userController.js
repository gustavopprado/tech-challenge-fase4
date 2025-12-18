import Usuario from "../models/userModel.js";

class UserController {
  // Lista todos os usuários (menos a senha)
  /**
   * @swagger
   * /usuarios:
   *   get:
   *     summary: Lista todos os usuários (exceto senha)
   *     tags:
   *       - Usuários
   *     responses:
   *       200:
   *         description: Lista de usuários retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Usuario'
   *       500:
   *         description: Erro interno do servidor
   */
  static async listarUsuarios(req, res, next) {
    try {
      const lista = await Usuario.find().select("-senha");
      res.status(200).json(lista);
    } catch (error) {
      next(error);
    }
  }

  // Altera o cargo de um usuário
  /**
   * @swagger
   * /usuarios/{id}/cargo:
   *   patch:
   *     summary: Altera o cargo de um usuário
   *     tags:
   *       - Usuários
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do usuário
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               novoCargo:
   *                 type: string
   *                 enum: [professor, aluno, admin]
   *                 description: Novo cargo do usuário
   *     responses:
   *       200:
   *         description: Cargo atualizado com sucesso
   *       400:
   *         description: Cargo inválido
   *       404:
   *         description: Usuário não encontrado
   *       500:
   *         description: Erro interno do servidor
   */
  static async alterarCargo(req, res, next) {
    try {
      const { id } = req.params;
      const { novoCargo } = req.body;

      // Validação simples
      if (!["professor", "aluno", "admin"].includes(novoCargo)) {
        return res.status(400).json({ message: "Cargo inválido." });
      }

      const usuarioAtualizado = await Usuario.findByIdAndUpdate(
        id,
        { cargo: novoCargo },
        { new: true, runValidators: true }
      ).select("-senha");

      if (!usuarioAtualizado) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      res
        .status(200)
        .json({ message: "Cargo atualizado!", usuario: usuarioAtualizado });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
