const TEXT_COLOR = 'white';
const SPRITE_WIDTH = 16;
const SPRITE_HEIGHT = 16;

const SPRITE_URL = './assets/SpaceInvaders.png';
const SPRITE = new Image();
SPRITE.src = SPRITE_URL;

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.player = new Player(this);
    this.numberOfProjecttile = 5;
    this.projectiles = [];
    this.keys = [];

    this.enemyRow = 2;
    this.enemyCol = 2;
    this.enemySize = 60;

    this.waves = [];
    this.waves.push(new Wave(this));

    this.score = 0;
    this.gameOver = false;

    this.explosions = [];

    this.createProjectiles();

    this.started = false;

    window.addEventListener('keydown', (e) => {
      const index = this.keys.indexOf(e.key);
      if (index === -1) this.keys.push(e.key);
      if (e.key === ' ') this.player.shoot();
      if (e.key === 'r' && this.gameOver) this.restart();
      if (e.key === 'Enter' && !this.started) {
        console.log(e.key);
        this.started = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      const index = this.keys.indexOf(e.key);
      if (index > -1) this.keys.splice(index, 1);
    });
  }

  start(context) {
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

    this.explosions.forEach((explosion) => {
      explosion.update();
      explosion.draw(context);
      if (explosion.frame > 3) {
        this.explosions.splice(0, 1);
      }
    });
  }

  render(context) {
    if (this.started) {
      this.start(context);
    } else {
      context.save();

      context.textAlign = 'center';
      context.font = '50px Arial';
      context.fillStyle = 'white';
      context.fillText(
        `Press Enter to start!`,
        this.width * 0.5,
        this.height * 0.5
      );
      context.restore();
    }
    console.log(this.started);
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

    context.font = '30px Arial';
    context.fillText(`Score: ${this.score} `, 20, 40);
    context.fillText(`HP: ${this.player.live} `, 20, 80);
    if (this.gameOver) {
      context.textAlign = 'center';
      context.font = '50px Arial';
      context.fillText(`GAME OVER!`, this.width * 0.5, this.height * 0.5);

      context.font = '20px Arial';
      context.fillText(
        `Press "R" to restart`,
        this.width * 0.5,
        this.height * 0.5 + 30
      );
    }
    context.restore();
  }

  increaseScoreBy(score) {
    if (!this.gameOver) {
      this.score += score;
    }
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

  restart() {
    this.player.x = (this.width - this.player.width) * 0.5;
    this.player.y = this.height - this.player.height;
    this.player.live = 3;
    this.enemyRow = 2;
    this.enemyCol = 2;
    this.waves = [];
    this.waves.push(new Wave(this));

    this.score = 0;
    this.gameOver = false;
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
    this.sprite = { x: 4 * SPRITE_WIDTH, y: 0 * SPRITE_HEIGHT };
  }

  draw(context) {
    context.drawImage(
      SPRITE,
      this.sprite.x,
      this.sprite.y,
      SPRITE_WIDTH,
      SPRITE_HEIGHT,
      this.x,
      this.y,
      this.width,
      this.height
    );
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
    if (!this.game.gameOver) {
      const projectile = this.game.getProjectile();
      if (projectile) projectile.start(this.x + this.width * 0.5, this.y);
    }
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
      context.fillStyle = TEXT_COLOR;
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
    this.sprite = { x: 0, y: 0 };
    this.getSprite();
  }

  getSprite() {
    this.sprite.x = getRandomInt(2) * SPRITE_WIDTH;
    this.sprite.y = getRandomInt(5) * SPRITE_HEIGHT;
  }

  draw(context) {
    context.beginPath();
    context.strokeRect(this.x, this.y, this.width, this.height);
    context.fillStyle = TEXT_COLOR;
    context.closePath();
    context.drawImage(
      SPRITE,
      this.sprite.x,
      this.sprite.y,
      SPRITE_WIDTH,
      SPRITE_HEIGHT,
      this.x,
      this.y,
      this.width,
      this.height
    );
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
        this.game.explosions.push(new Explosion(this.x, this.y));
      }
    });

    // enemies collides player
    if (!this.isDead && this.game.collisionDectection(this, this.game.player)) {
      this.isDead = true;
      this.game.increaseScoreBy(-10);
      this.game.player.increaseLiveBy(-1);
      this.game.explosions.push(new Explosion(this.x, this.y));
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
    this.padding = 50;
    this.width = this.game.enemyRow * this.game.enemySize;
    this.height = this.game.enemyCol * this.game.enemySize;
    this.x = 0;
    this.y = -this.height;
    this.speedX = 1;
    this.speedY = 0;
    this.speedFactor = 0.5;
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

class Explosion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 100;
    this.height = 100;
    this.sprite = { x: 2 * SPRITE_WIDTH, y: 2 * SPRITE_HEIGHT };
    this.timer = 0;
    this.frame = 0;
  }

  draw(context) {
    context.drawImage(
      SPRITE,
      this.sprite.x,
      this.sprite.y + this.frame * SPRITE_HEIGHT,
      SPRITE_WIDTH,
      SPRITE_HEIGHT,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update() {
    this.timer++;
    if (this.timer % 6 === 0) {
      this.frame++;
    }
  }
}

window.addEventListener('load', () => {
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');

  canvas.width = 500;
  canvas.height = 700;

  const game = new Game(canvas);

  function animate() {
    game.render(ctx);
    window.requestAnimationFrame(animate);
  }
  animate();
});
