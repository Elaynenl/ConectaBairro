import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import conectarBanco from "./config/db.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import empreendimentosRoutes from "./routes/empreendimentosRoutes.js";
import cepRoutes from "./routes/cepRoutes.js";
import climaRoutes from "./routes/climaRoutes.js";
import { frontendRoutes } from "./routes/frontendRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Conecta ao banco de dados, exceto quando em ambiente de testes.
 */
if (process.env.NODE_ENV !== "test") {
  conectarBanco();
}

/**
 * Rotas principais da aplicação.
 *
 * @route /usuarios - Rotas de usuários.
 * @route /empreendimentos - Rotas de empreendimentos.
 * @route /externo/cep - Rotas de consulta de CEP.
 * @route /api - Rotas de clima.
 * @route / - Rotas do frontend.
 */
app.use("/usuarios", usuariosRoutes);
app.use("/empreendimentos", empreendimentosRoutes);
app.use("/externo/cep", cepRoutes);
app.use("/api", climaRoutes);
app.use("/", frontendRoutes);

/**
 * Servir arquivos estáticos (CSS, JS, IMG).
 */
app.use("/CSS", express.static(path.join(__dirname, "../../frontend/CSS")));
app.use("/JS", express.static(path.join(__dirname, "../../frontend/JS")));
app.use("/IMG", express.static(path.join(__dirname, "../../frontend/IMG")));

/**
 * Middleware para tratar rotas não encontradas.
 *
 * @returns {Object} JSON com mensagem de erro 404.
 */
app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" });
});

/**
 * Middleware para tratamento de erros internos.
 *
 * @param {Error} err - Objeto de erro capturado.
 * @returns {Object} JSON com mensagem de erro 500.
 */
app.use((err, req, res, next) => {
  console.error("Erro interno:", err);
  res.status(500).json({ erro: "Erro interno no servidor" });
});

export default app;
