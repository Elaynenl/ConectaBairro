/**
 * Cria uma função de filtro genérica para verificar se um campo de um objeto contém determinado valor.
 *
 * @function criarFiltro
 * @param {string} campo - Nome do campo do objeto que será usado no filtro.
 * @returns {Function} Função que recebe um valor e retorna outra função que verifica se o objeto contém esse valor no campo especificado.
 *
 * @example
 * const filtrarPorNome = criarFiltro("nome");
 * const resultado = lista.filter(filtrarPorNome("Elayne"));
 */


export const criarFiltro = (campo) => {
    return (valor) => (objeto) => objeto[campo] && objeto[campo].includes(valor);
};

/**
 * Filtra uma lista de objetos por bairro, ignorando diferenças de maiúsculas/minúsculas.
 *
 * @function filtrarPorBairro
 * @param {Object[]} lista - Lista de objetos contendo a propriedade `bairro`.
 * @param {string} bairro - Nome do bairro a ser comparado.
 * @returns {Object[]} Lista filtrada apenas com os objetos que possuem o bairro informado.
 *
 * @example
 * const resultado = filtrarPorBairro(listaEmpreendimentos, "Meireles");
 */


export const filtrarPorBairro = (lista, bairro) =>
    lista.filter(item => item.bairro.toLowerCase() === bairro.toLowerCase());
