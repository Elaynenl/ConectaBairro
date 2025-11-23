## Visão Geral da Arquitetura

O sistema ConectaBairro é composto por duas camadas principais:

Frontend Web: Desenvolvido com HTML, CSS e JavaScript puro, oferece uma interface responsiva para moradores e empreendedores interagirem com a plataforma.

Backend (API RESTful): Construído com Node.js e Express, segue o padrão MVC e é responsável por autenticação, gerenciamento de empreendimentos, integração com APIs externas e resposta em formato JSON.

---

## Componentes do Sistema

| Componente                 | Descrição                                                                 |
|---------------------------|---------------------------------------------------------------------------|
| **Frontend Web**          | Interface de acesso para usuários, com páginas organizadas por perfil     |
| **Backend (API RESTful)** | Responsável por autenticação, CRUD de empreendimentos e integração externa |
| **Banco de Dados (MongoDB)** | Armazena usuários, empreendimentos e dados normalizados                   |
| **Serviços Externos**     | Integração com ViaCEP (endereços) e OpenWeather (clima por cidade)        |
| **Middleware de Autenticação** | Valida tokens JWT e protege rotas sensíveis                               |
| **Testes Automatizados**  | Cobrem os principais fluxos com Jest e Supertest                          |

---

## Estrutura de Pastas da API

```
src/
├─ config/           # Conexão com MongoDB
├─ controllers/      # Lógica de negócio (usuários, empreendimentos, clima, CEP)
├─ middleware/       # Autenticação via JWT
├─ models/           # Schemas Mongoose (Usuario, Empreendimento)
├─ routes/           # Endpoints organizados por recurso
├─ services/         # Consumo de APIs externas (ViaCEP, OpenWeather)
├─ utils/            # Funções auxiliares para filtros e normalização
├─ app.js            # Configuração principal do Express
└─ server.js         # Inicialização do servidor
```
---

## Fluxo de Requisição

### Rota pública

```Plaintext
Usuário → Express/Rotas → Controller → [Services/APIs externas?] → MongoDB → Controller → JSON → Frontend
```

### Rota protegida

```Plaintext
Usuário → Express/Rotas → authMiddleware (JWT) → Controller → [Services/APIs externas?] → MongoDB → Controller → JSON → Frontend
```

- O middleware verifica o token JWT no header Authorization: Bearer <token>

- Se válido, anexa os dados do usuário à req.usuario e libera o acesso

---

## Padrões Arquiteturais Utilizados

- MVC (Model-View-Controller): separação entre dados, lógica de negócio e rotas

- RESTful API: uso semântico dos métodos HTTP e comunicação via JSON

- JWT: autenticação segura e stateless

- Modularização por responsabilidade: separação clara entre controllers, models, routes, services, middleware e utils

- Repository Pattern (implícito): abstração do acesso aos dados via Mongoose

---

## Testes Automatizados

- Jest + Supertest: para testes unitários e de integração

- MongoMemoryServer: simula o banco em memória para testes confiáveis

- Testes cobrem:

- Cadastro e login de usuários

- CRUD de empreendimentos

- Proteção de rotas

- Integração com ViaCEP e OpenWeather

---

## Decisões Técnicas e Justificativas

- Node.js + Express: leve, popular e fácil de modularizar

- MongoDB: flexível para modelagem de dados

- JWT: autenticação segura sem sessões persistentes

- Arquitetura modular: facilita manutenção e evolução do sistema

- APIs públicas (ViaCEP e OpenWeather): enriquecem os dados sem sobrecarregar o backend

- Frontend com HTML, CSS e JS puro: garante responsividade e compatibilidade com dispositivos móveis

---

## Diagrama da Arquitetura

<img alt="gráfico de arquitetura" src="diagrama_arquitetura_api (1).png"/> <br>


**O diagrama representa a estrutura conceitual da aplicação, destacando:**

- Interação entre frontend e backend via requisições HTTP.

- Organização da API em controllers, models e services.

- Integração com MongoDB e APIs externas.

- Retorno de dados em formato JSON para o frontend.