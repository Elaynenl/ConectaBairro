// document.addEventListener("DOMContentLoaded", async () => {
//   const lista = document.getElementById("listaEmpreendimentos");
//   const mensagem = document.getElementById("mensagem");

//   const modal = document.getElementById("modalEmpreendimento");
//   const fecharModal = document.querySelector(".fechar");

//   const modalNome = document.getElementById("modalNome");
//   const modalDescricao = document.getElementById("modalDescricao");
//   const modalEmail = document.getElementById("modalEmail");
//   const modalTelefone = document.getElementById("modalTelefone");
//   const modalPalavras = document.getElementById("modalPalavras");
//   const modalEndereco = document.getElementById("modalEndereco");
//   const btnEditar = document.getElementById("btnEditar");
//   const btnDeletar = document.getElementById("btnDeletar");
//   const btnVoltar = document.getElementById("btnVoltarMenu");

//   let empreendimentosData = [];
//   let empreendimentoSelecionado = null;

//   const token = localStorage.getItem("token");

//   if (!token) {
//     mensagem.textContent = "Você precisa estar logado para acessar esta página.";
//     return;
//   }

//   async function carregarEmpreendimentos() {
//     try {
//       const resposta = await fetch("http://localhost:3000/empreendimentos/meusEmpreendimentos", {
//         headers: { "Authorization": `Bearer ${token}` }
//       });

//       if (!resposta.ok) throw new Error("Erro ao buscar empreendimentos");

//       empreendimentosData = await resposta.json();

//       if (empreendimentosData.length === 0) {
//         mensagem.textContent = "Você ainda não cadastrou nenhum empreendimento.";
//         lista.innerHTML = "";
//         return;
//       }

//       mensagem.textContent = "";
//       lista.innerHTML = "";

//       empreendimentosData.forEach(emp => {
//         const card = document.createElement("div");
//         card.classList.add("card");
//         card.innerHTML = `<h3>${emp.nome}</h3>`;
//         card.addEventListener("click", () => abrirModal(emp));
//         lista.appendChild(card);
//       });

//     } catch (erro) {
//       console.error("Erro:", erro);
//       mensagem.textContent = "Erro ao carregar empreendimentos.";
//     }
//   }

//   btnVoltar.addEventListener("click", () => {
//     window.location.href = "/meuPerfil";
//   });

//   function abrirModal(emp) {
//     empreendimentoSelecionado = emp;
//     modalNome.textContent = emp.nome;
//     modalDescricao.textContent = emp.descricao || "Sem descrição";
//     modalEmail.textContent = emp.email || "Não informado";
//     modalTelefone.textContent = emp.telefone || "Não informado";
//     modalPalavras.textContent = emp.palavrasChave?.join(", ") || "Nenhuma";
//     modalEndereco.textContent = `
//       ${emp.endereco?.rua || ""} -  
//       ${emp.endereco?.numero || ""}, 
//       ${emp.endereco?.bairro || ""}, 
//       ${emp.endereco?.cidade || ""} - 
//       ${emp.endereco?.estado || ""}
//     `;
//     modal.style.display = "block";
//   }

//   fecharModal.addEventListener("click", () => modal.style.display = "none");
//   window.addEventListener("click", (e) => {
//     if (e.target === modal) modal.style.display = "none";
//   });

//   btnEditar.addEventListener("click", () => {
//     if (!empreendimentoSelecionado) return;
//     localStorage.setItem("empreendimentoEdicao", JSON.stringify(empreendimentoSelecionado));
//     window.location.href = "/editar-empreendimento";
//   });

//   btnDeletar.addEventListener("click", async () => {
//     if (!empreendimentoSelecionado) return;
//     if (!confirm(`Deseja realmente deletar "${empreendimentoSelecionado.nome}"?`)) return;

//     try {
//       const resp = await fetch(`http://localhost:3000/empreendimentos/${empreendimentoSelecionado._id}`, {
//         method: "DELETE",
//         headers: { "Authorization": `Bearer ${token}` }
//       });

//       if (!resp.ok) {
//         const erro = await resp.json();
//         alert(`Erro ao deletar: ${erro.mensagem || erro.erro}`);
//         return;
//       }

