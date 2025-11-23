import Empreendimento from "../models/Empreendimento.js";
import dotenv from "dotenv";
import { buscarEnderecoPorCep } from "../services/viaCepService.js";
import { buscarClima } from "../services/climaService.js";

dotenv.config();

/**
 * Normaliza texto removendo acentos e convertendo para minúsculo.
 *
 * @function normalizar
 * @param {string} texto - Texto a ser normalizado.
 * @returns {string} Texto normalizado.
 */
function normalizar(texto) {
  if (!texto) return "";
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

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
 * Lista empreendimentos com filtros opcionais e agrupamento por cidade.
 *
 * @async
 * @function listarEmpreendimentos
 * @param {Object} req - Objeto da requisição Express.
 * @param {Object} res - Objeto da resposta Express.
 * @returns {Promise<void>} Retorna lista paginada de empreendimentos agrupados por cidade com dados de clima.
 */
export const listarEmpreendimentos = async (req, res) => {
  try {
    const { rua, bairro, cidade, estado, palavra, cep, page = 1, limit = 10 } = req.query;

    const pagina = parseInt(page);
    const limite = parseInt(limit);

    let filtro = {};
    if (rua) filtro["endereco.rua"] = { $regex: rua, $options: "i" };
    if (bairro) filtro["bairroNormalizado"] = { $regex: normalizar(bairro), $options: "i" };
    if (cidade) filtro["cidadeNormalizada"] = { $regex: normalizar(cidade), $options: "i" };
    if (estado) filtro["endereco.estado"] = { $regex: estado, $options: "i" };
    if (palavra) filtro["palavrasChaveNormalizadas"] = { $regex: normalizar(palavra), $options: "i" };
    if (cep) filtro["endereco.cep"] = normalizarCep(cep);

    const total = await Empreendimento.countDocuments(filtro);

    const empreendimentos = await Empreendimento.find(filtro)
      .populate("criadoPor", "nome email")
      .sort({ nome: 1 })
      .skip((pagina - 1) * limite)
      .limit(limite);

    if (empreendimentos.length === 0) {
      return res.status(404).json({ mensagem: "Nenhum empreendimento encontrado para os filtros informados." });
    }

    const cidadesAgrupadas = {};
    for (const emp of empreendimentos) {
      const cidadeEmp = emp.cidadeNormalizada || normalizar(emp.endereco?.cidade);
      if (!cidadeEmp) continue;

      if (!cidadesAgrupadas[cidadeEmp]) {
        cidadesAgrupadas[cidadeEmp] = [];
      }
      cidadesAgrupadas[cidadeEmp].push(emp);
    }

    const respostaFinal = [];
    for (const cidade in cidadesAgrupadas) {
      const clima = await buscarClima(cidade);
      respostaFinal.push({
        cidade,
        clima,
        empreendimentos: cidadesAgrupadas[cidade]
      });
    }

    res.json({
      paginaAtual: pagina,
      totalPaginas: Math.ceil(total / limite),
      totalResultados: total,
      resultados: respostaFinal
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar empreendimentos", detalhe: error.message });
  }
};

/**
 * Cadastra um novo empreendimento, enriquecendo dados de endereço via CEP.
 *
 * @async
 * @function cadastrarEmpreendimento
 * @param {Object} req - Objeto da requisição Express.
 * @param {Object} res - Objeto da resposta Express.
 * @returns {Promise<void>} Retorna o empreendimento criado.
 */
export const cadastrarEmpreendimento = async (req, res) => {
  try {
    const { nome, descricao, endereco, telefone, email, palavrasChave, redesSociais } = req.body;

    let enderecoFinal = endereco;

    if (endereco?.cep) {
      const cepNormalizado = normalizarCep(endereco.cep);
      const enderecoViaCep = await buscarEnderecoPorCep(cepNormalizado);

      if (enderecoViaCep) {
        enderecoFinal = { ...endereco, ...enderecoViaCep };
      }

      enderecoFinal.cep = cepNormalizado;
    }

    const novoEmpreendimento = new Empreendimento({
      nome,
      descricao,
      endereco: enderecoFinal,
      telefone,
      email,
      palavrasChave,
      palavrasChaveNormalizadas: palavrasChave.map(p => normalizar(p)),
      cidadeNormalizada: normalizar(enderecoFinal?.cidade),
      bairroNormalizado: normalizar(enderecoFinal?.bairro),
      redesSociais,
      criadoPor: req.usuario.id
    });

    const salvo = await novoEmpreendimento.save();

    res.status(201).json({
      mensagem: "Empreendimento cadastrado com sucesso",
      empreendimento: salvo
    });

  } catch (error) {
    res.status(500).json({ erro: "Erro ao cadastrar empreendimento", detalhe: error.message });
  }
};

/**
 * Edita um empreendimento existente, respeitando permissões do criador.
 *
 * @async
 * @function editarEmpreendimento
 * @param {Object} req - Objeto da requisição Express.
 * @param {Object} res - Objeto da resposta Express.
 * @returns {Promise<void>} Retorna o empreendimento atualizado.
 */
export const editarEmpreendimento = async (req, res) => {
  try {
    const { id } = req.params;
    const empreendimento = await Empreendimento.findById(id);

    if (!empreendimento) {
      return res.status(404).json({ erro: "Empreendimento não encontrado" });
    }

    if (empreendimento.criadoPor.toString() !== req.usuario.id) {
      return res.status(403).json({ erro: "Você não tem permissão para editar este empreendimento" });
    }

    const dadosAtualizados = req.body;
    const update = {};
    const unset = {};

    if (dadosAtualizados.nome) update.nome = dadosAtualizados.nome;
    if (dadosAtualizados.descricao) update.descricao = dadosAtualizados.descricao;

    if (dadosAtualizados.telefone === null) {
      unset.telefone = 1;
    } else if (dadosAtualizados.telefone) {
      update.telefone = dadosAtualizados.telefone;
    }

    if (dadosAtualizados.email === null) {
      unset.email = 1;
    } else if (dadosAtualizados.email) {
      update.email = dadosAtualizados.email;
    }

    if (dadosAtualizados.palavrasChave === null) {
      unset.palavrasChave = 1;
      unset.palavrasChaveNormalizadas = 1;
    } else if (dadosAtualizados.palavrasChave) {
      update.palavrasChave = dadosAtualizados.palavrasChave;
      update.palavrasChaveNormalizadas = dadosAtualizados.palavrasChave.map(p => normalizar(p));
    }

    if (dadosAtualizados.redesSociais) {
      if (dadosAtualizados.redesSociais.instagram === null) {
        unset["redesSociais.instagram"] = 1;
      } else if (dadosAtualizados.redesSociais.instagram) {
        update["redesSociais.instagram"] = dadosAtualizados.redesSociais.instagram;
      }

      if (dadosAtualizados.redesSociais.whatsapp === null) {
        unset["redesSociais.whatsapp"] = 1;
      } else if (dadosAtualizados.redesSociais.whatsapp) {
        update["redesSociais.whatsapp"] = dadosAtualizados.redesSociais.whatsapp;
      }
    }

    if (dadosAtualizados.endereco) {
      let enderecoNovo = { ...empreendimento.endereco?.toObject(), ...dadosAtualizados.endereco };

      if (dadosAtualizados.endereco.cep) {
        const cepNormalizado = normalizarCep(dadosAtualizados.endereco.cep);
        const enderecoViaCep = await buscarEnderecoPorCep(cepNormalizado);
        if (enderecoViaCep) {
          enderecoNovo = { ...enderecoNovo, ...enderecoViaCep };
        }
        enderecoNovo.cep = cepNormalizado;
      }

      update.endereco = enderecoNovo;
      if (enderecoNovo.cidade) update.cidadeNormalizada = normalizar(enderecoNovo.cidade);
      if (enderecoNovo.bairro) update.bairroNormalizado = normalizar(enderecoNovo.bairro);
    }

        const atualizado = await Empreendimento.findByIdAndUpdate(
      id,
      { ...update, ...(Object.keys(unset).length ? { $unset: unset } : {}) },
      { new: true, runValidators: true }
    );

    res.json({ mensagem: "Empreendimento atualizado com sucesso", empreendimento: atualizado });
  } catch (error) {
    console.error("Erro ao editar empreendimento:", error);
    res.status(500).json({ erro: "Erro ao editar empreendimento", detalhe: error.message });
  }
};

/**
 * Deleta um empreendimento existente, respeitando permissões do criador.
 *
 * @async
 * @function deletarEmpreendimento
 * @param {Object} req - Objeto da requisição Express.
 * @param {Object} res - Objeto da resposta Express.
 * @returns {Promise<void>} Retorna mensagem de sucesso ao deletar.
 */
export const deletarEmpreendimento = async (req, res) => {
  try {
    const { id } = req.params;
    const empreendimento = await Empreendimento.findById(id);

    if (!empreendimento) return res.status(404).json({ erro: "Empreendimento não encontrado" });
    if (empreendimento.criadoPor.toString() !== req.usuario.id) {
      return res.status(403).json({ erro: "Você não tem permissão para deletar este empreendimento" });
    }

    await empreendimento.deleteOne();
    res.json({ mensagem: "Empreendimento deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao deletar empreendimento", detalhe: error.message });
  }
};

/**
 * Lista um empreendimento específico por ID, respeitando permissões do criador.
 *
 * @async
 * @function listarEmpreendimentoPorId
 * @param {Object} req - Objeto da requisição Express.
 * @param {Object} res - Objeto da resposta Express.
 * @returns {Promise<void>} Retorna o empreendimento encontrado.
 */
export const listarEmpreendimentoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const empreendimento = await Empreendimento.findById(id).populate("criadoPor", "nome email");

    if (!empreendimento) {
      return res.status(404).json({ erro: "Empreendimento não encontrado" });
    }

    if (empreendimento.criadoPor._id.toString() !== req.usuario.id) {
      return res.status(403).json({ erro: "Você não tem permissão para ver este empreendimento" });
    }

    res.json(empreendimento);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar empreendimento", detalhe: error.message });
  }
};

/**
 * Lista todos os empreendimentos criados pelo usuário autenticado.
 *
 * @async
 * @function listarMeusEmpreendimentos
 * @param {Object} req - Objeto da requisição Express.
 * @param {Object} res - Objeto da resposta Express.
 * @returns {Promise<void>} Retorna lista de empreendimentos do usuário.
 */
export const listarMeusEmpreendimentos = async (req, res) => {
  try {
    const userId = req.usuario._id;
    const meusEmp = await Empreendimento.find({ criadoPor: userId });
    res.json(meusEmp);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar meus empreendimentos", detalhe: error.message });
  }
};
