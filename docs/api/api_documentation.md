## Documentação da API – ConectaBairro

Esta documentação descreve a API desenvolvida para o sistema ConectaBairro, que tem como objetivo conectar moradores a empreendimentos locais por meio de uma plataforma web. A API é construída em **Node.js** com **Express**, seguindo o padrão RESTful e integrando-se a serviços externos para enriquecer os dados.

---

## Visão Geral

A API do ConectaBairro permite:

- Cadastro e autenticação de usuários

- Cadastro, edição, listagem e exclusão de empreendimentos

- Busca por empreendimentos com filtros variados

- Integração com a API ViaCEP para autocompletar endereços

- Integração com a API OpenWeatherMap para exibir clima por cidade

- Proteção de rotas com autenticação JWT

---

## Tecnologias Utilizadas

- Node.js + Express

- MongoDB + Mongoose

- JWT para autenticação

- bcryptjs para criptografia de senhas

- Fetch API para consumo de APIs externas

- Jest + Supertest para testes automatizados

- MongoMemoryServer para testes isolados

---

## Protocolos e Padrões

- HTTP/HTTPS: comunicação entre cliente e servidor

- RESTful: rotas organizadas por recurso e métodos semânticos (GET, POST, PUT, DELETE)

- JSON: formato padrão para requisições e respostas

- JWT: autenticação stateless via token

- Modularização: controllers, models, routes, services, middleware e utils

---

## Estrutura da API

```Plaintext
src/
├─ config/           # Conexão com MongoDB
├─ controllers/      # Lógica de negócio
├─ middleware/       # Autenticação JWT
├─ models/           # Schemas Mongoose
├─ routes/           # Endpoints organizados por recurso
├─ services/         # Integrações com ViaCEP e OpenWeather
├─ utils/            # Funções auxiliares
├─ app.js            # Configuração principal do Express
└─ server.js         # Inicialização do servidor
```

## Fluxo de Requisição

### Rota pública

```Plaintext
Usuário → Express → Controller → [Service] → MongoDB → JSON → Frontend
```

### Rota protegida

```Plaintext
Usuário → Express → authMiddleware → Controller → [Service] → MongoDB → JSON → Frontend
```
---

## Endpoints Principais

| Método | Rota                        | Descrição                              | Protegida |
|--------|-----------------------------|----------------------------------------|-----------|
| POST   | `/usuarios/cadastroUsuario` | Cadastro de novo usuário               | Não        |
| POST   | `/usuarios/login`           | Autenticação e geração de token JWT    | Não        |
| POST   | `/empreendimentos`          | Cadastro de empreendimento             | Sim        |
| PUT    | `/empreendimentos/:id`      | Edição de empreendimento               | Sim        |
| DELETE | `/empreendimentos/:id`      | Exclusão de empreendimento             | Sim        |
| GET    | `/empreendimentos`          | Listagem e busca de empreendimentos    | Não        |
| GET    | `/externo/cep/:cep`         | Consulta de endereço via ViaCEP        | Não        |
| GET    | `/api/clima?cidade=...`     | Consulta de clima via OpenWeatherMap   | Não        |

---

## Testes Automatizados

- Jest + Supertest para testes unitários e de integração

- MongoMemoryServer para simular banco em memória

- Cobertura de:

  - Cadastro e login

  - CRUD de empreendimentos

  - Proteção de rotas

  - Integrações externas

---

## Validações

- Email único e válido

- Senha com mínimo de 6 caracteres

- CEP validado antes de chamar ViaCEP

- Autocompletar endereço via ViaCEP

- Verificação de autor do empreendimento antes de editar ou excluir

---

## Integração com APIs Externas

- ViaCEP: autocompleta endereço com base no CEP

- OpenWeatherMap: retorna clima atual da cidade

- Ambas encapsuladas em serviços reutilizáveis (viaCepService.js, climaService.js)

---

## Respostas da API

### **Sucesso**

```json
{
  "mensagem": "Usuário cadastrado com sucesso",
  "token": "..."
}
````

```json
{
  "mensagem": "Empreendimento cadastrado com sucesso",
  "empreendimento": { ... }
}
```


### Erros

```json
{ "erro": "Usuário já cadastrado" }
{ "erro": "Credenciais inválidas" }
{ "erro": "Token inválido ou expirado" }
{ "erro": "Usuário não autorizado para esta ação" }
```

---
