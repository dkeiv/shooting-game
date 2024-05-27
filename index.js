class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.player = new Player(this);
    this.enemies = [];
    this.numberOfProjecttile = 5;
    this.projectiles = [];
    this.keys = [];

    this.createProjectiles();

    window.addEventListener('keydown', (e) => {
      const index = this.keys.indexOf(e.key);
      if (index === -1) this.keys.push(e.key);
      if (e.key == ' ') this.player.shoot();
    });

    window.addEventListener('keyup', (e) => {
      const index = this.keys.indexOf(e.key);
      if (index > -1) this.keys.splice(index, 1);
    });

    console.log(this.projectiles);
  }

  render(context) {
    this.clearCanvas(context); // clear previous frame
    this.player.draw(context);
    this.player.update();
    this.projectiles.forEach((p) => {
      p.update();
      p.draw(context);
    });
  }

  clearCanvas(context) {
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  createProjectiles() {
    for (let i = 0; i < this.numberOfProjecttile; i++) {
      this.projectiles[i] = new Projectile();
    }
  }

  getProjectile() {
    for (let i = 0; i < this.numberOfProjecttile; i++) {
      if (this.projectiles[i].isFree) return this.projectiles[i];
    }
  }

  collisionDectection() {}
}

class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 100;
    this.x = (this.game.width - this.width) * 0.5;
    this.y = this.game.height - this.height;
    this.speed = 5;
  }

  draw(context) {
    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.fillStyle = '#FF0000';
    context.fill();
    context.closePath();
  }

  update() {
    if (this.game.keys.indexOf('ArrowLeft') > -1) {
      this.x = Math.max(this.x - this.speed, 0);
    }
    if (this.game.keys.indexOf('ArrowRight') > -1) {
      this.x = Math.min(this.x + this.speed, this.game.width - this.width);
    }
  }

  shoot() {
    const projectile = this.game.getProjectile();
    if (projectile) projectile.start(this.x + this.width * 0.5, this.y);
  }
}

class Projectile {
  constructor() {
    this.width = 8;
    this.height = 30;
    this.x = 0;
    this.y = 600;
    this.speed = 20;
    this.isFree = true;
  }

  draw(context) {
    if (!this.isFree) {
      context.beginPath();
      context.rect(this.x, this.y, this.width, this.height);
      context.fillStyle = '#FF0000';
      context.fill();
      context.closePath();
    }
  }

  update() {
    if (!this.isFree) {
      this.y -= this.speed;
      if(this.y < -this.height) this.reset();
    }
  }

  start(x, y) {
    this.x = x - this.width * 0.5;
    this.y = y;
    this.isFree = false;
  }

  reset() {
    this.isFree = true;
  }
}

class Enemy {
  constructor() {
    this.isDead = false;
  }
  draw() {}
  update() {}
}

window.addEventListener('load', () => {
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 600;
  canvas.height = 800;

  const game = new Game(canvas);

  const testLimit = 24;
  let frame = 0;

  function animate() {
    // frame === testLimit ? frame++ : return 0;
    game.render(ctx);
    window.requestAnimationFrame(animate);
  }
  animate();
});
