/** @type {HTMLCanvasElement} */


window.addEventListener("load", () => {
  const ctx = canvas.getContext("2d");
  const CANVAS_WIDTH = (ctx.canvas.width = innerWidth);
  const CANVAS_HEIGHT = (ctx.canvas.height = innerHeight);
  let previousTime = 0;
  let interval = 0;

  function generateRandomBetween(min , max){
    return Math.random() * (max - min) + min;
  }
  

  class Game{
    constructor(ctx){
      this.ctx = ctx;
      this.width = this.ctx.canvas.width;
      this.height = this.ctx.canvas.height;
      this.enemyTiming = 200;
      this.timeToEnemy = 0;
      this.enemys = [];
    }
    draw(){
      this.ctx.clearRect(0, 0, this.width, this.height);
      [...this.enemys].forEach(object => object.draw(this.ctx));
      [...this.enemys].forEach(object => object.update());
    }
    update(deltaTime){
      if(this.timeToEnemy > this.enemyTiming ){
        this.enemys = this.enemys.filter(enemy => !enemy.markedForDeletion);
        this.timeToEnemy = 0;
        this.#addEnemy();
        console.log(this.enemys);
      }else{
        this.timeToEnemy += deltaTime;
      }
      this.draw();
    }

    #addEnemy(){
      this.enemys.push(new Enemy(this));
    }
  }

  class Enemy {
    constructor(game) {
      this.game = game;
      this.width = 100;
      this.height = 100;
      
      this.x = CANVAS_WIDTH;
      this.y = generateRandomBetween(0, this.game.height - this.height);
      this.dx = Math.random() * 10 + 5;
      this.markedForDeletion = false;
    }
    draw(ctx) {
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    update() {
      this.x -= this.dx;
      if(this.x + this.width < 0){
        this.markedForDeletion = true;
      }
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
