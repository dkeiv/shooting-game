class Projectile {
  constructor() {
    this.width = 4;
    this.height = 20;
    this.x = 0;
    this.y = CANVAS_HEIGHT;
    this.speed = 3;
    this.isFree = true;
  }

  draw(context) {
    if (!this.isFree) {
      context.beginPath();
      context.fillStyle = FILL_STYLE_COLOR;
      context.rect(this.x, this.y, this.width, this.height);
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
