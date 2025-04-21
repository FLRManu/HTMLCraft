const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const blockSize = 32;
const worldCols = Math.floor(canvas.width / blockSize);
const worldRows = Math.floor(canvas.height / blockSize);
let world = [];

// ----------- TIPOS DE BLOQUE -----------

const blockTypes = {
  0: { name: "Vacío", color: null },
  1: { name: "Pasto", color: null },
  2: { name: "Madera", color: "#8B4513" },
  3: { name: "Piedra", color: "#808080" },
};

let selectedBlock = 1;
const inventory = [1, 2, 3];
let showInventory = true;

// ----------- MUNDO -----------

for (let y = 0; y < worldRows; y++) {
  let row = [];
  for (let x = 0; x < worldCols; x++) {
    row.push(y === worldRows - 1 ? 1 : 0);
  }
  world.push(row);
}

function drawWorld() {
  for (let y = 0; y < worldRows; y++) {
    for (let x = 0; x < worldCols; x++) {
      const id = world[y][x];
      const posX = x * blockSize;
      const posY = y * blockSize;

      if (id === 1) {
        ctx.fillStyle = "#228B22";
        ctx.fillRect(posX, posY, blockSize, blockSize / 4);
        ctx.fillStyle = "#654321";
        ctx.fillRect(posX, posY + blockSize / 4, blockSize, (blockSize * 3) / 4);
      } else if (id === 2) {
        ctx.fillStyle = blockTypes[id].color;
        ctx.fillRect(posX, posY, blockSize, blockSize);
        ctx.strokeStyle = "#5A2D0C";
        ctx.lineWidth = 1;
        for (let i = 4; i < blockSize; i += 8) {
          ctx.beginPath();
          ctx.moveTo(posX + i, posY);
          ctx.lineTo(posX + i, posY + blockSize);
          ctx.stroke();
        }
      } else if (id === 3) {
        ctx.fillStyle = blockTypes[id].color;
        ctx.fillRect(posX, posY, blockSize, blockSize);
        ctx.strokeStyle = "#A9A9A9";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(posX + 4, posY + 4);
        ctx.lineTo(posX + 12, posY + 10);
        ctx.lineTo(posX + 20, posY + 6);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(posX + 10, posY + 20);
        ctx.lineTo(posX + 24, posY + 24);
        ctx.stroke();
      }
    }
  }
}

// ----------- JUGADOR -----------

const player = {
  x: 100,
  y: 100,
  width: blockSize,
  height: blockSize,
  color: "#00f",
  vx: 0,
  vy: 0,
  onGround: false
};

const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
  if (e.key === "e" || e.key === "E") {
    showInventory = !showInventory;
  }
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function isSolidBlockAt(x, y) {
  const gridX = Math.floor(x / blockSize);
  const gridY = Math.floor(y / blockSize);
  if (gridX >= 0 && gridX < worldCols && gridY >= 0 && gridY < worldRows) {
    return world[gridY][gridX] !== 0;
  }
  return false;
}

function updatePlayer() {
  if (keys["ArrowLeft"] || keys["a"]) player.vx = -3;
  else if (keys["ArrowRight"] || keys["d"]) player.vx = 3;
  else player.vx = 0;

  if ((keys["ArrowUp"] || keys["w"]) && player.onGround) {
    player.vy = -10;
    player.onGround = false;
  }

  player.vy += 0.5;

  player.x += player.vx;
  if (
    isSolidBlockAt(player.x, player.y) ||
    isSolidBlockAt(player.x + player.width - 1, player.y) ||
    isSolidBlockAt(player.x, player.y + player.height - 1) ||
    isSolidBlockAt(player.x + player.width - 1, player.y + player.height - 1)
  ) {
    player.x -= player.vx;
  }

  player.y += player.vy;

  if (
    isSolidBlockAt(player.x, player.y + player.height) ||
    isSolidBlockAt(player.x + player.width - 1, player.y + player.height)
  ) {
    player.y = Math.floor((player.y + player.height) / blockSize) * blockSize - player.height;
    player.vy = 0;
    player.onGround = true;
  } else {
    player.onGround = false;
  }

  if (
    isSolidBlockAt(player.x, player.y) ||
    isSolidBlockAt(player.x + player.width - 1, player.y)
  ) {
    player.y = Math.floor(player.y / blockSize + 1) * blockSize;
    player.vy = 0;
  }
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

// ----------- CLICK BLOQUES -----------

canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  const gridX = Math.floor(mouseX / blockSize);
  const gridY = Math.floor(mouseY / blockSize);

  if (gridX >= 0 && gridX < worldCols && gridY >= 0 && gridY < worldRows) {
    if (e.button === 0) {
      world[gridY][gridX] = selectedBlock;
    } else if (e.button === 2) {
      world[gridY][gridX] = 0;
    }
  }
});
canvas.addEventListener("contextmenu", (e) => e.preventDefault());

// ----------- INVENTARIO -----------

function drawInventory() {
  const invWidth = inventory.length * blockSize;
  const invX = (canvas.width - invWidth) / 2;
  const invY = canvas.height - blockSize - 10;

  for (let i = 0; i < inventory.length; i++) {
    const blockId = inventory[i];
    const bx = invX + i * blockSize;

    if (blockId === 1) {
      ctx.fillStyle = "#228B22";
      ctx.fillRect(bx, invY, blockSize, blockSize / 4);
      ctx.fillStyle = "#654321";
      ctx.fillRect(bx, invY + blockSize / 4, blockSize, (blockSize * 3) / 4);
    } else if (blockId === 2) {
      ctx.fillStyle = blockTypes[blockId].color;
      ctx.fillRect(bx, invY, blockSize, blockSize);
      ctx.strokeStyle = "#5A2D0C";
      ctx.lineWidth = 1;
      for (let j = 4; j < blockSize; j += 8) {
        ctx.beginPath();
        ctx.moveTo(bx + j, invY);
        ctx.lineTo(bx + j, invY + blockSize);
        ctx.stroke();
      }
    } else if (blockId === 3) {
      ctx.fillStyle = blockTypes[blockId].color;
      ctx.fillRect(bx, invY, blockSize, blockSize);
      ctx.strokeStyle = "#A9A9A9";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx + 4, invY + 4);
      ctx.lineTo(bx + 12, invY + 10);
      ctx.lineTo(bx + 20, invY + 6);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(bx + 10, invY + 20);
      ctx.lineTo(bx + 24, invY + 24);
      ctx.stroke();
    }

    ctx.strokeStyle = (blockId === selectedBlock) ? "yellow" : "#222";
    ctx.lineWidth = (blockId === selectedBlock) ? 3 : 1;
    ctx.strokeRect(bx, invY, blockSize, blockSize);
  }
}

canvas.addEventListener("click", (e) => {
  if (!showInventory) return;
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  const invWidth = inventory.length * blockSize;
  const invX = (canvas.width - invWidth) / 2;
  const invY = canvas.height - blockSize - 10;

  for (let i = 0; i < inventory.length; i++) {
    const bx = invX + i * blockSize;
    const by = invY;
    if (
      mouseX >= bx && mouseX < bx + blockSize &&
      mouseY >= by && mouseY < by + blockSize
    ) {
      selectedBlock = inventory[i];
    }
  }
});

// ----------- LOOP PRINCIPAL -----------

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWorld();
  updatePlayer();
  drawPlayer();
  if (showInventory) drawInventory();
  requestAnimationFrame(gameLoop);
}

gameLoop();
