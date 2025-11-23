# Documento de Requisitos do Sistema ConectaBairro

Este documento apresenta os requisitos implementados no sistema **ConectaBairro**. O objetivo é detalhar os **requisitos funcionais**, **não-funcionais**, **regras de negócio**, além de **histórias de usuário** e **perfis de usuários** que orientaram o desenvolvimento da aplicação. A especificação foi elaborada para garantir clareza, rastreabilidade e alinhamento com os objetivos do projeto.

---

## Sumário

- [Requisitos Funcionais](#requisitos-funcionais)
- [Requisitos Não-Funcionais](#requisitos-não-funcionais)
- [Regras de Negócio](#regras-de-negócio)
- [Histórias de usuário ou casos de uso](#histórias-de-usuário-ou-casos-de-uso)
- [Perfis de usuários](#perfis-de-usuários)

---

## Requisitos Funcionais

Os requisitos funcionais descrevem o comportamento do sistema e suas funcionalidades principais, todas já implementadas:

- **RF01**: O sistema permite o cadastro de usuários com nome, email e senha.
- **RF02**: O sistema valida a unicidade do email no momento do cadastro.
- **RF03**: O sistema permite o login de usuários e retorna um token JWT.
- **RF04**: O sistema protege rotas sensíveis, exigindo autenticação via token JWT.
- **RF05**: O sistema verifica se o usuário autenticado é o criador do empreendimento antes de permitir edição ou exclusão.
- **RF06**: O sistema permite o cadastro de empreendimentos com nome, descrição, endereço, telefone, email e palavras-chave.  
- **RF07**: O sistema integra-se à API ViaCEP para preencher automaticamente os campos de endereço com base no CEP informado.
- **RF08**: O sistema normaliza os campos cidade, bairro e palavrasChave para facilitar buscas.
- **RF09**: O sistema permite a edição parcial de qualquer campo do empreendimento.
- **RF10**: Ao editar o CEP, o sistema atualiza automaticamente os dados de endereço via API ViaCEP.
- **RF11**: O sistema valida os campos obrigatórios durante a edição.
- **RF12**: O sistema permite a listagem de todos os empreendimentos cadastrados.
- **RF13**: O sistema permite a busca por empreendimentos usando filtros como rua, bairro, cidade, estado, CEP ou palavras-chave.
- **RF14**: O sistema agrupa os empreendimentos por cidade e retorna os dados climáticos da cidade via API OpenWeatherMap. 
- **RF15**: O sistema permite que o criador de um empreendimento o exclua permanentemente.
<br>

## Requisitos Não-Funcionais

Os requisitos não funcionais definem critérios de qualidade, desempenho, segurança e arquitetura, todos já atendidos:

### Segurança

- **RNF01**: As senhas dos usuários são armazenadas de forma criptografada usando bcrypt.  
- **RNF02**: O sistema utiliza JWT para autenticação segura e stateless.  
- **RNF03**: O sistema valida o token JWT em todas as rotas protegidas.  

### Usabilidade

- **RNF04**: As mensagens de erro são claras e explicativas, especialmente em casos de validação.  
- **RNF05**: As respostas da API seguem um padrão consistente, com mensagens e dados agrupados.

### Manutenibilidade

- **RNF06**: O sistema segue a arquitetura MVC para facilitar manutenção e escalabilidade.  
- **RNF07**: O código está modularizado em controllers, models, routes, services e middlewares.

### Testabilidade

- **RNF08**: O sistema possui testes automatizados cobrindo o fluxo completo de autenticação e CRUD de empreendimentos.  
- **RNF09**: Os testes são executados em banco de dados em memória (MongoMemoryServer) para garantir isolamento.

---

## Regras de Negócio

As regras de negócio definem os comportamentos esperados e restrições que garantem a integridade e coerência do sistema.

- Um usuário só pode editar ou excluir empreendimentos que ele mesmo cadastrou.

- O campo de email é único para cada usuário.

- O campo CEP é validado e, quando possível, preenchido automaticamente via API ViaCEP.

- O sistema normaliza os campos cidade, bairro e palavrasChave para facilitar buscas.

- A autenticação via JWT é obrigatória para qualquer operação de cadastro, edição ou exclusão.

- Empreendimentos devem conter todos os campos obrigatórios para serem salvos ou atualizados.

- A exclusão de empreendimentos é permanente e só pode ser realizada pelo criador.

- A listagem de empreendimentos permite filtros por localização e palavras-chave.

- O clima exibido corresponde à cidade do empreendimento, via integração com OpenWeatherMap.

- O sistema impede que usuários não autenticados acessem rotas protegidas.

---

## Histórias de usuário ou casos de uso

As histórias de usuário representam situações reais de uso da plataforma, com foco nos objetivos e necessidades dos usuários.

## Morador

Como morador, posso buscar empreendimentos no meu bairro para encontrar serviços próximos sem precisar me deslocar para outras regiões.

## Empreendedor

Como empreendedor, posso cadastrar meu negócio na plataforma para divulgar meus produtos e serviços aos moradores da região.

## Usuário Autenticado

Como usuário autenticado, posso editar ou excluir meus empreendimentos para manter as informações sempre atualizadas.

## Usuário Curioso

Como usuário, posso visualizar o clima atual da cidade para decidir se saio para buscar um serviço presencial ou opto por contato remoto.

## Usuário Mobile

Como usuário em dispositivo móvel, posso acessar a plataforma com uma interface responsiva e intuitiva para consultar empreendimentos com facilidade.

---

## Perfis de usuários

A plataforma ConectaBairro contempla dois perfis principais de usuários, com permissões específicas:

### Público em geral

- Acesso público à listagem de empreendimentos

- Busca por localização ou palavras-chave

- Visualização de clima por cidade

- Não pode cadastrar, editar ou excluir empreendimentos

### Empreendedor

- Cadastro e autenticação via email e senha

- Criação, edição e exclusão de empreendimentos próprios

- Visualização de clima e endereço via APIs externas

- Proteção de dados via autenticação JWT

## Administrador (a ser implementado)

O perfil de administrador ainda será implementado em versões futuras da plataforma. Sua inclusão está prevista para permitir o gerenciamento centralizado de usuários e empreendimentos, além de oferecer funcionalidades administrativas como moderação de conteúdo, análise de dados e suporte à manutenção da plataforma. Essa decisão foi tomada para priorizar o desenvolvimento das funcionalidades essenciais voltadas aos moradores e empreendedores, garantindo uma base sólida antes da introdução de recursos administrativos.

---