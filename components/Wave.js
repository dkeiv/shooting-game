class Wave {
  constructor(game) {
    this.game = game;
    this.padding = 20;
    this.width = this.game.enemyRow * this.game.enemySize;
    this.height = this.game.enemyCol * this.game.enemySize;
    this.x = 0;
    this.y = -this.height;
    this.speedX = 1;
    this.speedY = 0;
    this.speedFactor = 5;
    this.nextWave = false;
    this.enemies = [];
    this.createEnemy();
  }

  draw(context) {
    if (this.enemies) {
      this.enemies.forEach((enemy) => {
        enemy.draw(context);
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

    this.enemies.forEach((enemy) => {
      enemy.update(this.x, this.y);
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
