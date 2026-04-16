# 🔐 Meu Cofre - Gerenciador de Senhas Desktop

![Tauri](https://img.shields.io/badge/Tauri-FFC131?style=for-the-badge&logo=Tauri&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

Um aplicativo desktop, rápido e seguro para gerenciamento de senhas locais. garantindo que seus dados nunca saiam da sua máquina sem a devida criptografia.

> ⚠️ **Nota:** Este é um projeto de portfólio com foco em segurança da informação, manipulação de I/O em Rust e desenvolvimento de interfaces desktop com tecnologias web nativas.

## ✨ Funcionalidades Principais

* **🔒 Criptografia:** Todas as senhas são criptografadas localmente utilizando o algoritmo **AES-256** antes de serem salvas no disco rígido.
* **🎲 Gerador de Senhas:** Criação de strings criptograficamente seguras utilizando a API nativa `window.crypto`.
* **📊 Medidor de Força da Senha:** Feedback visual que avalia a complexidade da senha conforme ela é digitada.
* **🔍 Busca Instantânea:** Filtro para encontrar rapidamente credenciais específicas por título ou usuário.
* **👁️ Visibilidade Alternável:** Opção de ocultar/revelar a senha durante a criação ou edição.
* **📋 Cópia Rápida:** Botões de ação rápida para copiar senhas diretamente para a área de transferência do sistema operacional.
* **🎨 UI/UX Polida:** Interface responsiva com animações suaves e design neon imersivo.

## 🛠️ Tecnologias Utilizadas

A arquitetura do projeto foi dividida para extrair o melhor de dois mundos: a flexibilidade da Web e a performance/segurança de linguagens compiladas.

* **Frontend (Interface & Lógica UI):** HTML5, CSS3 puro (com variáveis e animações `@keyframes`) e Vanilla JavaScript (ES6+). Nenhuma biblioteca ou framework de terceiros foi utilizado para a UI, garantindo leveza extrema.
* **Backend (Motor & Segurança):** [Tauri](https://tauri.app/) e **Rust**. O Rust gerencia o I/O do sistema operacional e utiliza a *crate* `magic-crypt` para as operações de encriptação/decriptação AES-256.

## 🚀 Como Usar (Para Usuários)

Se você deseja apenas usar o aplicativo no seu dia a dia:

1. Acesse a aba [Releases](../../releases) deste repositório.
2. Baixe a versão mais recente do arquivo `.exe` (ex: `gerenciador-de-senhas_1.1.0_x64_en-US.setup.exe`).
3. Instale no seu Windows e defina sua Senha Mestra no primeiro acesso.
4. **Importante:** Não esqueça sua Senha Mestra. Sem ela, é matematicamente impossível recuperar os dados salvos.

## 💻 Como Rodar Localmente (Para Desenvolvedores)

Se você deseja clonar o projeto para estudar o código ou contribuir:

### Pré-requisitos
* [Node.js](https://nodejs.org/) (Para o gerenciamento de pacotes web)
* [Rust](https://www.rust-lang.org/) (Para compilar o backend do Tauri)
* Ferramentas de compilação C++ (Build Tools for Visual Studio, no caso do Windows)

### Instalação

1. Clone este repositório:
   ```bash
   git clone [https://github.com/AngeloJR-web/gerenciador-de-senhas.git](https://github.com/AngeloJR-web/gerenciador-de-senhas.git)

2. Entre na pasta do projeto:
   ```bash
   cd Gerenciador De Senhas

3. Instale as dependências do Node:
   ```bash
   npm install

4. Rode o aplicativo em modo de desenvolvimento (com Hot Reload):
   ```bash
   npm run tauri dev

Gerando o Executável (Build)
Para compilar a versão final otimizada para o sistema operacional:
   ```bash
   npm run tauri build

O instalador será gerado na pasta src-tauri/target/release/bundle/nsis/.

👨‍💻 Autor
Desenvolvido por Angelo De Oliveira Junior.
