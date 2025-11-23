import Empreendimento from "../models/Empreendimento.js";
import { buscarEnderecoPorCep } from "../services/viaCepService.js";

/**
 * Normaliza CEP removendo caracteres não numéricos.
 *
 * @function normalizarCep
 * @param {string} cep - CEP a ser normalizado.
 * @returns {string} CEP apenas com dígitos.
 */
function normalizarCep(cep) {
    if (!cep) return "";
    return cep.replace(/\D/g, "");
}

/**
 * Controlador para buscar empreendimentos por CEP.
 *
 * @async
 * @function buscarEmpreendimentosPorCep
 * @param {Object} req - Objeto da requisição Express.
 * @param {Object} res - Objeto da resposta Express.
 * @returns {Promise<void>} Retorna lista de empreendimentos associados ao CEP informado.
 */
export const buscarEmpreendimentosPorCep = async (req, res) => {
    try {
        const { cep } = req.params;

        const enderecoViaCep = await buscarEnderecoPorCep(cep);

        if (!enderecoViaCep) {
            return res.status(404).json({ erro: "CEP não encontrado na API ViaCEP" });
        }

        const cepNormalizado = normalizarCep(enderecoViaCep.cep);

        const empreendimentos = await Empreendimento.find({ "endereco.cep": cepNormalizado });

        res.json({
            cep: enderecoViaCep.cep,
            rua: enderecoViaCep.rua,
            bairro: enderecoViaCep.bairro,
            cidade: enderecoViaCep.cidade,
            estado: enderecoViaCep.estado,
            empreendimentos
        });
    } catch (error) {
        res.status(500).json({ erro: "Erro ao buscar empreendimentos por CEP", detalhe: error.message });
    }
};
