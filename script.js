const FORMATIONS = {
  "4-4-2": [
    {x:50,y:92,pos:"GOL"},
    {x:15,y:75,pos:"LD"},{x:38,y:78,pos:"ZAG"},{x:62,y:78,pos:"ZAG"},{x:85,y:75,pos:"LE"},
    {x:15,y:50,pos:"MD"},{x:38,y:52,pos:"MC"},{x:62,y:52,pos:"MC"},{x:85,y:50,pos:"ME"},
    {x:38,y:20,pos:"ATA"},{x:62,y:20,pos:"ATA"}
  ],
  "4-3-3": [
    {x:50,y:92,pos:"GOL"},
    {x:15,y:75,pos:"LD"},{x:38,y:78,pos:"ZAG"},{x:62,y:78,pos:"ZAG"},{x:85,y:75,pos:"LE"},
    {x:30,y:52,pos:"MC"},{x:50,y:55,pos:"VOL"},{x:70,y:52,pos:"MC"},
    {x:20,y:20,pos:"PE"},{x:50,y:15,pos:"ATA"},{x:80,y:20,pos:"PD"}
  ],
  "3-5-2": [
    {x:50,y:92,pos:"GOL"},
    {x:25,y:76,pos:"ZAG"},{x:50,y:80,pos:"ZAG"},{x:75,y:76,pos:"ZAG"},
    {x:10,y:52,pos:"LD"},{x:32,y:55,pos:"MC"},{x:50,y:58,pos:"VOL"},{x:68,y:55,pos:"MC"},{x:90,y:52,pos:"LE"},
    {x:38,y:20,pos:"ATA"},{x:62,y:20,pos:"ATA"}
  ],
  "4-2-3-1": [
    {x:50,y:92,pos:"GOL"},
    {x:15,y:75,pos:"LD"},{x:38,y:78,pos:"ZAG"},{x:62,y:78,pos:"ZAG"},{x:85,y:75,pos:"LE"},
    {x:38,y:60,pos:"VOL"},{x:62,y:60,pos:"VOL"},
    {x:20,y:38,pos:"MEI"},{x:50,y:40,pos:"MEI"},{x:80,y:38,pos:"MEI"},
    {x:50,y:15,pos:"ATA"}
  ],
  "3-4-3": [
    {x:50,y:92,pos:"GOL"},
    {x:25,y:76,pos:"ZAG"},{x:50,y:80,pos:"ZAG"},{x:75,y:76,pos:"ZAG"},
    {x:12,y:52,pos:"ME"},{x:38,y:55,pos:"MC"},{x:62,y:55,pos:"MC"},{x:88,y:52,pos:"MD"},
    {x:20,y:20,pos:"PE"},{x:50,y:15,pos:"ATA"},{x:80,y:20,pos:"PD"}
  ],
  "5-3-2": [
    {x:50,y:92,pos:"GOL"},
    {x:8,y:70,pos:"LD"},{x:28,y:78,pos:"ZAG"},{x:50,y:80,pos:"ZAG"},{x:72,y:78,pos:"ZAG"},{x:92,y:70,pos:"LE"},
    {x:30,y:52,pos:"MC"},{x:50,y:55,pos:"VOL"},{x:70,y:52,pos:"MC"},
    {x:38,y:20,pos:"ATA"},{x:62,y:20,pos:"ATA"}
  ]
};

let players = [];
let benchPlayers = [];
let idCounter = 0;
let editingId = null;

const fieldEl = document.getElementById('field');
const benchEl = document.getElementById('bench');
const formationSelect = document.getElementById('formation');
const kitColorInput = document.getElementById('kitColor');
const borderColorInput = document.getElementById('borderColor');
const teamNameInput = document.getElementById('teamName');
const teamTitle = document.getElementById('teamTitle');

function newPlayer(pos, x, y, number) {
  idCounter++;
  return { id: idCounter, name: pos, number: number, pos, x, y };
}

function buildFormation(key) {
  const layout = FORMATIONS[key];
  players = layout.map((slot, i) => newPlayer(slot.pos, slot.x, slot.y, i + 1));
  benchPlayers = [1,2,3,4,5].map((n) => {
    idCounter++;
    return { id: idCounter, name: "Reserva", number: 10 + n, pos: "RES" };
  });
  render();
}

function render() {
  document.querySelectorAll('.player').forEach(el => el.remove());
  players.forEach(p => fieldEl.appendChild(renderPlayerOnField(p)));
  benchEl.innerHTML = '';
  benchPlayers.forEach(p => benchEl.appendChild(renderBenchPlayer(p)));
  applyBorderColor();
}

function shirtStyle() {
  return `background:${kitColorInput.value};`;
}

function applyBorderColor() {
  const color = borderColorInput.value;
  document.querySelectorAll('.field-line').forEach(el => {
    el.style.borderColor = color;
  });
}

