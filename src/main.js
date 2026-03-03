const { invoke } = window.__TAURI__.core;

// --- ELEMENTOS DA TELA ---
const loginScreen = document.querySelector("#login-screen");
const dashboardScreen = document.querySelector("#dashboard-screen");
const unlockBtn = document.querySelector("#unlock-btn");
const passwordInput = document.querySelector("#master-password");
const errorMsg = document.querySelector("#error-msg");

const lockBtn = document.querySelector("#lock-btn");
const showAddFormBtn = document.querySelector("#show-add-form-btn");
const addPasswordForm = document.querySelector("#add-password-form");
const cancelBtn = document.querySelector("#cancel-btn");
const saveBtn = document.querySelector("#save-btn");
const passwordListContainer = document.querySelector("#password-list");

const newTitle = document.querySelector("#new-title");
const newUser = document.querySelector("#new-user");
const newPass = document.querySelector("#new-pass");
const generateBtn = document.querySelector("#generate-btn"); 
const toggleVisibilityBtn = document.querySelector("#toggle-visibility-btn"); 
const searchInput = document.querySelector("#search-input"); // NOVO: Captura a barra de busca

const strengthContainer = document.querySelector("#strength-container");
const strengthBar = document.querySelector("#strength-bar");
const strengthText = document.querySelector("#strength-text");

// --- VARIÁVEIS NA MEMÓRIA ---
let minhasSenhas = [];
let senhaMestraAtual = ""; 
let indiceEmEdicao = -1; 
let termoDeBusca = ""; // NOVO: Armazena o que está sendo digitado na busca

// --- FUNÇÕES DE ANIMAÇÃO ---
function animarSaida(elemento, callback) {
  elemento.classList.add("animate-out");
  setTimeout(() => {
    elemento.classList.add("hidden");
    elemento.classList.remove("animate-out");
    if (callback) callback();
  }, 300); 
}

function animarEntrada(elemento) {
  elemento.classList.remove("hidden");
  elemento.classList.add("animate-in");
  setTimeout(() => {
    elemento.classList.remove("animate-in");
  }, 300);
}

// --- COMUNICAÇÃO COM O RUST ---
async function carregarDadosDoHD(senha) {
  try {
    const dadosEmTexto = await invoke('ler_cofre', { senhaMestra: senha });
    minhasSenhas = JSON.parse(dadosEmTexto);
    renderizarSenhas();
    return true; 
  } catch (erro) {
    return false; 
  }
}

async function salvarDadosNoHD() {
  try {
    const dadosEmTexto = JSON.stringify(minhasSenhas);
    await invoke('salvar_cofre', { dados: dadosEmTexto, senhaMestra: senhaMestraAtual }); 
  } catch (erro) {
    console.error("Erro ao salvar o cofre:", erro);
  }
}

// --- LÓGICA DE LOGIN ---
unlockBtn.addEventListener("click", async () => {
  const senhaDigitada = passwordInput.value;
  if (!senhaDigitada) return; 

  unlockBtn.textContent = "Abrindo...";
  errorMsg.classList.add("hidden");
  
  const acessoPermitido = await carregarDadosDoHD(senhaDigitada);
  
  if (acessoPermitido) {
    senhaMestraAtual = senhaDigitada; 
    setTimeout(() => {
        animarSaida(loginScreen, () => {
            animarEntrada(dashboardScreen);
        });
        unlockBtn.textContent = "Desbloquear";
        passwordInput.value = ""; 
    }, 600);
  } else {
    unlockBtn.textContent = "Desbloquear";
    errorMsg.classList.remove("hidden");
    passwordInput.value = "";
    passwordInput.focus();
  }
});

lockBtn.addEventListener("click", () => {
  animarSaida(dashboardScreen, () => {
      animarEntrada(loginScreen);
  });
  errorMsg.classList.add("hidden");
  
  minhasSenhas = []; 
  senhaMestraAtual = ""; 
  indiceEmEdicao = -1;
  termoDeBusca = ""; // Limpa a busca ao sair
  searchInput.value = ""; 
  limparFormulario();
});

