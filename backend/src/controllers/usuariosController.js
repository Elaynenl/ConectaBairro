import Usuario from "../models/Usuario.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/**
 * Gera um token JWT para autenticação do usuário.
 *
 * @function gerarToken
 * @param {string} id - ID do usuário.
 * @returns {string} Token JWT válido por 1 dia.
 */
const gerarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

/**
 * Controlador para cadastrar um novo usuário.
 *
 * @async
 * @function cadastrarUsuario
 * @param {Object} req - Objeto da requisição Express.
 * @param {Object} res - Objeto da resposta Express.
 * @returns {Promise<void>} Retorna dados do usuário criado e token JWT.
 */
export const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body;

    try {
        const existeUsuario = await Usuario.findOne({ email });
        if (existeUsuario) {
            return res.status(400).json({ erro: "Usuário já cadastrado" });
        }

        const usuario = await Usuario.create({ nome, email, senha });
        res.status(201).json({
            mensagem: "Usuário cadastrado com sucesso",
            _id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            token: gerarToken(usuario.id)
        });
    } catch (error) {
        console.error("Erro ao cadastrar usuário:", error);
        res.status(500).json({ erro: error.message });
    }
};

/**
 * Controlador para autenticar usuário e gerar token JWT.
 *
 * @async
 * @function loginUsuario
 * @param {Object} req - Objeto da requisição Express.
 * @param {Object} res - Objeto da resposta Express.
 * @returns {Promise<void>} Retorna dados do usuário autenticado e token JWT.
 */
export const loginUsuario = async (req, res) => {
    const { email, senha } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        if (usuario && (await bcrypt.compare(senha, usuario.senha))) {
            res.json({
                _id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                token: gerarToken(usuario.id)
            });
        } else {
            res.status(400).json({ erro: "Credenciais inválidas" });
        }
    } catch (error) {
        res.status(500).json({ erro: error.message });
    }
};

/**
 * Controlador para retornar dados do perfil do usuário autenticado.
 *
 * @async
 * @function meuPerfil
 * @param {Object} req - Objeto da requisição Express (contém usuário autenticado).
 * @param {Object} res - Objeto da resposta Express.
 * @returns {Promise<void>} Retorna dados básicos do usuário autenticado.
 */
export const meuPerfil = async (req, res) => {
  try {
    const usuario = req.usuario;
    res.json({
      _id: usuario._id,
      nome: usuario.nome,
      email: usuario.email
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar perfil do usuário" });
  }
};
