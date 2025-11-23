import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

/**
 * Conecta ao banco de dados em memória para testes usando MongoMemoryServer.
 *
 * @async
 * @function conectarBancoMock
 * @returns {Promise<void>} Conexão estabelecida com banco em memória.
 */
export const conectarBancoMock = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

/**
 * Desconecta do banco em memória e encerra servidor.
 *
 * @async
 * @function desconectarBancoMock
 * @returns {Promise<void>} Banco desconectado e servidor parado.
 */
export const desconectarBancoMock = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  if (mongoServer) await mongoServer.stop();
};

/**
 * Limpa todas as coleções do banco em memória.
 *
 * @async
 * @function limparBancoMock
 * @returns {Promise<void>} Todas as coleções são esvaziadas.
 */
export const limparBancoMock = async () => {
  const colecoes = mongoose.connection.collections;
  for (const key in colecoes) {
    await colecoes[key].deleteMany({});
  }
};
