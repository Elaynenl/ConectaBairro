# Exemplos de Estrutura de Dados (MongoDB)

Este documento explica os arquivos de exemplo disponíveis nesta pasta.  
Eles servem como referência da estrutura utilizada pela API, substituindo o arquivo `schema.sql` tendo em vista que o banco de dados utilizado na aplicação é o MongoDB.

---

## empreendimentos.json
Contém exemplos de documentos da coleção **Empreendimentos**.

### Campos principais:
- **_id** → Identificador único gerado pelo MongoDB.
- **nome** → Nome do empreendimento.
- **descricao** → Breve descrição do negócio.
- **telefone / email** → Contatos do empreendimento (opcionais).
- **palavrasChave** → Lista de palavras-chave para facilitar buscas.
- **endereco** → Objeto com CEP, rua, número, bairro, cidade, estado e complemento.
- **redesSociais** → Objeto com Instagram e WhatsApp (opcionais).
- **criadoPor** → ID do usuário que cadastrou o empreendimento.
- **cidadeNormalizada / bairroNormalizado / palavrasChaveNormalizadas** → Campos derivados para facilitar buscas.

---

## usuarios.json
Contém exemplos de documentos da coleção **Usuários**.

### Campos principais:
- **_id** → Identificador único gerado pelo MongoDB.
- **nome** → Nome do usuário.
- **email** → E-mail do usuário.
- **senhaHash** → Senha criptografada (não armazenar senha em texto puro).
- **role** → Papel do usuário (ex.: `empreendedor`, `admin`).
- **criadoEm** → Data de criação do cadastro.

---

## Observações
- Os arquivos `.json` **não são usados diretamente pelo banco**, apenas servem como documentação.  
- Eles mostram exemplos reais de como os dados são estruturados.  
- Essa pasta substitui o arquivo `schema.sql` pois o projeto utiliza MongoDB. 