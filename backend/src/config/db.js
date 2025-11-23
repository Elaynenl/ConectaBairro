import mongoose from "mongoose";

/**
 * Conecta ao banco de dados MongoDB usando a URI definida em variáveis de ambiente.
 *
 * @async
 * @function conectarDB
 * @returns {Promise<void>} Retorna uma Promise resolvida quando a conexão é estabelecida.
 * @throws {Error} Caso ocorra falha na conexão, encerra o processo com código 1.
 */

const conectarDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB conectado com sucesso!");
    } catch (error) {
        console.error("Erro na conexão com MongoDB:", error.message);
        process.exit(1);
    }
};

export default conectarDB;
