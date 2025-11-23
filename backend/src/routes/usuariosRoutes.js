import express from "express";
import { cadastrarUsuario, loginUsuario, meuPerfil } from "../controllers/usuariosController.js";
import { protegerRota } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Rota para cadastrar novo usuário.
 *
 * @route POST /cadastroUsuario
 */

router.post("/cadastroUsuario", cadastrarUsuario);

/**
 * Rota para autenticar usuário e gerar token JWT.
 *
 * @route POST /login
 */

router.post("/login", loginUsuario);

/**
 * Rota para retornar dados do perfil do usuário autenticado.
 *
 * @route GET /meuPerfil
 * @middleware protegerRota
 */

router.get("/meuPerfil", protegerRota, meuPerfil);

export default router;
