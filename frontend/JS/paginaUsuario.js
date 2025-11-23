// const boasVindas = document.getElementById("boasVindas");
// const btnCadastrar = document.getElementById("btnCadastrar");
// const btnMeusEmpreendimentos = document.getElementById("btnMeusEmpreendimentos");
// const btnSair = document.getElementById("btnSair");
// const btnEditarPerfil = document.getElementById("btnEditarPerfil");
// const mensagem = document.getElementById("mensagem");

// const token = localStorage.getItem("token");

// if (!token) {
//   window.location.href = "/login";
// } else {
  
//   fetch("http://localhost:3000/usuarios/meuPerfil", {
//     headers: { "Authorization": `Bearer ${token}` }
//   })
//     .then(res => {
//       if (!res.ok) throw new Error("Não autorizado");
//       return res.json();
//     })
//     .then(usuario => {
//       const primeiroNome = usuario.nome?.split(" ")[0] || "Usuário";
//       boasVindas.textContent = `Bem-vindo, ${primeiroNome}!`;
//     })
//     .catch(() => {
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     });
// }

// btnCadastrar.addEventListener("click", () => {
//   window.location.href = "/cadastrar-empreendimento";
// });

// btnMeusEmpreendimentos.addEventListener("click", () => {
//   window.location.href = "/meus-empreendimento";
// });

// btnEditarPerfil.addEventListener("click", () => {
//   window.location.href = "/editar-empreendimento"; 
// });

// btnSair.addEventListener("click", () => {
//   localStorage.removeItem("token");
//   window.location.href = "/login";
// });

const boasVindas = document.getElementById("boasVindas");
const btnCadastrar = document.getElementById("btnCadastrar");
const btnMeusEmpreendimentos = document.getElementById("btnMeusEmpreendimentos");
const btnSair = document.getElementById("btnSair");
const btnEditarPerfil = document.getElementById("btnEditarPerfil");
const mensagem = document.getElementById("mensagem");

const token = localStorage.getItem("token");

const API_BASE = window.location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://conectabairro.vercel.app";

if (!token) {
  window.location.href = "/login";
} else {
  fetch(`${API_BASE}/usuarios/meuPerfil`, {
    headers: { "Authorization": `Bearer ${token}` }
  })
    .then(res => {
      if (!res.ok) throw new Error("Não autorizado");
      return res.json();
    })
    .then(usuario => {
      const primeiroNome = usuario.nome?.split(" ")[0] || "Usuário";
      boasVindas.textContent = `Bem-vindo, ${primeiroNome}!`;
    })
    .catch(() => {
      localStorage.removeItem("token");
      window.location.href = "/login";
    });
}

btnCadastrar.addEventListener("click", () => {
  window.location.href = "/cadastrar-empreendimento";
});

btnMeusEmpreendimentos.addEventListener("click", () => {
  window.location.href = "/meus-empreendimento";
});

// btnEditarPerfil.addEventListener("click", () => {
//   window.location.href = "/editar-empreendimento";
// });

btnSair.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
});