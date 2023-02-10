const gameState = {
  redSqure: {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
  },
  pointer: {
    x: 0,
    y: 0,
  },
}

const canvas = document.getElementById("cnvs")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

//TODO: subscribe on window resize

function run() {
  canvas.addEventListener('mousemove', onMouseMove, false)

  function onMouseMove(e) {
    gameState.pointer.x = e.pageX
    gameState.pointer.y = e.pageY
  }
  setInterval(gameLoop, 1000 / 60)
}

function gameLoop() {
  draw()
  update()
}

function draw() {
  const context = canvas.getContext('2d')

  // clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height)

  // draw redSqure
  const {x, y, width, height} = gameState.redSqure

  context.beginPath()
  context.rect(x - width/ 2, y - height/2, width, height)
  context.fillStyle = "#FF0000"
  context.fill()
  context.closePath()

  // draw pointer
  const pointer = gameState.pointer
  context.fillStyle = "#00FF00"
  context.fillRect(pointer.x-5,pointer.y-5,10,10)
}

function update() {
  const vx = (gameState.pointer.x - gameState.redSqure.x) / 10
  const vy = (gameState.pointer.y - gameState.redSqure.y) / 10

  gameState.redSqure.x += vx
  gameState.redSqure.y += vy
}

run()
