import { Scene, GameObjects, Cameras } from "phaser";

type ball = {
  x: number;
  y: number;
  v: number;
  a: number;
};

export class MainScene extends Scene {
  private helloLabel!: GameObjects.Text;
  private camera!: Cameras.Scene2D.Camera;

  private graphics!: GameObjects.Graphics;
  private balls: ball[] = [];

  init() {}

  update() {
    this.graphics.clear();
    this.graphics.fillStyle(0x9966ff, 1);

    for (let b in this.balls) {
      var ball = this.balls[b];
      ball.x += ball.v * Math.cos(ball.a);
      ball.y += ball.v * Math.sin(ball.a);
      // ball.a += 0.09;

      this.graphics.fillCircle(ball.x, ball.y, ball.a);
    }
  }

  create() {
    this.graphics = this.add.graphics();

    for (var i = 0; i < 2000; i++) {
      this.balls.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        v: 1,
        a: Math.random() * 2 * Math.PI,
      });
    }
  }
}
