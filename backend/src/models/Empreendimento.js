import mongoose from "mongoose";

/**
 * Normaliza texto removendo acentos e convertendo para minúsculo.
 *
 * @function normalizarTexto
 * @param {string} texto - Texto a ser normalizado.
 * @returns {string} Texto normalizado.
 */
const normalizarTexto = (texto) => {
    if (!texto) return "";
    return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

/**
 * Schema de Empreendimento.
 *
 * @typedef {Object} Empreendimento
 * @property {string} nome - Nome do empreendimento.
 * @property {string} descricao - Descrição do empreendimento.
 * @property {Object} endereco - Endereço do empreendimento.
 * @property {string} endereco.cep - CEP.
 * @property {string} endereco.rua - Rua.
 * @property {string} endereco.bairro - Bairro.
 * @property {string} endereco.numero - Número.
 * @property {string} endereco.complemento - Complemento.
 * @property {string} endereco.cidade - Cidade.
 * @property {string} endereco.estado - Estado.
 * @property {string} telefone - Telefone de contato.
 * @property {string} email - Email de contato.
 * @property {string[]} palavrasChave - Palavras-chave associadas.
 * @property {Object} redesSociais - Redes sociais do empreendimento.
 * @property {string} redesSociais.instagram - Instagram.
 * @property {string} redesSociais.whatsapp - WhatsApp.
 * @property {string} cidadeNormalizada - Cidade normalizada para busca.
 * @property {string} bairroNormalizado - Bairro normalizado para busca.
 * @property {string[]} palavrasChaveNormalizadas - Palavras-chave normalizadas.
 * @property {mongoose.Schema.Types.ObjectId} criadoPor - Usuário criador do empreendimento.
 */
const EmpreendimentoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    endereco: {
        cep: { type: String }, 
        rua: { type: String, required: true },
        bairro: { type: String, required: true },
        numero: { type: String },
        complemento: { type: String },
        cidade: { type: String, required: true },
        estado: { type: String, required: true },
    },
    telefone: { type: String },
    email: { type: String },
    palavrasChave: [{ type: String }],
    redesSociais: {
        instagram: { type: String },
        whatsapp: { type: String }
    },
    cidadeNormalizada: { type: String },
    bairroNormalizado: { type: String },
    palavrasChaveNormalizadas: [{ type: String }],
    criadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
}, {
    timestamps: true
});

/**
 * Middleware pré-save: normaliza cidade, bairro e palavras-chave antes de salvar.
 *
 * @function preSave
 */
EmpreendimentoSchema.pre("save", function(next) {
    this.cidadeNormalizada = normalizarTexto(this.endereco?.cidade);
    this.bairroNormalizado = normalizarTexto(this.endereco?.bairro);
    this.palavrasChaveNormalizadas = this.palavrasChave?.map(p => normalizarTexto(p)) || [];
    next();
});

/**
 * Middleware pré-update: normaliza campos ao atualizar documento.
 *
 * @function preUpdate
 */
EmpreendimentoSchema.pre("findOneAndUpdate", function(next) {
    const update = this.getUpdate();

    if (update.endereco?.cidade) {
        update.cidadeNormalizada = normalizarTexto(update.endereco.cidade);
    }

    if (update.endereco?.bairro) {
        update.bairroNormalizado = normalizarTexto(update.endereco.bairro);
    }

    if (update.palavrasChave) {
        update.palavrasChaveNormalizadas = update.palavrasChave.map(p => normalizarTexto(p));
    }

    next();
});

export default mongoose.model("Empreendimento", EmpreendimentoSchema);
