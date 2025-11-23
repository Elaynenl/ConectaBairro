document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formEditarEmpreendimento");
  const mensagem = document.getElementById("mensagem");
  const btnCancelar = document.getElementById("btnCancelarEdicao");
  const token = localStorage.getItem("token");

  const API_BASE = window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://conectabairro.vercel.app";

  const empreendimentoEdicao = JSON.parse(localStorage.getItem("empreendimentoEdicao"));
  if (!empreendimentoEdicao) {
    mensagem.textContent = "Nenhum empreendimento selecionado para edição.";
    return;
  }

  const campos = {
    nome: document.getElementById("nome"),
    telefone: document.getElementById("telefone"),
    descricao: document.getElementById("descricao"),
    cep: document.getElementById("cep"),
    rua: document.getElementById("rua"),
    bairro: document.getElementById("bairro"),
    cidade: document.getElementById("cidade"),
    estado: document.getElementById("estado"),
    numero: document.getElementById("numero"),
    complemento: document.getElementById("complemento"),
    email: document.getElementById("email"),
    palavrasChave: document.getElementById("palavrasChave"),
    instagram: document.querySelector("input[placeholder='Instagram']"),
    whatsapp: document.querySelector("input[placeholder='Whatsapp']")
  };

  // Preenche os campos com dados existentes
  campos.nome.value = empreendimentoEdicao.nome || "";
  campos.telefone.value = empreendimentoEdicao.telefone || "";
  campos.descricao.value = empreendimentoEdicao.descricao || "";
  campos.cep.value = empreendimentoEdicao.endereco?.cep || "";
  campos.rua.value = empreendimentoEdicao.endereco?.rua || "";
  campos.bairro.value = empreendimentoEdicao.endereco?.bairro || "";
  campos.cidade.value = empreendimentoEdicao.endereco?.cidade || "";
  campos.estado.value = empreendimentoEdicao.endereco?.estado || "";
  campos.numero.value = empreendimentoEdicao.endereco?.numero || "";
  campos.complemento.value = empreendimentoEdicao.endereco?.complemento || "";
  campos.email.value = empreendimentoEdicao.email || "";
  campos.palavrasChave.value = empreendimentoEdicao.palavrasChave?.join(", ") || "";
  campos.instagram.value = empreendimentoEdicao.redesSociais?.instagram || "";
  campos.whatsapp.value = empreendimentoEdicao.redesSociais?.whatsapp || "";

  // Validação visual do campo telefone
  campos.telefone.addEventListener("input", () => {
    const valor = campos.telefone.value;
    if (/[^0-9]/.test(valor)) {
      alert("⚠️ Digite apenas números.");
      campos.telefone.classList.add("erro-telefone");
      campos.telefone.value = valor.replace(/[^0-9]/g, "");
    } else {
      campos.telefone.classList.remove("erro-telefone");
    }
  });

  campos.cep.addEventListener("input", async () => {
    const cep = campos.cep.value.replace(/\D/g, "");
    if (cep.length === 8) {
      try {
        const resp = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await resp.json();
        if (!data.erro) {
          campos.rua.value = data.logradouro || "";
          campos.bairro.value = data.bairro || "";
          campos.cidade.value = data.localidade || "";
          campos.estado.value = data.uf || "";
        }
      } catch (erro) {
        console.error("Erro ao buscar CEP:", erro);
      }
    }
  });

  form.addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.preventDefault();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const telefone = campos.telefone.value.trim();
    // Se o campo não estiver vazio, valida se contém apenas números
    if (telefone && !/^\d+$/.test(telefone)) {
      alert("⚠️ O telefone deve conter apenas números.");
      campos.telefone.classList.add("erro-telefone");
      return;
    }

    const dadosAtualizados = {
      nome: campos.nome.value.trim(),
      telefone: telefone || null, // null se vazio
      descricao: campos.descricao.value.trim(),
      email: campos.email.value.trim() || null, // null se vazio
      palavrasChave: campos.palavrasChave.value
        .split(",")
        .map(p => p.trim())
        .filter(p => p !== ""),
      endereco: {
        cep: campos.cep.value.replace(/\D/g, ""),
        rua: campos.rua.value.trim(),
        bairro: campos.bairro.value.trim(),
        cidade: campos.cidade.value.trim(),
        estado: campos.estado.value.trim(),
        numero: campos.numero.value.trim(),
        complemento: campos.complemento.value.trim(),
      },
      redesSociais: {
        instagram: campos.instagram.value.trim() || null, // null se vazio
        whatsapp: campos.whatsapp.value.trim() || null   // null se vazio
      }
    };

    // Se palavras-chave ficar totalmente em branco, envia null
    if (dadosAtualizados.palavrasChave.length === 0) {
      dadosAtualizados.palavrasChave = null;
    }

    try {
      const resp = await fetch(`${API_BASE}/empreendimentos/${empreendimentoEdicao._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dadosAtualizados)
      });

      if (!resp.ok) {
        const erro = await resp.json();
        mensagem.textContent = `Erro: ${erro.mensagem || erro.erro}`;
        mensagem.style.color = "red";
        return;
      }

      mensagem.textContent = "Empreendimento atualizado com sucesso!";
      mensagem.style.color = "green";

      localStorage.setItem("empreendimentoEdicao", JSON.stringify({
        ...empreendimentoEdicao,
        ...dadosAtualizados
      }));

      setTimeout(() => {
        window.location.href = "/meus-empreendimento";
      }, 1500);

    } catch (erro) {
      console.error(erro);
      mensagem.textContent = "Erro ao atualizar empreendimento.";
      mensagem.style.color = "red";
    }
  });

  btnCancelar.addEventListener("click", () => {
    window.location.href = "/meus-empreendimento";
  });
});