// --- LÓGICA DO DASHBOARD ---
showAddFormBtn.addEventListener("click", () => {
  indiceEmEdicao = -1; 
  saveBtn.textContent = "Salvar";
  showAddFormBtn.classList.add("hidden");
  animarEntrada(addPasswordForm);
});

cancelBtn.addEventListener("click", () => {
  animarSaida(addPasswordForm, () => {
      showAddFormBtn.classList.remove("hidden");
  });
  limparFormulario();
});

// --- NOVO: LÓGICA DA BARRA DE PESQUISA ---
searchInput.addEventListener("input", (e) => {
  termoDeBusca = e.target.value.toLowerCase(); // Guarda o termo sempre em letras minúsculas
  renderizarSenhas(); // Manda desenhar a lista de novo
});

toggleVisibilityBtn.addEventListener("click", () => {
  if (newPass.type === "password") {
    newPass.type = "text";
    toggleVisibilityBtn.textContent = "🙈"; 
  } else {
    newPass.type = "password";
    toggleVisibilityBtn.textContent = "👁️";
  }
});

// --- LÓGICA DO MEDIDOR DE FORÇA ---
function avaliarForcaSenha(senha) {
  let forca = 0;
  if (senha.length >= 8) forca += 1; 
  if (senha.length >= 12) forca += 1; 
  if (/[A-Z]/.test(senha)) forca += 1; 
  if (/[0-9]/.test(senha)) forca += 1; 
  if (/[^A-Za-z0-9]/.test(senha)) forca += 1; 
  return forca; 
}

newPass.addEventListener("input", (e) => {
  const senha = e.target.value;
  
  if (senha.length > 0) {
    strengthContainer.classList.remove("hidden");
    strengthText.classList.remove("hidden");
    
    const forca = avaliarForcaSenha(senha);
    let percentual = (forca / 5) * 100;
    if (percentual === 0) percentual = 10; 

    strengthBar.style.width = `${percentual}%`;
    strengthBar.className = "strength-meter-bar"; 
    
    if (forca <= 2) {
      strengthBar.classList.add("strength-weak");
      strengthText.textContent = "Crítico: Senha Fraca";
      strengthText.style.color = "#ff4d4d";
    } else if (forca === 3 || forca === 4) {
      strengthBar.classList.add("strength-medium");
      strengthText.textContent = "Atenção: Senha Média";
      strengthText.style.color = "#f39c12";
    } else {
      strengthBar.classList.add("strength-epic");
      strengthText.textContent = "Seguro: Senha Impecável";
      strengthText.style.color = "var(--neon-roxo)";
    }
  } else {
    strengthContainer.classList.add("hidden");
    strengthText.classList.add("hidden");
  }
});

// --- LÓGICA DO GERADOR DE SENHAS ---
generateBtn.addEventListener("click", () => {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~|}{[]:;?><,./-=";
  let senhaGerada = "";
  const tamanhoSenha = 16;
  
  const valoresAleatorios = new Uint32Array(tamanhoSenha);
  window.crypto.getRandomValues(valoresAleatorios);
  
  for (let i = 0; i < tamanhoSenha; i++) {
    senhaGerada += caracteres[valoresAleatorios[i] % caracteres.length];
  }
  
  newPass.value = senhaGerada;
  newPass.dispatchEvent(new Event('input')); 
  
  const iconeOriginal = generateBtn.textContent;
  generateBtn.textContent = "✨";
  setTimeout(() => generateBtn.textContent = iconeOriginal, 500);
});