function renderPlayerOnField(p) {
  const div = document.createElement('div');
  div.className = 'player';
  div.style.left = p.x + '%';
  div.style.top = p.y + '%';
  div.draggable = true;
  div.dataset.id = p.id;
  div.innerHTML = `
    <div class="shirt" style="${shirtStyle()}">${p.number}</div>
    <div class="player-name">${p.name}</div>
  `;
  div.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id: p.id, from: 'field' }));
    div.classList.add('dragging');
  });
  div.addEventListener('dragend', () => div.classList.remove('dragging'));
  div.addEventListener('dblclick', () => openEdit(p.id, 'field'));
  return div;
}

function renderBenchPlayer(p) {
  const div = document.createElement('div');
  div.className = 'bench-player';
  div.draggable = true;
  div.dataset.id = p.id;
  div.innerHTML = `
    <div class="shirt" style="${shirtStyle()}">${p.number}</div>
    <span>${p.name} (${p.pos})</span>
  `;
  div.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id: p.id, from: 'bench' }));
  });
  div.addEventListener('dblclick', () => openEdit(p.id, 'bench'));
  return div;
}

fieldEl.addEventListener('dragover', (e) => {
  e.preventDefault();
  fieldEl.classList.add('drag-over');
});
fieldEl.addEventListener('dragleave', () => fieldEl.classList.remove('drag-over'));

fieldEl.addEventListener('drop', (e) => {
  e.preventDefault();
  fieldEl.classList.remove('drag-over');
  const data = JSON.parse(e.dataTransfer.getData('text/plain'));
  const rect = fieldEl.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;

  if (data.from === 'field') {
    const p = players.find(pl => pl.id === data.id);
    if (p) { p.x = clamp(x); p.y = clamp(y); }
  } else if (data.from === 'bench') {
    const idx = benchPlayers.findIndex(pl => pl.id === data.id);
    if (idx !== -1) {
      const p = benchPlayers[idx];
      benchPlayers.splice(idx, 1);
      players.push({ ...p, x: clamp(x), y: clamp(y) });
    }
  }
  render();
});

benchEl.addEventListener('dragover', (e) => e.preventDefault());
benchEl.addEventListener('drop', (e) => {
  e.preventDefault();
  const data = JSON.parse(e.dataTransfer.getData('text/plain'));
  if (data.from === 'field') {
    const idx = players.findIndex(pl => pl.id === data.id);
    if (idx !== -1) {
      const p = players[idx];
      players.splice(idx, 1);
      benchPlayers.push(p);
      render();
    }
  }
});

function clamp(v) { return Math.max(4, Math.min(96, v)); }

function openEdit(id, from) {
  editingId = { id, from };
  const list = from === 'field' ? players : benchPlayers;
  const p = list.find(pl => pl.id === id);
  document.getElementById('editName').value = p.name;
  document.getElementById('editNumber').value = p.number;
  document.getElementById('editModal').classList.remove('hidden');
}

document.getElementById('saveEdit').addEventListener('click', () => {
  const list = editingId.from === 'field' ? players : benchPlayers;
  const p = list.find(pl => pl.id === editingId.id);
  p.name = document.getElementById('editName').value || p.name;
  p.number = parseInt(document.getElementById('editNumber').value) || p.number;
  document.getElementById('editModal').classList.add('hidden');
  render();
});

document.getElementById('cancelEdit').addEventListener('click', () => {
  document.getElementById('editModal').classList.add('hidden');
});

formationSelect.addEventListener('change', () => buildFormation(formationSelect.value));
kitColorInput.addEventListener('input', render);
borderColorInput.addEventListener('input', applyBorderColor);
teamNameInput.addEventListener('input', () => teamTitle.textContent = teamNameInput.value);

document.getElementById('resetBtn').addEventListener('click', () => buildFormation(formationSelect.value));

document.getElementById('exportImgBtn').addEventListener('click', () => {
  html2canvas(document.getElementById('capture-area'), { backgroundColor: '#10141c', scale: 2 }).then(canvas => {
    const link = document.createElement('a');
    link.download = 'escalacao.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
});

document.getElementById('saveFileBtn').addEventListener('click', () => {
  const data = {
    teamName: teamNameInput.value,
    formation: formationSelect.value,
    kitColor: kitColorInput.value,
    borderColor: borderColorInput.value,
    players,
    benchPlayers,
    savedAt: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeName = (teamNameInput.value || 'time').trim().replace(/\s+/g, '_');
  link.download = `escalacao_${safeName}.json`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
});

document.getElementById('loadFileBtn').addEventListener('click', () => {
  document.getElementById('loadFileInput').click();
});

document.getElementById('loadFileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const data = JSON.parse(ev.target.result);
      teamNameInput.value = data.teamName || 'Meu Time';
      teamTitle.textContent = teamNameInput.value;
      formationSelect.value = data.formation || '4-4-2';
      kitColorInput.value = data.kitColor || '#1e5fd9';
      borderColorInput.value = data.borderColor || '#ffffff';
      players = data.players || [];
      benchPlayers = data.benchPlayers || [];
      idCounter = Math.max(0, ...players.map(p => p.id), ...benchPlayers.map(p => p.id)) + 1;
      render();
    } catch (err) {
      alert('Arquivo inválido. Certifique-se de escolher um arquivo .json salvo por este site.');
    }
  };
  reader.readAsText(file);
  e.target.value = '';
});

buildFormation('4-4-2');
