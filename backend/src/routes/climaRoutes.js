import express from "express";
import { buscarClima } from "../controllers/climaController.js";

const router = express.Router();

/**
 * Rota para buscar informações de clima de uma cidade.
 *
 * @route GET /clima
 * @query {string} cidade - Nome da cidade a ser consultada.
 * @returns {Object} Dados de clima (temperatura, descrição, umidade, vento).
 */
router.get("/clima", buscarClima);

export default router;
