let x, y, dx, dy, paddleX
const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')
const ravenHitbox = 60
const paddleHeight = 10
const paddleWidth = 75
const brickRowCount = 8
const brickColumnCount = 6
const brickWidth = 46
const brickHeight = 20
const brickPadding = 10
const brickOffsetTop = 30
const brickOffsetLeft = 20
const color = 'blue'
let ravensHarmed = 0
let ravensFreed = 0
let paused = true
const bricks = []



function loadImage (src) {
  const img = new window.Image()
  img.src = src
  return img
}

const ravenRight = loadImage('media/koontzSmall.jpg')

function togglePause () {
  paused = !paused
  document.querySelector('#pause').innerHTML = paused ? 'Resume' : 'Pause'
  document.querySelector('#step').style.display = paused ? 'inline' : 'none'
  draw()
}
document.querySelector('#pause').addEventListener('click', togglePause)

document.querySelector('#step').addEventListener('click', () => {
  if (paused) { draw() }
  console.clear()
  console.log(`x: ${x}\ndx: ${dx}\ny: ${y}\ndy: ${dy}`)
})

function restart () {
  const difficulty = document.querySelector('input[name=difficulty]').value

  x = canvas.width / 2
  y = canvas.height - 30
  paddleX = (canvas.width - paddleWidth) / 2

  dx = 0
  dy = 0

  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = []
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 }
    }
  }

  clearTimeout(restart.timer)
  restart.timer = setTimeout(() => {
    dx = difficulty * (2.5 + Math.random()) / 4
    dy = -(difficulty * difficulty - dx * dx)
  }, 1000)
}
document.querySelector('#restart').addEventListener('click', restart)

function movePaddle (e) {
  if (e.targetTouches) { e = e.targetTouches[0] }

  const relativeX = (e.clientX - canvas.offsetLeft) * (canvas.width / canvas.offsetWidth)
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2
  }
}
document.addEventListener('mousemove', movePaddle, false)
document.addEventListener('touchmove', movePaddle, false)

function drawRaven () {
  ctx.drawImage(ravenRight, x - 38, y - 12)
}

function drawPaddle () {
  ctx.beginPath()
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
  ctx.fillStyle = color
  ctx.fill()
  ctx.closePath()
}

function drawBricks () {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft
        const brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop
        bricks[c][r].x = brickX
        bricks[c][r].y = brickY
        ctx.beginPath()
        ctx.rect(brickX, brickY, brickWidth, brickHeight)
        ctx.fillStyle = color
        ctx.fill()
        ctx.closePath()
      }
    }
  }
}

function drawScore () {
  document.querySelector('#score').textContent = 'Koontz(s) Freed: ' + ravensFreed + ' Koontz(s) Harmed: ' + ravensHarmed
}

function collisionDetection () {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r]
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy
          b.status = 0
        }
      }
    }
  }
}

function draw () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  collisionDetection()

  if (x + dx > canvas.width - ravenHitbox || x + dx < ravenHitbox) {
    dx = -dx
  }

  if (y < -100) {
    ravensFreed++
    restart()
  } else if (y > canvas.height + 64) {
    ravensHarmed++
    restart()
  } else if (y > canvas.height - ravenHitbox && y < canvas.height + ravenHitbox &&
            x > paddleX && x < paddleX + paddleWidth && dy > 0) {
    dy = -dy
  }

  x += dx
  y += dy

  drawBricks()
  drawRaven()
  drawPaddle()
  drawScore()

  if (!paused) {
    window.requestAnimationFrame(draw)
  }
}

restart()
togglePause()
