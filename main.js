let x, y, dx, dy, paddleX
const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')
const ravenHitbox = 20
const paddleHeight = 10
let paddleWidth = 150
const brickRowCount = 8
const brickColumnCount = 10
const brickWidth = 46
const brickHeight = 20
const brickPadding = 10
const brickOffsetTop = 30
const brickOffsetLeft = 20
const powerupHitbox = 8
const powerupColor = '#7700ff'
const powerupProbability = 0.33
const color = '#141414'
let ravensHarmed = 0
let ravensFreed = 0
let paused = true
const bricks = []
let ravens = []
let powerups = []
let bricksCount = 0

function loadImage(src) {
    const img = new window.Image();
    img.src = src;
    return img;
}

const ravenRight = loadImage("media/raven-right.png");
const ravenLeft = loadImage("media/raven-left.png");

function togglePause () {
  paused = !paused
  window.alert("GAME PAUSED!!!")
  document.querySelector('#pause').innerHTML = paused ? 'Resume' : 'Pause'
  document.querySelector('#step').style.display = paused ? 'inline' : 'none'
  draw()
}
document.querySelector("#pause").addEventListener("click", togglePause);

document.querySelector('#step').addEventListener('click', () => {
  if (paused) { draw() }
  console.clear()
  for(let r = 0; r < ravens.length; r++) {
    console.log(`Raven ${r}: x: ${ravens[r].x}\ndx: ${ravens[r].dx}\ny: ${ravens[r].y}\ndy: ${ravens[r].dy}`)
  }
})

function restart () {
  const difficulty = document.querySelector('input[name=difficulty]').value

  paddleWidth = 150;
  bricksCount = 0;

  powerups = []
  ravens = []
  ravens.push({x: canvas.width / 2, y: canvas.height - 30, dx: 0, dy: 0, status: 1})

  // x = canvas.width / 2
  // y = canvas.height - 30
  paddleX = (canvas.width - paddleWidth) / 2

  // dx = 0
  // dy = 0

    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

  clearTimeout(restart.timer)
  restart.timer = setTimeout(() => {
    for(let r = 0; r < ravens.length; r++) {
      ravens[r].dx = difficulty * (2.5 + Math.random()) / 4
      ravens[r].dy = -(difficulty * difficulty - ravens[r].dx * ravens[r].dx)
      console.log(ravens[r].dy)
    }
    
  }, 1000)
}
document.querySelector("#restart").addEventListener("click", restart);

function movePaddle(e) {
    if (e.targetTouches) {
        e = e.targetTouches[0];
    }

    const relativeX = (e.clientX - canvas.offsetLeft) * (canvas.width / canvas.offsetWidth);
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}
document.addEventListener("mousemove", movePaddle, false);
document.addEventListener("touchmove", movePaddle, false);

function drawRaven () {
  for(let r = 0; r < ravens.length; r++) {
    if (ravens[r].status === 1) {
      ctx.drawImage(ravenRight, ravens[r].x - 38, ravens[r].y - 12)
    }
  }
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = r * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = c * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = color;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    document.querySelector("#score").textContent =
      "Ravens Freed: " + ravensFreed + " Ravens Harmed: " + ravensHarmed + " Bricks Destroyed: " + bricksCount;
}

function drawPowerups () {
  for (let p = 0; p < powerups.length; p++) {
    if (powerups[p].status === 0) continue
    ctx.beginPath()
    ctx.ellipse(powerups[p].x, powerups[p].y, powerupHitbox, powerupHitbox, 0, 0, 2 * Math.PI)
    ctx.fillStyle = powerupColor
    ctx.fill()
    ctx.closePath()
  }
}

function drawPowerups () {
  for (let p = 0; p < powerups.length; p++) {
    if (powerups[p].status === 0) continue
    ctx.beginPath()
    ctx.ellipse(powerups[p].x, powerups[p].y, powerupHitbox, powerupHitbox, 0, 0, 2 * Math.PI)
    ctx.fillStyle = powerupColor
    ctx.fill()
    ctx.closePath()
  }
}

function collisionDetection() {
  for (let i = 0; i < ravens.length; i++) {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
          if (b.status === 1) {
            if (ravens[i].x > b.x && ravens[i].x < b.x + brickWidth && ravens[i].y > b.y && ravens[i].y < b.y + brickHeight) {
              ravens[i].dy = -ravens[i].dy;
              b.status = 0;
              bricksCount = bricksCount + 1;
              if (Math.random() < powerupProbability) {
                powerups.push({x: b.x + brickWidth / 2, y: b.y + brickHeight / 2, dy: 1, status: 1})
              }
            }
          }
        }
      }
  }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    collisionDetection();

  for(let r = 0; r < ravens.length; r++) {
    if (ravens[r].status === 1) {
      if (ravens[r].x + ravens[r].dx > canvas.width - ravenHitbox || ravens[r].x + ravens[r].dx < ravenHitbox) {
        ravens[r].dx = -ravens[r].dx
      }

      if (ravens[r].y < -100) {
        ravensFreed++
        ravens[r].status = 0
        // restart()
      } else if (ravens[r].y > canvas.height + 64) {
        ravensHarmed++
        ravens[r].status = 0
        // restart()
      } else if (ravens[r].y > canvas.height - ravenHitbox 
              && ravens[r].y < canvas.height + ravenHitbox 
              && ravens[r].x > paddleX 
              && ravens[r].x < paddleX + paddleWidth 
              && ravens[r].dy > 0) {
        ravens[r].dy = -ravens[r].dy
        paddleWidth -= 5;
      }
    
      ravens[r].x += ravens[r].dx
      ravens[r].y += ravens[r].dy
    }
  }

  let allRavensGone = true
  for(let r = 0; r < ravens.length; r++) {
    if (ravens[r].status === 1) {
      allRavensGone = false
    }
  }

  for(let p = 0; p < powerups.length; p++) {
    if (powerups[p].status === 0) continue
    powerups[p].y += powerups[p].dy
    if (powerups[p].y > canvas.height - ravenHitbox 
      && powerups[p].y < canvas.height + ravenHitbox 
      && powerups[p].x > paddleX 
      && powerups[p].x < paddleX + paddleWidth 
      && powerups[p].dy > 0) {
        powerups[p].status = 0
        
        const difficulty = document.querySelector('input[name=difficulty]').value
        dx = difficulty * (2.5 + Math.random()) / 4
        dy = -(difficulty * difficulty - dx * dx)
        ravens.push({x: paddleX + paddleWidth / 2, y: canvas.height - 30, dx: dx, dy: dy, status: 1})
        ravens.push({x: paddleX + paddleWidth / 2, y: canvas.height - 30, dx: -dx, dy: dy, status: 1})
    }

  }

  if (allRavensGone) {
    restart()
  }

  drawBricks()
  drawRaven()
  drawPowerups()
  drawPaddle()
  drawScore()
  

    if (!paused) {
        window.requestAnimationFrame(draw);
    }
}

restart();
togglePause();
