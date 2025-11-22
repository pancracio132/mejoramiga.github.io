const save = (k,v)=> localStorage.setItem(k,JSON.stringify(v));
const load = (k,def)=> JSON.parse(localStorage.getItem(k)) ?? def;

const editBtn = document.getElementById('editBtn');
const aboutText = document.getElementById('aboutText');
const friendName = document.getElementById('friendName');
const avatarImg = document.getElementById('avatarImg');
const gallery = document.getElementById('gallery');
const imgUrl = document.getElementById('imgUrl');
const addImg = document.getElementById('addImg');
const messagesEl = document.getElementById('messages');
const sendMsg = document.getElementById('sendMsg');
const author = document.getElementById('author');
const msg = document.getElementById('msg');
const clearMsgs = document.getElementById('clearMsgs');
const colorInput = document.getElementById('colorInput');
const applyStyle = document.getElementById('applyStyle');
const nameInput = document.getElementById('nameInput');
const resetBtn = document.getElementById('resetBtn');
const printBtn = document.getElementById('printBtn');

let state = load("bestfriend.page", { gallery: [], messages: [] });

function addThumb(src){
  const d = document.createElement("div");
  d.className = "thumb";
  const i = document.createElement("img");
  i.src = src;
  i.onclick = ()=> window.open(src);
  d.appendChild(i);
  gallery.appendChild(d);
}

function renderMessage(m){
  const el = document.createElement("div");
  el.className = "message";
  el.innerHTML = `
    <strong>${m.author}</strong><br>
    ${m.text}
    <div class="meta">${new Date(m.ts).toLocaleString()}</div>
  `;
  messagesEl.prepend(el);
}

if(state.gallery.length){
  gallery.innerHTML = "";
  state.gallery.forEach(src=> addThumb(src));
}

if(state.messages.length){
  state.messages.forEach(m=> renderMessage(m));
}

aboutText.textContent = state.about || aboutText.textContent;
friendName.textContent = state.name || friendName.textContent;
document.documentElement.style.setProperty('--accent', state.color || "#ff6fa3");

addImg.onclick = ()=>{
  const url = imgUrl.value.trim();
  if(!url) return alert("Ingresa una URL");
  addThumb(url);
  state.gallery.push(url);
  save("bestfriend.page", state);
  imgUrl.value = "";
};

sendMsg.onclick = ()=>{
  const m = {
    author: author.value.trim() || "Alguien",
    text: msg.value.trim(),
    ts: Date.now()
  };
  if(!m.text) return;
  renderMessage(m);
  state.messages.push(m);
  save("bestfriend.page", state);
  msg.value = "";
};

clearMsgs.onclick = ()=>{
  if(confirm("¿Borrar todos los mensajes?")){
    state.messages = [];
    messagesEl.innerHTML = "";
    save("bestfriend.page", state);
  }
};

editBtn.onclick = ()=>{
  const ed = !aboutText.isContentEditable;
  aboutText.contentEditable = ed;
  editBtn.textContent = ed ? "Guardar" : "Editar";
  if(!ed){
    state.about = aboutText.textContent;
    save("bestfriend.page", state);
  }
};

applyStyle.onclick = ()=>{
  const c = colorInput.value;
  document.documentElement.style.setProperty('--accent', c);
  state.color = c;

  if(nameInput.value.trim()){
    friendName.textContent = nameInput.value.trim();
    state.name = nameInput.value.trim();
  }

  save("bestfriend.page", state);
};

resetBtn.onclick = ()=>{
  if(confirm("¿Restablecer todo?")){
    localStorage.removeItem("bestfriend.page");
    location.reload();
  }
};

printBtn.onclick = ()=> window.print();

avatarImg.onclick = ()=>{
  const url = prompt("Pega una URL para la foto:");
  if(url){
    avatarImg.src = url;
    state.avatar = url;
    save("bestfriend.page", state);
  }
};
