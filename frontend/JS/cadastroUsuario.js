// const formCadastro = document.getElementById("formCadastro");
// const mensagem = document.getElementById("mensagem");

// formCadastro.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const dados = {
//     nome: document.getElementById("nome").value,
//     email: document.getElementById("email").value,
//     senha: document.getElementById("senha").value,
//   };

//   try {
//     const resposta = await fetch("http://localhost:3000/usuarios/cadastroUsuario", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(dados),
//     });

//     const resultado = await resposta.json();

//     if (resposta.ok) {
//       mensagem.textContent = resultado.mensagem || "Usuário cadastrado com sucesso!";
//       mensagem.style.color = "green";
//       formCadastro.reset();
//     } else {
//       mensagem.textContent = resultado.erro || "Erro ao cadastrar.";
//       mensagem.style.color = "red";
//     }
//   } catch (erro) {
//     mensagem.textContent = "Erro de conexão com o servidor.";
//     mensagem.style.color = "red";
//   }
// });

const formCadastro = document.getElementById("formCadastro");
const mensagem = document.getElementById("mensagem");

const API_BASE = window.location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://conectabairro.vercel.app";

formCadastro.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = {
    nome: document.getElementById("nome").value,
    email: document.getElementById("email").value,
    senha: document.getElementById("senha").value,
  };

  try {
    const resposta = await fetch(`${API_BASE}/usuarios/cadastroUsuario`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();

    if (resposta.ok) {
      mensagem.textContent = resultado.mensagem || "Usuário cadastrado com sucesso!";
      mensagem.style.color = "green";
      formCadastro.reset();
    } else {
      mensagem.textContent = resultado.erro || "Erro ao cadastrar.";
      mensagem.style.color = "red";
    }
  } catch (erro) {
    mensagem.textContent = "Erro de conexão com o servidor.";
    mensagem.style.color = "red";
  }
});