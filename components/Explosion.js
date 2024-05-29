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
    this.timer++; // reduce animation speed
    if (this.timer % 6 === 0) {
      this.frame++;
    }
  }
}
