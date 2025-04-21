const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Dibujar un "bloque" de prueba
const blockSize = 32;

function drawBlock(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, blockSize, blockSize);
}

// Dibujar el suelo con bloques
function drawWorld() {
  for (let i = 0; i < canvas.width; i += blockSize) {
    drawBlock(i, canvas.height - blockSize, "#654321"); // color marrón
  }
}

// Bucle principal
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawWorld();

  requestAnimationFrame(gameLoop);
}

gameLoop();
