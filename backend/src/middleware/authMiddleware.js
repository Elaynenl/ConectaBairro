import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

/**
 * Middleware para proteger rotas autenticadas.
 * 
 * Verifica se o token JWT está presente no header `Authorization`,
 * valida o token e adiciona o usuário correspondente ao objeto `req`.
 *
 * @async
 * @function protegerRota
 * @param {Object} req - Objeto da requisição Express.
 * @param {Object} res - Objeto da resposta Express.
 * @param {Function} next - Função para passar controle ao próximo middleware.
 * @returns {Promise<void>} Continua para a próxima função se o token for válido, 
 * ou retorna erro 401 se inválido ou ausente.
 */
export const protegerRota = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decodificado = jwt.verify(token, process.env.JWT_SECRET);

            req.usuario = await Usuario.findById(decodificado.id).select("-senha");

            next();
        } catch (error) {
            return res.status(401).json({ erro: "Token inválido" });
        }
    }

    if (!token) {
        return res.status(401).json({ erro: "Não autorizado, token não encontrado" });
    }
};
