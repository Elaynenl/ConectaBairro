import dotenv from "dotenv";
dotenv.config();

const API_KEY = process.env.OPENWEATHER_API_KEY;

/**
 * Consulta a API OpenWeather para obter informações de clima de uma cidade.
 *
 * @async
 * @function buscarClima
 * @param {string} cidade - Nome da cidade a ser consultada.
 * @returns {Promise<Object>} Objeto contendo dados de clima (cidade, temperatura, descrição, umidade, vento).
 * Retorna objeto com erro em caso de falha.
 */


export const buscarClima = async (cidade) => {
  try {
    const urlClima = `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${API_KEY}&lang=pt_br&units=metric`;
    const resposta = await fetch(urlClima);

    if (!resposta.ok) {
      return { erro: "Não foi possível obter o clima para esta cidade" };
    }

    const dados = await resposta.json();
    return {
      cidade: dados.name,
      temperatura: dados.main.temp,
      descricao: dados.weather[0].description,
      umidade: dados.main.humidity,
      vento: dados.wind.speed
    };
  } catch (erro) {
    return { erro: "Erro ao buscar clima", detalhe: erro.message };
  }
};
