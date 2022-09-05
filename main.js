/** @type {HTMLCanvasElement} */

window.addEventListener("load", () => {
  const ctx = canvas.getContext("2d");
  const CANVAS_WIDTH = (ctx.canvas.width = innerWidth);
  const CANVAS_HEIGHT = (ctx.canvas.height = innerHeight);
  let enemys = [];
  let previousTime = 0;
  let interval = 0;

  class Enemy {
    constructor() {
      this.width = 100;
      this.height = 100;
      
      this.x = CANVAS_WIDTH;
      this.y = Math.random() * CANVAS_WIDTH - this.width;
      this.dx = Math.random() * 10;
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

  const animate = (timestamp) => {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    const deltaTime = timestamp - previousTime;
    interval += deltaTime;
    previousTime = timestamp;
    if(interval > 1000){
      enemys.push(new Enemy());
      interval = 0;
    }
    enemys.forEach(enemy => enemy.update());
    enemys.forEach(enemy => enemy.draw(ctx));
    enemys = enemys.filter(enemy => !enemy.markedForDeletion);
    console.log(enemys);
  };
  animate(0);
});
