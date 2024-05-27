class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.player = new Player(this);
    this.numberOfProjecttile = 5;
    this.projectiles = [];
    this.keys = [];

    this.enemyRow = 4;
    this.enemyCol = 3;
    this.enemySize = 60;

    this.waves = [];
    this.waves.push(new Wave(this));

    this.score = 0;
    this.gameOver = false;

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
  }

  render(context) {
    this.clearCanvas(context); // clear previous frame
    this.drawStatus(context);
    this.player.draw(context);
    this.player.update();
    this.projectiles.forEach((p) => {
      p.draw(context);
      p.update();
    });
    this.waves.forEach((w) => {
      w.draw(context);
      w.update();
      if (w.enemies.length < 1 && !w.nextWave && !this.gameOver) {
        this.newWave();
        w.nextWave = true;
      }
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

  collisionDectection(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  drawStatus(context) {
    context.save();
    context.fillText(`Score: ${this.score} `, 20, 40);
    context.fillText(`HP: ${this.player.live} `, 20, 60);
    if (this.gameOver) {
      context.textAlign = 'center';
      context.font = '100px';
      context.fillText(`GAME OVER!`, this.width * 0.5, this.height * 0.5);
    }
    context.restore();
  }

  increaseScoreBy(score) {
    this.score += score;
  }

  newWave() {
    if (
      Math.random() < 0.5 &&
      this.enemyCol * this.enemySize < this.width * 0.8
    ) {
      this.enemyCol++;
    } else if (this.enemyRow * this.enemySize < this.height * 0.6) {
      this.enemyRow++;
    }
    this.waves.push(new Wave(this));
  }
}

class Player {
  constructor(game) {
    this.game = game;
    this.width = 100;
    this.height = 100;
    this.x = (this.game.width - this.width) * 0.5;
    this.y = this.game.height - this.height;
    this.speed = 5;
    this.live = 3;
  }

  draw(context) {
    context.beginPath();
    context.rect(this.x, this.y, this.width, this.height);
    context.fillStyle = '#FF0000';
    context.fill();
    context.closePath();
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

  increaseLiveBy(live) {
    this.live <= 0 ? (this.live = 0) : (this.live += live);
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
      if (this.y < -this.height) this.reset();
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
  constructor(game, positionX, positionY) {
    this.game = game;
    this.width = this.game.enemySize;
    this.height = this.game.enemySize;
    this.x = 0;
    this.y = 0;
    this.positionX = positionX;
    this.positionY = positionY;
    this.isDead = false;
  }
  draw(context) {
    context.beginPath();
    context.strokeRect(this.x, this.y, this.width, this.height);
    context.fillStyle = '#FF0000';
    context.closePath();
  }
  update(x, y) {
    this.x = x + this.positionX;
    this.y = y + this.positionY;

    // enemies collides projectiles
    this.game.projectiles.forEach((p) => {
      if (!p.isFree && this.game.collisionDectection(this, p)) {
        this.isDead = true;
        p.reset();
        this.game.increaseScoreBy(1);
      }
    });

    // enemies collides player
    if (!this.isDead && this.game.collisionDectection(this, this.game.player)) {
      this.isDead = true;
      this.game.increaseScoreBy(-10);
      this.game.player.increaseLiveBy(-1);
      if (this.game.player.live < 1) this.game.gameOver = true;
    }

    // game over
    if (this.y + this.height > this.game.height) {
      this.game.gameOver = true;
      this.isDead = true;
    }
  }
}

class Wave {
  constructor(game) {
    this.game = game;
    this.width = this.game.enemyRow * this.game.enemySize;
    this.height = this.game.enemyCol * this.game.enemySize;
    this.x = 0;
    this.y = -this.height;
    this.speedX = 3;
    this.speedY = 0;
    this.speedFactor = 3;
    this.nextWave = false;
    this.enemies = [];
    this.createEnemy();
  }

  draw(context) {
    if (this.enemies) {
      this.enemies.forEach((e) => {
        e.draw(context);
      });
    }
  }

  update() {
    if (this.y < 0) this.y += 5;
    this.speedY = 0;
    if (this.x < 0 || this.x > this.game.width - this.width) {
      this.speedX = -this.speedX;
      this.speedY = this.game.enemySize * this.speedFactor;
    }

    this.x += this.speedX;
    this.y += this.speedY;

    this.enemies.forEach((e) => {
      e.update(this.x, this.y);
    });

    this.enemies = this.enemies.filter((e) => e.isDead === false);
  }

  createEnemy() {
    for (let col = 0; col < this.game.enemyCol; col++) {
      for (let row = 0; row < this.game.enemyRow; row++) {
        let enemyX = row * this.game.enemySize;
        let enemyY = col * this.game.enemySize;
        this.enemies.push(new Enemy(this.game, enemyX, enemyY));
      }
    }
  }
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
