# 🧩 Tech Challenge Fase 4 — Mobile (Posts, Comentários e Autenticação)

O projeto **tech-challenge-fase4-mobile** é uma aplicação **full-stack com foco em Mobile**, composta por dois módulos principais:

- **Backend (`api/`)** — API REST responsável por autenticação, regras de negócio, persistência e permissões.
- **Aplicativo Mobile (`mobile/`)** — App desenvolvido em **React Native + Expo**, consumindo a API via HTTP.

O sistema implementa um **ambiente educacional de postagens e comentários**, com controle de acesso por **níveis de usuário** e autenticação via **JWT**.

---

## ⚙️ Tecnologias Utilizadas

### 🔙 Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT (autenticação e autorização)
- Bcrypt (criptografia de senhas)
- Swagger (OpenAPI 3)
- Docker & Docker Compose

### 📱 Mobile
- React Native
- Expo
- React Navigation
- AsyncStorage
- Expo Linear Gradient

---

## 🧱 Arquitetura do Sistema

O backend segue o padrão **MVC (Model–View–Controller)**, enquanto o mobile utiliza arquitetura **componentizada por telas**.

```bash
tech-challenge-fase4/
├── api/                     # Backend (Node.js + Express + MongoDB)
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── swagger.js
│   │   └── ...
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── app.js
│   └── server.js
│
└── mobile/                  # App Mobile (React Native + Expo)
    ├── src/
    │   ├── screens/
    │   ├── components/
    │   ├── navigation/
    │   ├── theme/
    │   └── services/
    ├── assets/
    ├── app.json
    └── App.js
```

---

## 🧠 Fluxo Principal

1. Usuário realiza login pelo aplicativo mobile.
2. O backend autentica o usuário e retorna um token JWT.
3. O token e os dados do usuário são armazenados no AsyncStorage.
4. O app consome rotas protegidas da API.
5. As permissões determinam as funcionalidades disponíveis no sistema.

---

## 🌐 Endpoints da API

| Grupo | Método | Endpoint | Descrição |
|--------|---------|-----------|------------|
| **Autenticação** | POST | `/auth/registrar` | Registra novo usuário |
| **Autenticação** | POST | `/auth/login` | Login e geração de token JWT |
| **Posts** | GET | `/posts/busca` | Lista posts com filtro |
| **Posts** | GET | `/posts` | Lista posts ativos |
| **Posts** | GET | `/posts/professor` | Lista todos os posts (modo professor) |
| **Posts** | GET | `/posts/{id}` | Busca post por ID |
| **Posts** | POST | `/posts` | Cria novo post |
| **Posts** | PUT | `/posts/{id}` | Atualiza post existente |
| **Posts** | DELETE | `/posts/{id}` | Exclui post |
| **Comentários** | GET | `/posts/{id}/comentarios` | Lista comentários de um post |
| **Comentários** | POST | `/posts/{id}/comentarios` | Adiciona comentário |
| **Comentários** | PUT | `/posts/{postId}/comentarios/{comentarioId}` | Edita comentário existente |
| **Comentários** | DELETE | `/posts/{postId}/comentarios/{comentarioId}` | Exclui comentário |

---

## 👤 Perfis de Usuário e Permissões

### 🎓 Aluno
- Visualiza posts ativos
- Comenta em posts
- Edita e exclui apenas seus próprios comentários

### 👨‍🏫 Professor
- Todas as permissões de aluno
- Cria posts
- Edita posts
- Ativa/Inativa posts
- Visualiza posts inativos
- Exclui comentários

### 👑 Admin
- Todas as permissões de professor
- Gerencia usuários
- Altera cargos (aluno / professor / admin)
- Acesso ao painel administrativo completo

---

## 👑 Usuário Admin Padrão

O sistema garante a existência de um usuário administrador padrão, independente do ambiente onde o projeto for executado:
  ```txt
    Email: admin@admin.com
    Senha: admin
    Cargo: admin
  ```

---

## 🐳 Como Executar o Backend

Pré-requisitos

- Docker
- Docker Compose

Subir API + MongoDB
  ```bash
    cd api
    docker compose up --build
  ```
- API: http://localhost:3000
- Swagger: http://localhost:3000/api-docs

---

## 📱 Como Executar o App Mobile

Pré-requisitos

- Node.js
- Expo CLI
- Android Studio (emulador) ou dispositivo físico

Instalação
  ```bash
    cd mobile
    npm install
  ```
Executar
  ```powershell
    npx expo start
  ```
- Pressione a para abrir no emulador Android
- Ou utilize o Expo Go no celular

---

## 🎨 Interface e Tema

- Interface moderna inspirada em aplicações web
- Gradiente de fundo em tons de cinza
- Rosa para ações principais
- Verde para ações positivas
- Vermelho para ações destrutivas

As cores estão centralizadas em:
`mobile/src/theme/colors.js`

---

## 🔐 Segurança

- Senhas criptografadas com bcrypt
- Autenticação via JWT
- Controle de permissões no backend e no app
- Rotas protegidas por middleware

---

🚀 **Tech Challenge — Fase 4 (Full Stack Development)**  
🗓️ **2025**
