# LevelUp Work - Plataforma Gamificada de Desenvolvimento Profissional

## 🔗 Links de Entrega e Acesso Rápido

Para facilitar a avaliação e o acesso ao projeto, utilize os links abaixo:

| Recurso | Descrição | Link |
| :--- | :--- | :--- |
| **Aplicação Publicada (Deploy)** | Acesso ao frontend em produção (Vercel, Netlify, etc.). | `[Link do Vercel]` |
| **Vídeo Explicativo (YouTube)** | Demonstração do protótipo, aplicação das Heurísticas de Nielsen e UX Writing. | `[Link do YouTube]` |
| **Repositório Git** | Código-fonte completo do projeto. | `[Link do Repositório Git]` |

---

## 💡 Sobre o Projeto

O **LevelUp Work** é uma plataforma web moderna e interativa desenvolvida como solução para a **Global Solution 2025/2** da FIAP, alinhada ao tema **"O Futuro do Trabalho"**. Nosso objetivo é transformar o aprendizado e o desenvolvimento corporativo em uma jornada gamificada, promovendo o engajamento contínuo dos colaboradores através de missões, desafios, recompensas e progressão de níveis.

A solução foca em:
*   **ODS 8 (Trabalho Decente e Crescimento Econômico):** Promovendo o *upskilling* e *reskilling* de forma motivadora.
*   **ODS 4 (Educação de Qualidade):** Oferecendo um ambiente de aprendizado contínuo e personalizado.

## ✨ Funcionalidades Chave

O projeto implementa uma série de funcionalidades para garantir uma experiência de usuário rica e engajadora:

| Categoria | Funcionalidade | Descrição |
| :--- | :--- | :--- |
| **Gamificação** | Sistema de XP e Níveis | Acúmulo de experiência ao completar desafios e progressão em um sistema de níveis. |
| | Badges e Conquistas | Desbloqueio de insígnias especiais ao atingir marcos de aprendizado. |
| **Interatividade** | Dashboard Interativo | Painel de controle para acompanhamento do progresso em tempo real. |
| | Animações Suaves | Transições e micro-interações elegantes utilizando **Framer Motion**. |
| **Gestão** | CRUD de Desafios | Funcionalidade completa para criar, ler, atualizar e deletar desafios personalizados (disponível para perfil Empresa). |
| | Filtros e Busca | Ferramentas avançadas para filtrar desafios por dificuldade, categoria e status. |
| **Design** | Tema Claro/Escuro | Alternância de tema com persistência de preferência via `localStorage`. |
| | Design Responsivo | Layout otimizado para **Mobile First**, garantindo usabilidade em qualquer dispositivo. |

## 🛠️ Stack Tecnológico (Frontend)

O projeto foi construído seguindo as diretrizes de arquitetura modular e Single Page Application (SPA), utilizando as seguintes tecnologias:

| Tecnologia | Versão | Tipo | Propósito |
| :--- | :--- | :--- | :--- |
| **React** | 19.2.0 | Framework | Construção da interface de usuário. |
| **TypeScript** | 5.9.3 | Linguagem | Tipagem estática para maior robustez e manutenibilidade. |
| **Vite** | 7.2.2 | Build Tool | Ambiente de desenvolvimento rápido e otimizado. |
| **Tailwind CSS** | 4.1.17 | Estilização | Framework CSS utilitário para design responsivo e rápido. |
| **React Router DOM** | 7.9.6 | Biblioteca | Gerenciamento de rotas e navegação SPA. |
| **Framer Motion** | 12.23.24 | Biblioteca | Animações e transições de interface. |
| **Lucide React** | 0.553.0 | Biblioteca | Conjunto de ícones vetoriais. |

## 🔌 Integração com Backend (API)

O frontend se comunica com uma API RESTful desenvolvida em Java, conforme o requisito da disciplina *Domain Drive Design Using Java*.

*   **URL Base da API:** `https://gs-java-2025-apirest.onrender.com`
*   **Estrutura de Comunicação:** O arquivo `src/services/api.ts` centraliza todas as chamadas, incluindo funções para autenticação (`loginAPI`, `cadastroAPI`) e gerenciamento de desafios (`desafiosAPI`, `desafiosUsuarioAPI`).
*   **Status:** A API está **publicada na nuvem** (Render) para garantir a comunicação em ambiente de produção.

## 🚀 Como Executar o Projeto Localmente

Para configurar e executar o projeto em seu ambiente de desenvolvimento, siga os passos abaixo:

### 1. Pré-requisitos

Certifique-se de ter instalado em sua máquina:
*   **Node.js** (versão 18 ou superior)
*   **npm** (o gerenciador de pacotes padrão)

### 2. Instalação

Clone o repositório e navegue até o diretório do projeto:

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd levelup-work
```

Instale as dependências:

```bash
npm install
```

### 3. Execução

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará acessível em `http://localhost:5173`.

### 4. Comandos Adicionais

| Comando | Descrição |
| :--- | :--- |
| `npm run build` | Gera a *build* de produção na pasta `dist/`. |
| `npm run preview` | Serve a *build* de produção localmente para testes. |
| `npm run lint` | Executa o linter para verificar a qualidade do código. |

## 📁 Estrutura de Diretórios

A arquitetura do projeto segue o padrão modular, facilitando a manutenção e a escalabilidade:

```
src/
├── assets/
│   └── react.svg
├── components/
│   ├── CardDesafio.tsx
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── ProgressBar.tsx
│   ├── ProtectedRoute.tsx
│   └── ThemeToggleButton.tsx
├── context/
│   └── ThemeContext.tsx
├── hooks/
│   └── useApi.ts
├── pages/
│   ├── Cadastro.tsx
│   ├── DashboardEmpresa.tsx
│   ├── DashboardUsuario.tsx
│   ├── Desafios.tsx
│   ├── FAQ.tsx
│   ├── Home.tsx
│   ├── Integrantes.tsx
│   └── Login.tsx
├── providers/
│   └── ThemeProvider.tsx
├── services/
│   └── api.ts
├── types/
│   └── index.ts
├── utils/
├── App.css
├── App.tsx
├── index.css
├── main.tsx
└── routes.tsx
```

## 👥 Integrantes do Time

| Nome Completo | RM | Papel Principal |
| :--- | :--- | :--- |
| Natan Freitas de Moraes | 564992 | Backend (JAVA) e ChatBot |
| Felype Ferreira Maschio | 563009 | Frontend (React/TS) e Banco de Dados |
| Fellipe Costa de Oliveira | 564673 | Análise de Dados (Python) e Business Intelligence |

## 📄 Licença

Este projeto foi desenvolvido exclusivamente para fins acadêmicos, como parte da **Global Solution 2025/2** da FIAP.

---

*Desenvolvido com foco em inovação e no futuro do trabalho.*
