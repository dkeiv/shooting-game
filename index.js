const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Game {
  constructor(context) {
    this.context = context;
    this.player = new Player(this.context);
    this.enemies = [];
    this.projectiles = [];
  }
  draw() {
    // clear previous frame
    this.clearCanvas();
  }

  clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  update() {}
  collisionDectection() {}
}

class Enemy {
  constructor() {
    this.isDead = false;
  }
  draw() {}
  update() {}
}

class Player {
  constructor(context) {
    this.x = 0;
    this.y = 0;
    this.vx = 5;
    this.vy = 5;
    this.context = context;
  }
  draw() {}
  update() {}
}

class Projectile {
  constructor() {
    this.isFired = false;
  }
  draw() {}
  update() {}
}

// ctx.beginPath();
// ctx.rect(20, 40, 50, 50);
// ctx.fillStyle = '#FF0000';
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.arc(240, 160, 20, 0, Math.PI * 2, false);
// ctx.fillStyle = 'green';
// ctx.fill();
// ctx.closePath();

// ctx.beginPath();
// ctx.rect(160, 10, 100, 40);
// ctx.strokeStyle = 'rgb(0 0 255 / 50%)';
// ctx.stroke();
// ctx.closePath();
