class Player {
  constructor(game) {
    this.game = game;
    this.width = 80;
    this.height = 80;
    this.x = (this.game.width - this.width) * 0.5;
    this.y = this.game.height - this.height;
    this.speed = 5;
    this.live = 3;
    this.sprite = { x: 4 * SPRITE_WIDTH, y: 0 * SPRITE_HEIGHT };
  }

  draw(context) {
    if (this.game.debug) {
      context.strokeStyle = FILL_STYLE_COLOR;
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

  update() {
    if (this.game.keys.indexOf('ArrowLeft') > -1) {
      this.x = Math.max(this.x - this.speed, 0);
    }
    if (this.game.keys.indexOf('ArrowRight') > -1) {
      this.x = Math.min(this.x + this.speed, this.game.width - this.width);
    }

    if (this.game.player.live < 1) {
      this.dead();
    }
  }

  shoot() {
    if (!this.game.gameOver) {
      const projectile = this.game.getProjectile();
      if (projectile && this.game.started) {
        lazerSound.play();
        projectile.start(this.x + this.width * 0.5, this.y);
      }
    }
  }

  increaseLiveBy(live) {
    this.live <= 0 ? (this.live = 0) : (this.live += live);
  }

  dead() {
    this.game.over();
    this.game.saveHighscore();
  }
}
