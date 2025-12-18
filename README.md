🧩 Tech Challenge Fase 4 — Mobile (Posts, Comentários e Autenticação)

O projeto tech-challenge-fase4-mobile é uma aplicação full-stack com foco em Mobile, composta por dois módulos principais:

Backend (api/) — API REST responsável por autenticação, regras de negócio, persistência e permissões.

Aplicativo Mobile (mobile/) — App desenvolvido em React Native + Expo, consumindo a API via HTTP.

O sistema implementa um ambiente educacional de postagens e comentários, com controle de acesso por níveis de usuário e autenticação via JWT.

⚙️ Tecnologias Utilizadas
Backend

Node.js + Express — API REST

MongoDB + Mongoose — persistência de dados

JWT — autenticação e autorização

Bcrypt — criptografia de senhas

Swagger (OpenAPI 3) — documentação da API

Docker & Docker Compose — ambiente isolado e reprodutível

Mobile

React Native

Expo

React Navigation

AsyncStorage — persistência de sessão

Expo Linear Gradient — UI e efeitos visuais

🧱 Arquitetura do Sistema

O backend segue o padrão MVC (Model–View–Controller), enquanto o mobile utiliza arquitetura componentizada por telas.

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

🧠 Fluxo Principal do Sistema

Usuário realiza login no app mobile.

API retorna um token JWT.

Token e dados do usuário são armazenados no AsyncStorage.

O app consome rotas protegidas da API.

As permissões (aluno, professor, admin) controlam as funcionalidades visíveis.

👤 Perfis de Usuário e Permissões
🎓 Aluno

Visualiza posts ativos

Comenta em posts

Edita/exclui apenas seus próprios comentários

👨‍🏫 Professor

Todas as permissões de aluno

Cria posts

Edita posts

Ativa/Inativa posts

Visualiza posts inativos

Exclui comentários

👑 Admin

Todas as permissões de professor

Gerencia usuários

Altera cargos (aluno / professor / admin)

Painel administrativo completo

👑 Usuário Admin Padrão

O sistema garante a existência de um usuário administrador padrão, válido em qualquer ambiente:

Email: admin@admin.com
Senha: admin
Cargo: admin


Esse usuário pode acessar todas as funcionalidades administrativas do app.

🌐 Endpoints da API (Resumo)
Grupo	Método	Endpoint	Descrição
Auth	POST	/auth/registrar	Registrar usuário
Auth	POST	/auth/login	Login e JWT
Usuários	GET	/usuarios	Listar usuários
Usuários	PATCH	/usuarios/{id}/cargo	Alterar cargo
Posts	GET	/posts	Listar posts ativos
Posts	GET	/posts/professor	Listar todos os posts
Posts	GET	/posts/{id}	Buscar post
Posts	POST	/posts	Criar post
Posts	PUT	/posts/{id}	Editar post
Posts	DELETE	/posts/{id}	Excluir post
Comentários	POST	/posts/{id}/comentarios	Criar comentário
Comentários	PUT	/posts/{postId}/comentarios/{comentarioId}	Editar comentário
Comentários	DELETE	/posts/{postId}/comentarios/{comentarioId}	Excluir comentário

📄 Documentação Swagger disponível em:

http://localhost:3000/api-docs

🐳 Como Executar o Backend (Docker)
Pré-requisitos

Docker

Docker Compose

Subir API + MongoDB
cd api
docker compose up --build


API: http://localhost:3000

Swagger: http://localhost:3000/api-docs

📱 Como Executar o App Mobile
Pré-requisitos

Node.js

Expo CLI

Android Studio (emulador) ou dispositivo físico

Instalação
cd mobile
npm install

Executar
npx expo start


Pressione a para abrir no emulador Android

Ou use Expo Go no celular

⚠️ Importante (Android Emulator):
O app acessa a API via:

http://10.0.2.2:3000

🎨 Interface e Tema

UI padronizada com tema centralizado

Gradiente de fundo em cinza

Rosa para ações principais

Verde para ações positivas

Vermelho para ações destrutivas

Cores centralizadas em:

mobile/src/theme/colors.js

🔐 Segurança

Senhas criptografadas com bcrypt

JWT com expiração

Rotas protegidas no backend

Controle de permissões no backend e no app
