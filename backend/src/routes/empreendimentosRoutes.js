import express from "express";
import {
    listarEmpreendimentos,
    listarEmpreendimentoPorId,
    listarMeusEmpreendimentos,
    cadastrarEmpreendimento,
    editarEmpreendimento,
    deletarEmpreendimento
} from "../controllers/empreendimentosController.js";
import { protegerRota } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * Rota para listar empreendimentos com filtros.
 *
 * @route GET /
 */
router.get("/", listarEmpreendimentos);

/**
 * Rota para listar empreendimentos do usuário autenticado.
 *
 * @route GET /meusEmpreendimentos
 * @middleware protegerRota
 */
router.get("/meusEmpreendimentos", protegerRota, listarMeusEmpreendimentos);

/**
 * Rota para listar empreendimento específico por ID.
 *
 * @route GET /:id
 * @middleware protegerRota
 */
router.get("/:id", protegerRota, listarEmpreendimentoPorId);

/**
 * Rota para cadastrar novo empreendimento.
 *
 * @route POST /
 * @middleware protegerRota
 */
router.post("/", protegerRota, cadastrarEmpreendimento);

/**
 * Rota para editar empreendimento existente.
 *
 * @route PUT /:id
 * @middleware protegerRota
 */
router.put("/:id", protegerRota, editarEmpreendimento);

/**
 * Rota para deletar empreendimento existente.
 *
 * @route DELETE /:id
 * @middleware protegerRota
 */
router.delete("/:id", protegerRota, deletarEmpreendimento);

export default router;