//       alert("Empreendimento deletado com sucesso!");
//       modal.style.display = "none";
//       carregarEmpreendimentos();
//     } catch (e) {
//       console.error(e);
//       alert("Erro ao deletar empreendimento");
//     }
//   });

//   carregarEmpreendimentos();
// });

document.addEventListener("DOMContentLoaded", async () => {
  const lista = document.getElementById("listaEmpreendimentos");
  const mensagem = document.getElementById("mensagem");

  const modal = document.getElementById("modalEmpreendimento");
  const fecharModal = document.querySelector(".fechar");

  const modalNome = document.getElementById("modalNome");
  const modalDescricao = document.getElementById("modalDescricao");
  const modalEmail = document.getElementById("modalEmail");
  const modalTelefone = document.getElementById("modalTelefone");
  const modalPalavras = document.getElementById("modalPalavras");
  const modalEndereco = document.getElementById("modalEndereco");
  const btnEditar = document.getElementById("btnEditar");
  const btnDeletar = document.getElementById("btnDeletar");
  const btnVoltar = document.getElementById("btnVoltarMenu");

  const API_BASE = window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://conectabairro.vercel.app";

  let empreendimentosData = [];
  let empreendimentoSelecionado = null;

  const token = localStorage.getItem("token");

  if (!token) {
    mensagem.textContent = "Você precisa estar logado para acessar esta página.";
    return;
  }

  async function carregarEmpreendimentos() {
    try {
      const resposta = await fetch(`${API_BASE}/empreendimentos/meusEmpreendimentos`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!resposta.ok) throw new Error("Erro ao buscar empreendimentos");

      empreendimentosData = await resposta.json();

      if (empreendimentosData.length === 0) {
        mensagem.textContent = "Você ainda não cadastrou nenhum empreendimento.";
        lista.innerHTML = "";
        return;
      }

      mensagem.textContent = "";
      lista.innerHTML = "";

      empreendimentosData.forEach(emp => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `<h3>${emp.nome}</h3>`;
        card.addEventListener("click", () => abrirModal(emp));
        lista.appendChild(card);
      });

    } catch (erro) {
      console.error("Erro:", erro);
      mensagem.textContent = "Erro ao carregar empreendimentos.";
    }
  }

  btnVoltar.addEventListener("click", () => {
    window.location.href = "/meuPerfil";
  });

  function abrirModal(emp) {
    empreendimentoSelecionado = emp;
    modalNome.textContent = emp.nome;
    modalDescricao.textContent = emp.descricao || "Sem descrição";
    modalEmail.textContent = emp.email || "Não informado";
    modalTelefone.textContent = emp.telefone || "Não informado";
    modalPalavras.textContent = emp.palavrasChave?.join(", ") || "Nenhuma";
    modalEndereco.textContent = `
      ${emp.endereco?.rua || ""} -  
      ${emp.endereco?.numero || ""}, 
      ${emp.endereco?.bairro || ""}, 
      ${emp.endereco?.cidade || ""} - 
      ${emp.endereco?.estado || ""}
    `;
    modal.style.display = "block";
  }

  fecharModal.addEventListener("click", () => modal.style.display = "none");
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  btnEditar.addEventListener("click", () => {
    if (!empreendimentoSelecionado) return;
    localStorage.setItem("empreendimentoEdicao", JSON.stringify(empreendimentoSelecionado));
    window.location.href = "/editar-empreendimento";
  });

  btnDeletar.addEventListener("click", async () => {
    if (!empreendimentoSelecionado) return;
    if (!confirm(`Deseja realmente deletar "${empreendimentoSelecionado.nome}"?`)) return;

    try {
      const resp = await fetch(`${API_BASE}/empreendimentos/${empreendimentoSelecionado._id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (!resp.ok) {
        const erro = await resp.json();
        alert(`Erro ao deletar: ${erro.mensagem || erro.erro}`);
        return;
      }

      alert("Empreendimento deletado com sucesso!");
      modal.style.display = "none";
      carregarEmpreendimentos();
    } catch (e) {
      console.error(e);
      alert("Erro ao deletar empreendimento");
    }
  });

  carregarEmpreendimentos();
});