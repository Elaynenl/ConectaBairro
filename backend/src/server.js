import app from "./app.js";

/**
 * Inicializa o servidor Express.
 *
 * @constant
 * @type {number} PORT - Porta definida pela variável de ambiente ou 3000 por padrão.
 */
const PORT = process.env.PORT || 3000;

/**
 * Inicia o servidor e exibe mensagem no console.
 *
 * @function listen
 * @param {number} PORT - Porta onde o servidor será executado.
 */
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
