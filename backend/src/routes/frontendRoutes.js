import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Rotas para servir páginas HTML do frontend.
 *
 * @route GET /
 * @route GET /inicio
 * @route GET /login
 * @route GET /meus-empreendimento
 * @route GET /buscar-empreendimentos
 * @route GET /meuPerfil
 * @route GET /editar-empreendimento
 * @route GET /acesso-inicial
 * @route GET /cadastrar-empreendimento
 * @route GET /cadastrar-usuario
 */
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../frontend/HTML/index.html"));
});

router.get("/inicio", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../frontend/HTML/index.html"));
});

router.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../frontend/HTML/login.html"));
});

router.get("/meus-empreendimento", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../frontend/HTML/meusEmpreendimentos.html"));
});

router.get("/buscar-empreendimentos", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../frontend/HTML/buscarEmpreendimentos.html"));
});

router.get("/meuPerfil", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../frontend/HTML/paginaUsuario.html"));
});

router.get("/editar-empreendimento", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../frontend/HTML/editarEmpreendimento.html"));
});

router.get("/acesso-inicial", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../frontend/HTML/acesso.html"));
});

router.get("/cadastrar-empreendimento", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../frontend/HTML/cadastrarEmpreendimento.html"));
});

router.get("/cadastrar-usuario", (req, res) => {
  res.sendFile(path.join(__dirname, "../../../frontend/HTML/cadastroUsuario.html"));
});

export const frontendRoutes = router;
