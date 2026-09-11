const FORMATIONS = {
  "4-4-2": [
    {x:50,y:92,pos:"GOL"},
    {x:15,y:75,pos:"LD"},{x:38,y:78,pos:"ZAG"},{x:62,y:78,pos:"ZAG"},{x:85,y:75,pos:"LE"},
    {x:15,y:50,pos:"MD"},{x:38,y:52,pos:"MC"},{x:62,y:52,pos:"MC"},{x:85,y:50,pos:"ME"},
    {x:38,y:20,pos:"ATA"},{x:62,y:20,pos:"ATA"}
  ],
  "4-4-2-diamond": [
    {x:50,y:92,pos:"GOL"},
    {x:15,y:75,pos:"LD"},{x:38,y:78,pos:"ZAG"},{x:62,y:78,pos:"ZAG"},{x:85,y:75,pos:"LE"},
    {x:50,y:62,pos:"VOL"},
    {x:22,y:45,pos:"MC"},{x:78,y:45,pos:"MC"},
    {x:50,y:32,pos:"MEA"},
    {x:38,y:15,pos:"ATA"},{x:62,y:15,pos:"ATA"}
  ],
  "4-3-3": [
    {x:50,y:92,pos:"GOL"},
    {x:15,y:75,pos:"LD"},{x:38,y:78,pos:"ZAG"},{x:62,y:78,pos:"ZAG"},{x:85,y:75,pos:"LE"},
    {x:30,y:52,pos:"MC"},{x:50,y:55,pos:"VOL"},{x:70,y:52,pos:"MC"},
    {x:20,y:20,pos:"PE"},{x:50,y:15,pos:"ATA"},{x:80,y:20,pos:"PD"}
  ],
  "4-3-3-meia": [
    {x:50,y:92,pos:"GOL"},
    {x:15,y:75,pos:"LD"},{x:38,y:78,pos:"ZAG"},{x:62,y:78,pos:"ZAG"},{x:85,y:75,pos:"LE"},
    {x:30,y:58,pos:"VOL"},{x:70,y:58,pos:"VOL"},
    {x:50,y:38,pos:"MEA"},
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

function initFormation(key) {
  const layout = FORMATIONS[key];
  players = layout.map((slot, i) => newPlayer(slot.pos, slot.x, slot.y, i + 1));
  benchPlayers = [1,2,3,4,5].map((n) => {
    idCounter++;
    return { id: idCounter, name: "Reserva", number: 10 + n, pos: "RES" };
  });
  render();
}

// Ao trocar formação: reposiciona jogadores existentes nos novos slots,
// preservando nome/número editados. Não recria o time do zero.
function changeFormation(key) {
  const layout = FORMATIONS[key];

  if (layout.length >= players.length) {
    players.forEach((p, i) => {
      p.x = layout[i].x;
      p.y = layout[i].y;
      if (!p.name || p.name === p.pos) p.name = layout[i].pos;
      p.pos = layout[i].pos;
    });
    for (let i = players.length; i < layout.length; i++) {
      let moved;
      if (benchPlayers.length > 0) {
        moved = benchPlayers.shift();
      } else {
        moved = newPlayer(layout[i].pos, layout[i].x, layout[i].y, i + 1);
      }
      moved.x = layout[i].x;
      moved.y = layout[i].y;
      if (!moved.name || moved.name === moved.pos || moved.name === "Reserva") moved.name = layout[i].pos;
      moved.pos = layout[i].pos;
      players.push(moved);
    }
  } else {
    const extra = players.splice(layout.length);
    players.forEach((p, i) => {
      p.x = layout[i].x;
      p.y = layout[i].y;
      if (!p.name || p.name === p.pos) p.name = layout[i].pos;
      p.pos = layout[i].pos;
    });
    extra.forEach(p => { p.pos = "RES"; benchPlayers.push(p); });
  }
  render();
}

function render() {
  document.querySelectorAll('.player').forEach(el => el.remove());
  players.forEach(p => fieldEl.appendChild(renderPlayerOnField(p)));
  benchEl.innerHTML = '';
  benchPlayers.forEach(p => benchEl.appendChild(renderBenchPlayer(p)));
}

function shirtStyle() {
  return `background:${kitColorInput.value}; border-color:${borderColorInput.value};`;
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
    <div class="player-pos">${p.pos}</div>
  `;
  div.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ id: p.id, from: 'field' }));
    div.classList.add('dragging');
  });
  div.addEventListener('dragend', () => div.classList.remove('dragging'));
  div.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); div.classList.add('drop-target'); });
  div.addEventListener('dragleave', () => div.classList.remove('drop-target'));
  div.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    div.classList.remove('drop-target');
    handleDropOnPlayer(e, p.id, 'field');
  });
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
  div.addEventListener('dragover', (e) => { e.preventDefault(); e.stopPropagation(); div.classList.add('drop-target'); });
  div.addEventListener('dragleave', () => div.classList.remove('drop-target'));
  div.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    div.classList.remove('drop-target');
    handleDropOnPlayer(e, p.id, 'bench');
  });
  div.addEventListener('dblclick', () => openEdit(p.id, 'bench'));
  return div;
}

// Troca jogadores quando um é solto exatamente sobre outro (titular<->titular,
// titular<->reserva, ou reserva<->reserva), preservando slot (x/y/pos) de cada lado.
function handleDropOnPlayer(e, targetId, targetFrom) {
  const data = JSON.parse(e.dataTransfer.getData('text/plain'));
  if (data.id === targetId && data.from === targetFrom) return;

  if (data.from === 'field' && targetFrom === 'field') {
    const a = players.find(pl => pl.id === data.id);
    const b = players.find(pl => pl.id === targetId);
    if (a && b) {
      [a.x, b.x] = [b.x, a.x];
      [a.y, b.y] = [b.y, a.y];
      [a.pos, b.pos] = [b.pos, a.pos];
    }
  } else if (data.from === 'bench' && targetFrom === 'field') {
    const benchIdx = benchPlayers.findIndex(pl => pl.id === data.id);
    const fieldIdx = players.findIndex(pl => pl.id === targetId);
    if (benchIdx !== -1 && fieldIdx !== -1) {
      const benchP = benchPlayers[benchIdx];
      const fieldP = players[fieldIdx];
      const slot = { x: fieldP.x, y: fieldP.y, pos: fieldP.pos };
      benchP.x = slot.x; benchP.y = slot.y; benchP.pos = slot.pos;
      fieldP.pos = "RES";
      players[fieldIdx] = benchP;
      benchPlayers[benchIdx] = fieldP;
    }
  } else if (data.from === 'field' && targetFrom === 'bench') {
    const fieldIdx = players.findIndex(pl => pl.id === data.id);
    const benchIdx = benchPlayers.findIndex(pl => pl.id === targetId);
    if (fieldIdx !== -1 && benchIdx !== -1) {
      const fieldP = players[fieldIdx];
      const benchP = benchPlayers[benchIdx];
      const slot = { x: fieldP.x, y: fieldP.y, pos: fieldP.pos };
      benchP.x = slot.x; benchP.y = slot.y; benchP.pos = slot.pos;
      fieldP.pos = "RES";
      players[fieldIdx] = benchP;
      benchPlayers[benchIdx] = fieldP;
    }
  } else if (data.from === 'bench' && targetFrom === 'bench') {
    const idxA = benchPlayers.findIndex(pl => pl.id === data.id);
    const idxB = benchPlayers.findIndex(pl => pl.id === targetId);
    if (idxA !== -1 && idxB !== -1) {
      [benchPlayers[idxA], benchPlayers[idxB]] = [benchPlayers[idxB], benchPlayers[idxA]];
    }
  }
  render();
}

fieldEl.addEventListener('dragover', (e) => {
  e.preventDefault();
  fieldEl.classList.add('drag-over');
});
fieldEl.addEventListener('dragleave', () => fieldEl.classList.remove('drag-over'));

fieldEl.addEventListener('drop', (e) => {
  e.preventDefault();
  fieldEl.classList.remove('drag-over');
  if (e.target.closest('.player')) return;
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
      p.pos = "TIT";
      players.push({ ...p, x: clamp(x), y: clamp(y) });
    }
  }
  render();
});

benchEl.addEventListener('dragover', (e) => e.preventDefault());
benchEl.addEventListener('drop', (e) => {
  e.preventDefault();
  if (e.target.closest('.bench-player')) return;
  const data = JSON.parse(e.dataTransfer.getData('text/plain'));
  if (data.from === 'field') {
    const idx = players.findIndex(pl => pl.id === data.id);
    if (idx !== -1) {
      const p = players[idx];
      players.splice(idx, 1);
      p.pos = "RES";
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
  const posSelect = document.getElementById('editPos');
  posSelect.value = p.pos;
  if (posSelect.value !== p.pos) {
    const opt = document.createElement('option');
    opt.value = p.pos;
    opt.textContent = p.pos;
    posSelect.appendChild(opt);
    posSelect.value = p.pos;
  }
  document.getElementById('editModal').classList.remove('hidden');
}

document.getElementById('saveEdit').addEventListener('click', () => {
  const list = editingId.from === 'field' ? players : benchPlayers;
  const p = list.find(pl => pl.id === editingId.id);
  p.name = document.getElementById('editName').value || p.name;
  p.number = parseInt(document.getElementById('editNumber').value) || p.number;
  p.pos = document.getElementById('editPos').value || p.pos;
  document.getElementById('editModal').classList.add('hidden');
  render();
});

document.getElementById('cancelEdit').addEventListener('click', () => {
  document.getElementById('editModal').classList.add('hidden');
});

formationSelect.addEventListener('change', () => changeFormation(formationSelect.value));
kitColorInput.addEventListener('input', render);
borderColorInput.addEventListener('input', render);
teamNameInput.addEventListener('input', () => teamTitle.textContent = teamNameInput.value);

document.getElementById('resetBtn').addEventListener('click', () => initFormation(formationSelect.value));

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

initFormation('4-4-2');
