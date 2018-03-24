// setup canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight - 60;  // adjust for button

const balls = [];
const button = document.getElementById('generate');
const scoreboard = document.getElementById('score');
let score = 0;

// ball object
class Ball {
  constructor(x, y, velocityX, velocityY, color, radius) {
    this.x = x;
    this.y = y;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.color = color;
    this.radius = radius;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    let edgeX = this.x + this.radius;
    let edgeY = this.y + this.radius;

    if ((edgeX >= width) || (edgeX <= 0)) {
      this.velocityX = -(this.velocityX);
      score++;
    }

    if ((edgeY >= height) || (edgeY <= 0)) {
      this.velocityY = -(this.velocityY);
      score++;
    }

    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  bounce() {
    // choose the direction of the bounce by coin flip
    Math.random() >= 0.5 ? 
      this.velocityY = -(this.velocityY) : 
      this.velocityX = -(this.velocityX);
    score++;
  }

  detectCollision() {
    balls.forEach(element => {
      if (!(this === element)) {
        var dx = this.x - element.x;
        var dy = this.y - element.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + element.radius) {
          element.bounce();
        }
      }
    });
  }
}

// function to generate random number
function random(min, max) {
  return Math.floor(Math.random()*(max-min)) + min;
}

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight - 60;
}

// generate new ball
function addBall() {
  const ball = new Ball(
    random(0, width),
    random(0, height),
    random(-12, 12),
    random(-12, 12),
    'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')',
    12  // radius
  );
  balls.push(ball);
}

// animate the balls
function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  balls.forEach(element => {
    element.draw();
    element.update();
    element.detectCollision();
  });

  scoreboard.innerHTML = score;
  requestAnimationFrame(animate);
}

// get mouse position
function getMousePosition(event) {
  const rect = canvas.getBoundingClientRect();
  console.log({
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  });
}

// add listeners and start animation
window.addEventListener('resize', resize, false);
button.addEventListener('click', addBall);
canvas.addEventListener('click', getMousePosition);
animate();
