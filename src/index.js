class Vector2 {
	constructor(x, y) {
		this.x = x
		this.y = y
	}
}

class Ball {
	constructor() {
		this.x = 100
		this.y = 100
		this.radius = 20
		this.color = "#00FF00"
		this.speed = 1
		this.direction = new Vector2(0, -1)
	}
	
	move(xDir, yDir) {
		this.x += xDir
		this.y += yDir
	}
}

var ball = new Ball(7)
ball.color = "#000000"
var b = false

const gameState = {
  redSqure: {
    x: 100,
    y: 100,
    width: 200,
    height: 50,
  },
  pointer: {
    x: 0,
    y: 0,
    width: 10,
    height: 10,
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
    ball.x = e.pageX
    ball.y = e.pageY
  }
  setInterval(gameLoop, 1000 / 60)
}

function gameLoop() {
  draw()
  update()
}

function drawBall(context) {
  //const x = canvas.width / 2
  //const y = canvas.height / 2
  context.lineWidth = 3
  context.beginPath()
  context.strokeStyle = b ? "#00FF00" : ball.color
  context.fillStyle = b ? "#00FF00" : ball.color
  context.fill()
  context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI, false);
  context.fill()
  context.stroke()
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
  
  if (b) {
  context.beginPath()
  context.rect(200 - width/ 2, 300 - height/2, width, height)
  context.fillStyle = "#000000"
  context.fill()
  context.closePath()
  }

  // draw pointer
  const pointer = gameState.pointer
  context.fillStyle = "#00FF00"
  context.fillRect(pointer.x-5,pointer.y-5,10,10)
  
  //draw ball
  drawBall(context)
}

function isCollision() {	
	if (ball.x >= gameState.redSqure.x - gameState.redSqure.width * 0.5 && 
	    ball.x <= gameState.redSqure.x + gameState.redSqure.width * 0.5 &&
		ball.y >= gameState.redSqure.y - gameState.redSqure.height * 0.5 &&
		ball.y <= gameState.redSqure.y + gameState.redSqure.height * 0.5) {
		return true	
	}
}

function boxCollision() {
  return gameState.pointer.x - gameState.pointer.width * 0.5 <= gameState.redSqure.x + gameState.redSqure.width * 0.5 &&
  gameState.pointer.x + gameState.pointer.width  * 0.5  >= gameState.redSqure.x - gameState.redSqure.width * 0.5 && 
  gameState.pointer.y - gameState.pointer.height * 0.5 <= gameState.redSqure.y + gameState.redSqure.height * 0.5 &&
  gameState.pointer.y + gameState.pointer.height * 0.5 >= gameState.redSqure.y - gameState.redSqure.height * 0.5;
}

function circleCollision() {
  let clamp = (value, min, max) => value < min ? min : value > max ? max : value

  const left = gameState.redSqure.x - gameState.redSqure.width * 0.5
  const right = gameState.redSqure.x + gameState.redSqure.width * 0.5
  const bottom = gameState.redSqure.y - gameState.redSqure.height * 0.5
  const top = gameState.redSqure.y + gameState.redSqure.height * 0.5

  const closestX = clamp(ball.x, left, right)
  const closestY = clamp(ball.y, bottom, top) 

  const distanceX = ball.x - closestX
  const distanceY = ball.y - closestY

  return distanceX * distanceX + distanceY * distanceY <= ball.radius * ball.radius
}

var xDir = 0
var yDir = 1
var speed = 3
function update() {
  // b = boxCollision()
  b = circleCollision()
  
  return
  const vx = (gameState.pointer.x - gameState.redSqure.x) / 10
  const vy = (gameState.pointer.y - gameState.redSqure.y) / 10

  gameState.redSqure.x += vx
  //gameState.redSqure.y += vy
  gameState.redSqure.y = canvas.height * 0.9
  
  ball.move(xDir, yDir * speed)
  
  console.log(isCollision())
}

run()
