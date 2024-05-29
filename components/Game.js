class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.player = new Player(this);

    this.numberOfProjecttile = 5;
    this.projectiles = [];
    this.createProjectiles();

    this.keys = [];

    this.enemyRow = 2;
    this.enemyCol = 2;
    this.enemySize = 48;

    this.waves = [];
    this.waves.push(new Wave(this));

    this.score = 0;
    this.gameOver = false;

    this.explosions = [];

    this.started = false;

    this.highscore = this.getHighscore();

    this.debug = false;

    window.addEventListener('keydown', (e) => {
      const index = this.keys.indexOf(e.key);
      if (index === -1) this.keys.push(e.key);
      if (e.key === ' ') this.player.shoot();
      if (e.key === 'r' && this.gameOver) this.restart();
      if (e.key === 'Enter' && !this.started) {
        this.started = true;
        bgMusic.play();
      }
      if (e.key === 'g') this.toggleDebug();
    });

    window.addEventListener('keyup', (e) => {
      const index = this.keys.indexOf(e.key);
      if (index > -1) this.keys.splice(index, 1);
    });
  }

  play(context) {
    this.drawStatus(context);

    this.player.draw(context);
    this.player.update();

    this.projectiles.forEach((p) => {
      p.update();
      p.draw(context);
    });

    this.waves.forEach((w) => {
      w.update();
      w.draw(context);

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
      this.play(context);
    } else {
      context.save();
      context.textAlign = 'center';
      context.font = '50px Arial';
      context.fillStyle = FILL_STYLE_COLOR;
      context.fillText(
        `Press Enter to start!`,
        this.width * 0.5,
        this.height * 0.5
      );
      context.restore();
    }
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

  drawStatus(context) {
    context.save();

    context.font = '30px Arial';
    context.fillStyle = FILL_STYLE_COLOR;
    context.fillText(`Score: ${this.score} `, 20, 40);
    context.fillText(`HP: ${this.player.live} `, 20, 80);
    context.fillText(`High score: ${this.highscore} `, 20, 120);

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

    if (this.score >= this.highscore) {
      this.highscore = this.score;
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

  over() {
    this.gameOver = true;
    gameOverSound.play();
  }

  toggleDebug() {
    this.debug = !this.debug;
  }

  saveHighscore() {
    const last = window.localStorage.getItem('highscore');
    if (this.highscore > last)
      window.localStorage.setItem('highscore', this.highscore);
  }

  getHighscore() {
    return window.localStorage.getItem('highscore')
      ? window.localStorage.getItem('highscore')
      : 0;
  }
}
