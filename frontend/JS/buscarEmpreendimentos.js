document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formBusca");
  const resultados = document.getElementById("resultados");
  const mensagem = document.getElementById("mensagem");
  const btnVoltar = document.getElementById("btnVoltar");

  const API_BASE = window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : "https://conectabairro.vercel.app";

  const API_URL = `${API_BASE}/empreendimentos`;
  const API_CEP = `${API_BASE}/externo/cep`;

  let paginaAtual = 1;
  const limitePorPagina = 10;

  document.getElementById("cep").addEventListener("blur", async (e) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (!cep) return;

    try {
      const resp = await fetch(`${API_CEP}/${cep}`);
      if (!resp.ok) throw new Error("CEP não encontrado");
      const dados = await resp.json();

      document.getElementById("rua").value = dados.logradouro || "";
      document.getElementById("bairro").value = dados.bairro || "";
      document.getElementById("cidade").value = dados.localidade || "";
      document.getElementById("estado").value = dados.uf || "";

    } catch (erro) {
      console.warn("Erro ao buscar CEP:", erro.message);
      mensagem.textContent = "CEP não encontrado.";
      mensagem.style.color = "red";
    }
  });

  async function buscarEmpreendimentos(pagina = 1) {
    resultados.innerHTML = "";
    mensagem.textContent = "Buscando empreendimentos...";
    paginaAtual = pagina;

    const params = new URLSearchParams({
      rua: document.getElementById("rua").value.trim(),
      bairro: document.getElementById("bairro").value.trim(),
      cidade: document.getElementById("cidade").value.trim(),
      estado: document.getElementById("estado").value.trim(),
      cep: document.getElementById("cep").value.trim(),
      palavra: document.getElementById("palavraChave")?.value.trim() || "",
      page: paginaAtual,
      limit: limitePorPagina
    });

    try {
      const resp = await fetch(`${API_URL}?${params.toString()}`);
      if (!resp.ok) {
        const erro = await resp.json();
        mensagem.textContent = erro.mensagem || "Nenhum resultado encontrado.";
        mensagem.style.color = "red";
        return;
      }

      const dados = await resp.json();
      mensagem.textContent = "";
      document.body.classList.add("resultados-ativos");

      dados.resultados.forEach(grupo => {
        const bloco = document.createElement("div");
        bloco.classList.add("cidade-bloco");

        const clima = grupo.clima;
        const climaInfo = clima.erro
          ? `<p>Clima: ${clima.erro}</p>`
          : `<p>🌤 ${clima.descricao}, ${clima.temperatura.toFixed(1)}°C | 💧 Umidade: ${clima.umidade}% | 💨 Ventos: ${clima.vento} km/h</p>`;

        bloco.innerHTML = `<h3>${grupo.cidade}</h3>${climaInfo}`;

        grupo.empreendimentos.forEach(emp => {
          const card = document.createElement("div");
          card.classList.add("card-empreendimento");

          card.innerHTML = `
            <h4>${emp.nome}</h4>
            <p><strong>Descrição:</strong> ${emp.descricao}</p>
            <p><strong>Endereço:</strong> ${emp.endereco.rua}, ${emp.endereco.numero || ""} - ${emp.endereco.bairro}, ${emp.endereco.cidade}/${emp.endereco.estado} - CEP: ${emp.endereco.cep}</p>
            <p><strong>Telefone:</strong> ${emp.telefone || "Não informado"}</p>
            <p><strong>Email:</strong> ${emp.email || "Não informado"}</p>
            
            <div class="redes-icones">
              <p>
                <img src="/IMG/instagram.png" alt="Instagram" class="logo-redes">
                ${emp.redesSociais?.instagram || "Não informado"}
              </p>
              <p>
                <img src="/IMG/whatsapp.png" alt="Whatsapp" class="logo-redes">
                ${emp.redesSociais?.whatsapp || "Não informado"}
              </p>
            </div>

            <p><strong>Palavras-chave:</strong> ${emp.palavrasChave?.join(", ") || "Nenhuma"}</p>
          `;
          

          bloco.appendChild(card);
        });

        resultados.appendChild(bloco);
      });

      renderizarPaginacao(dados.totalPaginas);

    } catch (erro) {
      console.error("Erro na busca:", erro);
      mensagem.textContent = "Erro ao buscar empreendimentos.";
      mensagem.style.color = "red";
    }
  }

  function renderizarPaginacao(totalPaginas) {
    const paginacao = document.createElement("div");
    paginacao.classList.add("paginacao");

    for (let i = 1; i <= totalPaginas; i++) {
      const botao = document.createElement("button");
      botao.textContent = i;
      botao.classList.add("pagina-btn");
      if (i === paginaAtual) botao.classList.add("ativa");

      botao.addEventListener("click", () => buscarEmpreendimentos(i));
      paginacao.appendChild(botao);
    }

    resultados.appendChild(paginacao);
  }

  buscarEmpreendimentos();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    buscarEmpreendimentos(1);
  });

  btnVoltar.addEventListener("click", () => {
    window.location.href = "/meuPerfil";
  });
});
