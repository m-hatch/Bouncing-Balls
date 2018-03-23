// setup canvas
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight - 40;  // adjust for button

const balls = [];

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

    if (edgeX >= width) {
      this.velocityX = -(this.velocityX);
    }

    if (edgeX <= 0) {
      this.velocityX = -(this.velocityX);
    }

    if (edgeY >= height) {
      this.velocityY = -(this.velocityY);
    }

    if (edgeY <= 0) {
      this.velocityY = -(this.velocityY);
    }

    this.x += this.velocityX;
    this.y += this.velocityY;
  }
}

// function to generate random number
function random(min, max) {
  return Math.floor(Math.random()*(max-min)) + min;
}

// generate new ball on button click
document.getElementById('generate').addEventListener('click', function() {
  const ball = new Ball(
    random(0, width),
    random(0, height),
    random(-12, 12),
    random(-12, 12),
    'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')',
    random(10, 20)
  );
  balls.push(ball);
});

// animate the balls
function animate() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  balls.forEach(element => {
    element.draw();
    element.update();
  });

  requestAnimationFrame(animate);
}

animate();
