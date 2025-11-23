import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Schema de Usuário.
 *
 * @typedef {Object} Usuario
 * @property {string} nome - Nome do usuário.
 * @property {string} email - Email único do usuário.
 * @property {string} senha - Senha do usuário (mínimo 6 caracteres).
 */
const UsuarioSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true, minlength: [6, "A senha deve conter no mínimo 6 caracteres"] }
}, {
    timestamps: true
});

/**
 * Middleware pré-save: gera hash da senha antes de salvar.
 *
 * @function preSave
 * @param {Function} next - Callback para continuar execução.
 */
UsuarioSchema.pre("save", async function (next) {
    if (!this.isModified("senha")) return next();
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
});

export default mongoose.model("Usuario", UsuarioSchema);
