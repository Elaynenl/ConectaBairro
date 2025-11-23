// const formLogin = document.getElementById("formLogin");
// const mensagem = document.getElementById("mensagem");

// formLogin.addEventListener("submit", async (e) => {
//   e.preventDefault();

//   const dados = {
//     email: document.getElementById("email").value,
//     senha: document.getElementById("senha").value,
//   };

//   try {
//     const resposta = await fetch("http://localhost:3000/usuarios/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(dados),
//     });

//     const resultado = await resposta.json();

//     if (resposta.ok) {
//       mensagem.textContent = "Login realizado com sucesso! Aguarde! Você será redirecionado";
//       mensagem.style.color = "green";

//       localStorage.setItem("token", resultado.token);

//       setTimeout(() => {
//         window.location.href = "/meuPerfil";
//       }, 1000);
//     } else {
//       mensagem.textContent = resultado.message || "Credenciais inválidas.";
//       mensagem.style.color = "red";
//     }
//   } catch (erro) {
//     mensagem.textContent = "Erro de conexão com o servidor.";
//     mensagem.style.color = "red";
//   }
// });

const formLogin = document.getElementById("formLogin");
const mensagem = document.getElementById("mensagem");

const API_BASE = window.location.hostname.includes("localhost")
  ? "http://localhost:3000"
  : "https://conectabairro.vercel.app";

formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();

  const dados = {
    email: document.getElementById("email").value,
    senha: document.getElementById("senha").value,
  };

  try {
    const resposta = await fetch(`${API_BASE}/usuarios/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();

    if (resposta.ok) {
      mensagem.textContent = "Login realizado com sucesso! Aguarde! Você será redirecionado";
      mensagem.style.color = "green";

      localStorage.setItem("token", resultado.token);

      setTimeout(() => {
        window.location.href = "/meuPerfil";
      }, 1000);
    } else {
      mensagem.textContent = resultado.message || "Credenciais inválidas.";
      mensagem.style.color = "red";
    }
  } catch (erro) {
    mensagem.textContent = "Erro de conexão com o servidor.";
    mensagem.style.color = "red";
  }
});