// --- SALVAR SENHA E RENDERIZAR LISTA ---
saveBtn.addEventListener("click", async () => {
  if (newTitle.value === "" || newPass.value === "") {
    alert("Por favor, preencha pelo menos o Título e a Senha!");
    return;
  }

  if (indiceEmEdicao === -1) {
    minhasSenhas.push({
      titulo: newTitle.value,
      usuario: newUser.value,
      senha: newPass.value
    });
  } else {
    minhasSenhas[indiceEmEdicao] = {
      titulo: newTitle.value,
      usuario: newUser.value,
      senha: newPass.value
    };
  }

  await salvarDadosNoHD();
  
  // Limpa a busca ao salvar algo novo
  termoDeBusca = ""; 
  searchInput.value = "";
  renderizarSenhas();
  
  animarSaida(addPasswordForm, () => {
      showAddFormBtn.classList.remove("hidden");
  });
  
  limparFormulario();
  indiceEmEdicao = -1;
  saveBtn.textContent = "Salvar";
});

function limparFormulario() {
  newTitle.value = "";
  newUser.value = "";
  newPass.value = "";
  strengthContainer.classList.add("hidden");
  strengthText.classList.add("hidden");
  newPass.type = "password";
  toggleVisibilityBtn.textContent = "👁️";
}

// --- ATUALIZADO: RENDERIZAR COM FILTRO ---
function renderizarSenhas() {
  passwordListContainer.innerHTML = ""; 

  // Filtra as senhas antes de desenhar na tela
  const senhasFiltradas = minhasSenhas.filter(item => {
    // Procura o termo tanto no Título quanto no Usuário
    const tituloMatch = item.titulo.toLowerCase().includes(termoDeBusca);
    const usuarioMatch = item.usuario && item.usuario.toLowerCase().includes(termoDeBusca);
    return tituloMatch || usuarioMatch;
  });

  if (senhasFiltradas.length === 0) {
    if (minhasSenhas.length === 0) {
        passwordListContainer.innerHTML = "<p>Nenhuma senha salva ainda.</p>";
    } else {
        passwordListContainer.innerHTML = "<p>Nenhuma senha encontrada na busca.</p>";
    }
    return;
  }

  senhasFiltradas.forEach((item) => {
    // O grande truque: Precisamos pegar o índice ORIGINAL da lista "minhasSenhas"
    // para não deletar a senha errada quando estivermos usando a lista filtrada.
    const indexOriginal = minhasSenhas.indexOf(item);

    const div = document.createElement("div");
    div.classList.add("password-item");
    div.classList.add("animate-in");

    div.innerHTML = `
      <div class="password-info">
        <strong>${item.titulo}</strong>
        <span>${item.usuario || 'Sem usuário'}</span>
      </div>
      <div class="action-buttons">
        <button class="btn-small btn-success copy-btn" data-senha="${item.senha}">Copiar</button>
        <button class="btn-small btn-edit edit-btn" data-index="${indexOriginal}">✏️</button>
        <button class="btn-small btn-danger delete-btn" data-index="${indexOriginal}">🗑️</button>
      </div>
    `;

    passwordListContainer.appendChild(div);
  });

  const copyButtons = document.querySelectorAll(".copy-btn");
  copyButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const senhaParaCopiar = e.target.getAttribute("data-senha");
      navigator.clipboard.writeText(senhaParaCopiar); 
      e.target.textContent = "Copiado!";
      setTimeout(() => e.target.textContent = "Copiar", 1500);
    });
  });

  const editButtons = document.querySelectorAll(".edit-btn");
  editButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      indiceEmEdicao = index; 
      
      const item = minhasSenhas[index];
      newTitle.value = item.titulo;
      newUser.value = item.usuario;
      newPass.value = item.senha;
      newPass.dispatchEvent(new Event('input'));
      
      showAddFormBtn.classList.add("hidden");
      animarEntrada(addPasswordForm);
      saveBtn.textContent = "Atualizar";
    });
  });

  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach(btn => {
    btn.addEventListener("click", async (e) => {
      if(confirm("Tem certeza que deseja excluir esta senha? Essa ação não pode ser desfeita.")) {
        const index = e.target.getAttribute("data-index");
        minhasSenhas.splice(index, 1); 
        await salvarDadosNoHD(); 
        renderizarSenhas(); 
      }
    });
  });
}