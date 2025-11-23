document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formCadastroEmpreendimento");
  const mensagem = document.getElementById("mensagem");

  const cepInput = document.getElementById("cep");
  const ruaInput = document.getElementById("rua");
  const bairroInput = document.getElementById("bairro");
  const cidadeInput = document.getElementById("cidade");
  const estadoInput = document.getElementById("estado");
  const telefoneInput = document.getElementById("telefone");
  const btnCancelarCadastro = document.getElementById("btnCancelarCadastro");

  const emailInput = document.getElementById("email");
  const avisoEmail = document.getElementById("avisoEmail");

  const API_BASE = window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://conectabairro.vercel.app";

  // Validação visual do campo telefone
  telefoneInput.addEventListener("input", () => {
    const valor = telefoneInput.value;

    if (/[^0-9]/.test(valor)) {
      alert("⚠️ Digite apenas números.");
      telefoneInput.classList.add("erro-telefone");
      telefoneInput.value = valor.replace(/[^0-9]/g, "");
    } else {
      telefoneInput.classList.remove("erro-telefone");
    }
  });

  emailInput.addEventListener("focus", () => {
    avisoEmail.style.display = "block";
  });

  emailInput.addEventListener("blur", () => {
    avisoEmail.style.display = "none";
  });

  async function buscarCep(cep) {
    if (!cep) return;

    try {
      const token = localStorage.getItem("token");
      const resposta = await fetch(`${API_BASE}/externo/cep/${cep}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        console.log("CEP não encontrado, preencha manualmente");
        return;
      }

      ruaInput.value = dados.rua || "";
      bairroInput.value = dados.bairro || "";
      cidadeInput.value = dados.cidade || "";
      estadoInput.value = dados.estado || "";

    } catch (erro) {
      console.log("Erro ao buscar CEP:", erro);
    }
  }

  cepInput.addEventListener("blur", () => {
    const cep = cepInput.value.replace(/\D/g, "");
    buscarCep(cep);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      mensagem.textContent = "Você precisa estar logado para cadastrar.";
      mensagem.style.color = "red";
      return;
    }

    const telefone = telefoneInput.value.trim();
    if (!/^\d+$/.test(telefone)) {
      alert("⚠️ O telefone deve conter apenas números.");
      telefoneInput.classList.add("erro-telefone");
      return;
    }

    const instagramInput = document.querySelector("input[placeholder='Instagram']");
    const whatsappInput = document.querySelector("input[placeholder='Whatsapp']");

    const dados = {
      nome: document.getElementById("nome").value,
      descricao: document.getElementById("descricao").value,
      endereco: {
        cep: cepInput.value.replace(/\D/g, ""),
        rua: ruaInput.value,
        bairro: bairroInput.value,
        numero: document.getElementById("numero").value,
        complemento: document.getElementById("complemento").value,
        cidade: cidadeInput.value,
        estado: estadoInput.value,
      },
      telefone: telefone,
      email: emailInput.value,
      palavrasChave: document.getElementById("palavrasChave").value
        .split(",")
        .map(p => p.trim())
        .filter(p => p),
      redesSociais: {
        instagram: instagramInput.value.trim(),
        whatsapp: whatsappInput.value.trim()
      }
    };

    try {
      const resposta = await fetch(`${API_BASE}/empreendimentos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(dados)
      });

      const resultado = await resposta.json();

      if (resposta.ok) {
        mensagem.textContent = "Empreendimento cadastrado com sucesso!";
        mensagem.style.color = "green";
        form.reset();

        setTimeout(() => {
          window.location.href = "/meuPerfil";
        }, 1000);
      } else {
        mensagem.textContent = resultado.erro || "Erro ao cadastrar empreendimento.";
        mensagem.style.color = "red";
      }

    } catch (erro) {
      mensagem.textContent = "Erro de conexão com o servidor.";
      mensagem.style.color = "red";
    }
  });

  btnCancelarCadastro.addEventListener("click", () => {
    window.location.href = "/meuPerfil";
  });
});