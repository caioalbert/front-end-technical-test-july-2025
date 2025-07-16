![tecnical-test](https://github.com/user-attachments/assets/800b6db0-76c0-4b91-a76f-3e8e8b6cb9b3)
# 🧪 Desafio Técnico - Desenvolvedor Front-end Júnior

Bem-vindo(a) ao nosso teste técnico! Este desafio tem como objetivo avaliar suas habilidades práticas com **React + Next.js + React Query + Tailwind + React Hook Form + Zod**.

---

## 🎯 Objetivo

Criar uma interface de **listagem e criação de usuários**, consumindo uma API externa, com boas práticas de código, organização visual e simulação de um fluxo de cadastro.

---

## 📋 O que você deve fazer

Crie uma página acessível em `/users` com as seguintes funcionalidades:

### 1. 🔍 Listagem de usuários
- Buscar os usuários da API: [https://jsonplaceholder.typicode.com/users](https://jsonplaceholder.typicode.com/users)
- Exibir na tela:
  - **Nome**
  - **Email**
  - **Cidade**
- Usar **React Query** para buscar e armazenar os dados.
- Exibir mensagens de **carregando** e **erro** quando aplicável.

---

### 2. ➕ Formulário de novo usuário
- Adicionar um botão "**Novo usuário**" que abre um **modal** ou redireciona para a rota `/users/new`.
- Criar um formulário com os seguintes campos:
  - Nome (obrigatório)
  - Email (obrigatório, com validação de formato)
  - Cidade (opcional)
- Utilizar:
  - `react-hook-form` para gerenciar o formulário
  - `zod` para validação
- Ao enviar:
  - Simule a criação de usuário usando `queryClient.setQueryData` para atualizar a lista.
  - Não é necessário persistir os dados em um backend real.

---

### 3. 🎨 Estilização e UX
- Utilizar **TailwindCSS** para o layout e estilo dos componentes.
- Usar **ShadcnUI** para componentes acessíveis (ex: botão, modal, etc).
- Interface deve ser responsiva e acessível

---

## 💡 Extras (opcionais, para ir além)

Você pode ir além do básico com qualquer um dos itens abaixo (não obrigatório):
- Criar um campo de filtro na listagem por nome.
- Permitir editar um usuário existente (interface apenas).
- Faça o máximo de commits seguindo a semântica do gitflow(Conventional Commits)

---

## 📂 Como começar

1. Acesse o repositório base do desafio:  
   👉 [https://github.com/match-sales/front-end-techincal-test-july-2025](https://github.com/match-sales/front-end-technical-test-july-2025)

2. Faça um **fork** do repositório para a sua conta no GitHub.

3. Clone o repositório **do seu fork** para sua máquina:
```bash
git clone https://github.com/match-sales/front-end-techincal-test-july-2025.git
```
---

## 📦 Entrega

- Suba o código no GitHub em um repositório público.
- Crie um `README.md` com:
  - Instruções para rodar o projeto localmente (`npm install`, `npm run dev`, etc)
  - Prints ou descrição da funcionalidade
  - Explique seu processo de criação
- (Opcional) Faça o deploy no [Vercel](https://vercel.com/)

---

Boa sorte! Se tiver dúvidas de escopo, é melhor perguntar do que assumir, valorizamos a clareza! 🚀
