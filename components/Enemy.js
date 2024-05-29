class Enemy {
  constructor(game, positionX, positionY) {
    this.game = game;
    this.width = this.game.enemySize;
    this.height = this.game.enemySize;
    this.x = 0;
    this.y = 0;
    this.positionX = positionX; // position in a wave
    this.positionY = positionY;
    this.isDead = false;
    this.sprite = { x: 0, y: 0 };
    this.setSprite();
    this.live = 2;
    this.score = 1;
  }

  setSprite() {
    this.sprite.x = 0;
    this.sprite.y = getRandomInt(5) * SPRITE_HEIGHT;
  }

  updateSprite() {
    this.sprite.x = 1 * SPRITE_WIDTH;
  }

  draw(context) {
    if (this.game.debug) {
      context.fillStyle = FILL_STYLE_COLOR;
      context.strokeRect(this.x, this.y, this.width, this.height);
    }

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

    // enemy collides projectiles
    this.game.projectiles.forEach((p) => {
      if (!p.isFree && collisionDectection(this, p)) {
        this.live--;
        this.updateSprite();
        if (this.live < 1) {
          this.isDead = true;
          this.game.explosions.push(new Explosion(this.x, this.y));
        }
        p.reset();
        this.game.increaseScoreBy(this.score);
      }
    });

    // enemy collides player
    if (!this.isDead && collisionDectection(this, this.game.player)) {
      this.isDead = true;
      this.game.explosions.push(new Explosion(this.x, this.y));

      this.game.increaseScoreBy(-5);
      this.game.player.increaseLiveBy(-1);

      if (this.game.player.live < 1) {
        this.game.gameOver = true;
        this.game.saveHighscore();
      }
    }

    // game over. Enemy reachs bottom
    if (this.y + this.height > this.game.height) {
      this.game.gameOver = true;
      this.isDead = true;
      this.game.saveHighscore();
    }
  }
}
