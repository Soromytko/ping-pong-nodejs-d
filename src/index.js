const gameState = {
  score: 0,
  isPause: true,
  timer: null,
  scoreTimer: null,
  ballSpeedTimer: null,
  bonusTimer: null,
  racket: {
    x: 100,
    y: 100,
    width: 300,
    height: 50,
    color: "#FF0000",
  },
  pointer: {
    x: 0,
    y: 0,
  },
  ball: {
    x: 100,
    y: 100,
    radius: 20,
    color: "#000000",
    xDir: 0,
    yDir: 1,
    speed: 10,
  },
  bonus: {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    speed: 5,
    value: 10,
    color: "#808080",
    active: false,
  }
}

const collisionType = {
  racket: "racket",
  left: "left",
  right: "right",
  bottom: "bottom",
  top: "top",
};

const canvas = document.getElementById("cnvs")
canvas.width = window.innerWidth
canvas.height = window.innerHeight

//TODO: subscribe on window resize
function run() {
  canvas.addEventListener('mousemove', onMouseMove, false)
  canvas.addEventListener('mousedown', onMouseDown, false)

  function onMouseDown(e) {
    gameState.isPause = !gameState.isPause
    if(gameState.isPause) {
      clearInterval(gameState.scoreTimer)
      clearInterval(gameState.ballSpeedTimer)
      clearInterval(gameState.bonusTimer)
    } else {
      gameState.scoreTimer = setInterval(increaseScore, 1000)
      gameState.ballSpeedTimer = setInterval(increaseBallSpeed, 10000)
      gameState.bonusTimer = setInterval(spawnBonus, 30000)
    }
  }

  function onMouseMove(e) {
    gameState.pointer.x = e.pageX
    gameState.pointer.y = e.pageY
  }
  
  awake()
  draw()
  gameState.timer = setInterval(gameLoop, 1000 / 60)
}

function increaseScore() {
  gameState.score += 1
}

function increaseBallSpeed() {
  gameState.ball.speed *= 1.1
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min)
}

function spawnBonus() {
  gameState.bonus.x = random(gameState.bonus.width, canvas.width - gameState.bonus.width)
  gameState.bonus.y = 0
  gameState.bonus.active = true
}

function gameLoop() {
  draw()
  if (!gameState.isPause) {
    update()
  }
}

function awake() {
  gameState.racket.y = canvas.height - gameState.racket.height / 2
  // gameState.bonus.active = true
}

function draw() {
  const context = canvas.getContext('2d')

  // clear canvas
  context.clearRect(0, 0, canvas.width, canvas.height)

  // draw racket
  const {x, y, width, height} = gameState.racket
  context.beginPath()
  context.rect(x - width/ 2, y - height/2, width, height)
  context.fillStyle = gameState.racket.color
  context.fill()
  context.closePath()
  
  // draw ball
  context.lineWidth = 3
  context.beginPath()
  context.strokeStyle = gameState.ball.color
  context.fillStyle = gameState.ball.color
  context.fill()
  context.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, 2 * Math.PI, false);
  context.fill()
  context.stroke()
  context.closePath()

  // draw bonus
  if (gameState.bonus.active) {
    const { x, y, width, height, color } = gameState.bonus
    context.beginPath()
    context.rect(x - width * 0.1, y - height * 0.5, width * 0.2, height)
    context.rect(x - width * 0.5, y - height * 0.1, width, height * 0.2)
    context.fillStyle = color
    context.fill()
    context.closePath()
  }
  
  // draw text
  if (gameState.isPause) {
    context.beginPath()
    context.font = "50px Arial"
    context.fillStyle = "black"
    context.textAlign = "center";
    context.fillText("PAUSE", canvas.width / 2, canvas.height / 2)
    context.closePath()
  }
  context.beginPath()
  context.font = "30px Arial"
  context.fillStyle = "black"
  context.textAlign = "center";
  context.fillText(gameState.score, 20, 50)
  context.closePath()
}

// circle {x, y, radius}, rect {x, y, width, height}
function circleVsRectCollision(circle, rect) {
  let clamp = (value, min, max) => value < min ? min : value > max ? max : value
  
  const left = rect.x - rect.width * 0.5
  const right = rect.x + rect.width * 0.5
  const bottom = rect.y - rect.height * 0.5
  const top = rect.y + rect.height * 0.5
  
  const closestX = clamp(circle.x, left, right)
  const closestY = clamp(circle.y, bottom, top) 
  
  const distanceX = circle.x - closestX
  const distanceY = circle.y - closestY
  
  return distanceX * distanceX + distanceY * distanceY <= circle.radius * circle.radius
}

// rect {x, y, width, height}
function rectVsRectCollision(first, second) {
  return first.x - first.width * 0.5 <= second.x + second.width * 0.5 &&
    first.x + first.width  * 0.5  >= second.x - second.width * 0.5 && 
    first.y - first.height * 0.5 <= second.y + second.height * 0.5 &&
    first.y + first.height * 0.5 >= second.y - second.height * 0.5;
}

// returns the string type of the collision object
function getBallCollisionType() {
  if (circleVsRectCollision(gameState.ball, gameState.racket))
    return collisionType.racket
  if (gameState.ball.x - gameState.ball.radius <= 0)
    return collisionType.left
  if (gameState.ball.x + gameState.ball.radius >= canvas.width)
    return collisionType.right
  if (gameState.ball.y - gameState.ball.radius <= 0)
    return collisionType.top
  if (gameState.ball.y + gameState.ball.radius >= canvas.height)
  return collisionType.bottom

  return ""
}

function getBonusCollisionType() {
  if (rectVsRectCollision(gameState.bonus, gameState.racket))
    return collisionType.racket
  if (gameState.bonus.y - gameState.bonus.size > canvas.height)
    return collisionType.bottom
  return ""
}

function update() {
  gameState.racket.x += (gameState.pointer.x - gameState.racket.x) / 2
  gameState.racket.y = canvas.height - gameState.racket.height / 2
  
  const collision = getBallCollisionType()
  switch (collision) {
    case collisionType.racket: {
      const xDir = gameState.ball.x - gameState.racket.x
      const yDir = gameState.ball.y - (gameState.racket.y + gameState.racket.height * 0.5)
      const n = Math.sqrt(xDir * xDir + yDir * yDir)
      gameState.ball.xDir = xDir / n
      gameState.ball.yDir = yDir / n
      break
    }
    case collisionType.left: {
      gameState.ball.xDir = Math.abs(gameState.ball.xDir)
      break
    }
    case collisionType.right: {
      gameState.ball.xDir = -Math.abs(gameState.ball.xDir)
      break
    }
    case collisionType.bottom:{
      gameOver()
      break
    }
    case collisionType.top: {
      gameState.ball.yDir = Math.abs(gameState.ball.yDir)
      break
    }
  }

  gameState.ball.x += gameState.ball.xDir * gameState.ball.speed
  gameState.ball.y += gameState.ball.yDir * gameState.ball.speed

  if (gameState.bonus.active) {
    switch(getBonusCollisionType()) {
      case collisionType.racket: {
        gameState.score += gameState.bonus.value
        gameState.bonus.active = false
        break
      }
      case collisionType.bottom: {
        gameState.bonus.active = false
        break
      }
      default: {
        gameState.bonus.y += gameState.bonus.speed
        break
      }
    }
  }
}

function gameOver() {
  clearInterval(gameState.timer)
  clearInterval(gameState.ballSpeedTimer)
  clearInterval(gameState.bonusTimer)

}

run()
