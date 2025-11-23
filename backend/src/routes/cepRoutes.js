import express from "express";
import { buscarEmpreendimentosPorCep } from "../controllers/cepController.js";

const router = express.Router();

/**
 * Rota para buscar empreendimentos por CEP.
 *
 * @route GET /:cep
 * @param {string} cep - CEP informado na URL.
 * @returns {Object[]} Lista de empreendimentos associados ao CEP.
 */
router.get("/:cep", buscarEmpreendimentosPorCep);

export default router;
