const FILL_STYLE_COLOR = 'white';
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 700;
const SPRITE_WIDTH = 16;
const SPRITE_HEIGHT = 16;

const SPRITE_URL = './assets/SpaceInvaders.png';
const SPRITE = new Image();
SPRITE.src = SPRITE_URL;

const getRandomInt = (max) => Math.floor(Math.random() * max);
const collisionDectection = (rect1, rect2) => {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }