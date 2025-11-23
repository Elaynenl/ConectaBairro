/**
 * Consulta a API ViaCEP para obter informações de endereço a partir de um CEP.
 *
 * @async
 * @function buscarEnderecoPorCep
 * @param {string} cep - CEP a ser consultado.
 * @returns {Promise<Object|null>} Objeto contendo dados de endereço (cep, rua, bairro, cidade, estado).
 * Retorna `null` se o CEP não for encontrado ou em caso de erro.
 */


export const buscarEnderecoPorCep = async (cep) => {
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

        if (!response.ok) {
            console.error("Erro HTTP na consulta ViaCEP:", response.status);
            return null;
        }

        const data = await response.json();

        if (data.erro) {
            return null;
        }

        return {
            cep: data.cep,
            rua: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            estado: data.uf,
        };
    } catch (error) {
        console.error("Erro ao consultar ViaCEP:", error.message);
        return null;
    }
};
