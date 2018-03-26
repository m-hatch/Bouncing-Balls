(function() {

  // setup canvas
  const canvas = document.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight - 60;  // adjust for button

  // DOM elements
  const button = document.getElementById('generate');
  const scoreboard = document.getElementById('score');
  const bounceCount = document.getElementById('bounces');
  const ballCount = document.getElementById('count');

  // vars
  let balls = [];
  let score = 0;
  let numBounces = 0;

  // ball object
  class Ball {
    constructor(x, y, velocityX, velocityY, color, radius) {
      this.x = x;
      this.y = y;
      this.velocityX = velocityX;
      this.velocityY = velocityY;
      this.color = color;
      this.radius = radius;
      this.captured = false;
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
      let diameter = this.radius * 2;

      if ((edgeX >= width) || (edgeX <= diameter)) {
        this.velocityX = -(this.velocityX);
        numBounces++;
      }

      if ((edgeY >= height) || (edgeY <= diameter)) {
        this.velocityY = -(this.velocityY);
        numBounces++;
      }

      this.x += this.velocityX;
      this.y += this.velocityY;
    }

    bounce() {
      /* choose the direction of the bounce by coin flip */
      Math.random() >= 0.5 ? 
        this.velocityY = -(this.velocityY) : 
        this.velocityX = -(this.velocityX);
    }

    detectCollision() {
      balls.forEach(element => {
        if (!(this === element)) {
          const dx = this.x - element.x;
          const dy = this.y - element.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < this.radius + element.radius) {
            element.bounce();
            numBounces++;
          }
        }
      });
    }
  }

  // function to generate random number
  function random(min, max) {
    return Math.floor(Math.random()*(max-min)) + min;
  }

  // adjust canvas on resize
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight - 60;
  }

  // generate new ball
  function addBall() {
    const radius = 14;
    const ball = new Ball(
      random(radius, width),
      random(radius, height),
      random(-12, 12),
      random(-12, 12),
      'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')',
      radius
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
    bounceCount.innerHTML = numBounces;
    ballCount.innerHTML = balls.length || 0;

    requestAnimationFrame(animate);
  }

  // check mouse position
  function checkMousePosition(event) {
    const rect = canvas.getBoundingClientRect();
    const point = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
    capture(point.x, point.y);
  }

  // capture ball
  function capture(px, py) {
    balls.forEach(element => {
      const {x, y} = element;
      const distance = Math.sqrt((px - x) * (px - x) + (py - y) * (y - y));

      if (distance < element.radius) {
        alert('captured');
        element.captured = true;
        balls = remove(balls, "captured", true);
        score+= getPoints();
      }
    });
  }

  // points algorithm
  function getPoints() {
    let points = 100;

    balls.forEach(() => {
      points *= 0.9;
    });

    return Math.floor(points);
  }

  // remove item from array
  function remove(array, key, value) {
    const index = array.findIndex(obj => obj[key] === value);

    // return copy of array without found item
    return index >= 0 ? 
      [ ...array.slice(0, index), ...array.slice(index + 1) ] : 
      array;
  }

  // add listeners and start animation
  window.addEventListener('resize', resize, false);
  button.addEventListener('click', addBall);
  canvas.addEventListener('click', checkMousePosition);
  animate();

})();
