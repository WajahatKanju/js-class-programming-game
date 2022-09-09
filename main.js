/** @type {HTMLCanvasElement} */

window.addEventListener("load", () => {
  const ctx = canvas.getContext("2d");
  const CANVAS_WIDTH = (ctx.canvas.width = innerWidth);
  const CANVAS_HEIGHT = (ctx.canvas.height = innerHeight);
  let previousTime = 0;
  let interval = 0;

  function generateRandomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  class Game {
    constructor(ctx) {
      this.ctx = ctx;
      this.width = this.ctx.canvas.width;
      this.height = this.ctx.canvas.height;
      this.enemyTiming = 200;
      this.timeToEnemy = 0;
      this.enemys = [];
    }
    draw() {
      this.ctx.clearRect(0, 0, this.width, this.height);
      [...this.enemys].forEach((object) => object.draw(this.ctx));
      [...this.enemys].forEach((object) => object.update());
    }
    update(deltaTime) {
      if (this.timeToEnemy > this.enemyTiming) {
        this.enemys = this.enemys.filter((enemy) => !enemy.markedForDeletion);
        this.timeToEnemy = 0;
        this.#addEnemy();
      } else {
        this.timeToEnemy += deltaTime;
      }
      this.draw();
    }

    #addEnemy() {
      Math.random() > 0.5 ? this.enemys.push(new Ghost(this)) : this.enemys.push(new Spider(this)); 
      // this.enemys.push(new Spider(this));
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.width = 100;
      this.height = 100;

      this.x = CANVAS_WIDTH;
      this.y = generateRandomBetween(0, this.game.height - this.height);
      this.dx = generateRandomBetween(10, 15);
      this.markedForDeletion = false;
    }
    draw(ctx) {
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
      this.x -= this.dx;
      if (this.x + this.width < 0) {
        this.markedForDeletion = true;
      }
    }
  }

  class Spider extends Enemy {
    constructor(game) {
      super(game);
      this.image = spider;
      this.rows = 6;
      this.cols = 1;
      this.spriteWidth = this.image.width / this.rows;
      this.spriteHeight = this.image.height / this.cols;
      this.sizeModifier = generateRandomBetween(0.3, 0.8);
      this.maximumHeight = generateRandomBetween(
        0,
        game.ctx.canvas.height / 2 + 100
      );
      this.width = this.spriteWidth * 0.5;
      this.height = this.spriteHeight * 0.5;
      this.frame = 0;
      this.dx = 0;
      this.dy = generateRandomBetween(5, 7);
      this.x = generateRandomBetween(0, game.ctx.canvas.width - this.width);
      this.y = -this.height;
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 2, 0);
      ctx.lineTo(this.x + this.width / 2, this.y);
      ctx.stroke();
      ctx.drawImage(
        this.image,
        this.spriteWidth * this.frame,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    update() {
      super.update();

      this.y += this.dy;
      if (this.y > this.maximumHeight) {
        this.dy = -this.dy;
      }
      if (this.y < -this.height * 2) {
        this.markedForDeletion = true;
      }
    }
  }

  class Ghost extends Enemy {
    constructor(game) {
      super(game);
      this.game = game;
      this.image = ghost;
      this.rows = 11;
      this.cols = 1;
      this.spriteWidth = this.image.width / this.rows;
      this.spriteHeight = this.image.height / this.cols;
      this.sizeModifier = generateRandomBetween(0.2, 0.5);
      this.maximumHeight = generateRandomBetween(
        0,
        game.ctx.canvas.height / 2 + 100
      );
      this.width = this.spriteWidth * this.sizeModifier;
      this.height = this.spriteHeight *this.sizeModifier;
      this.frame = 0;
      this.dx = generateRandomBetween(5, 7);
      this.dy = generateRandomBetween(1, 3);
      this.x = game.ctx.canvas.width;
      this.y = generateRandomBetween(0, game.ctx.canvas.height - this.height*2);
    }
    draw(ctx) {
      ctx.save();
      ctx.drawImage(
        this.image,
        this.spriteWidth * this.frame,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
        );
        ctx.restore();
    }
    update() {
      super.update();
      this.x -= this.dx;
      // if (this.x > 0) {
      //   this.markedForDeletion = true;
      // }
    }
  }
  let game = new Game(ctx);

  const animate = (timestamp) => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const deltaTime = timestamp - previousTime;
    interval += deltaTime;
    previousTime = timestamp;
    game.update(deltaTime);
  };
  animate(0);
});
