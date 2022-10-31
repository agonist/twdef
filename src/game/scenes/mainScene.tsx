import { Scene, GameObjects, Cameras } from "phaser";
import { gameState } from "../state/game-state";

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
  private text!: GameObjects.Text;

  private balls: ball[] = [];

  init() {}

  update() {
    this.graphics.clear();

    const color = gameState.getState().color;

    this.text.text = gameState.getState().txt;
    this.graphics.fillStyle(color, 1);

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

    this.text = this.add.text(200, 200, "");
    this.text.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);

    for (var i = 0; i < 500; i++) {
      this.balls.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        v: 1,
        a: Math.random() * 2 * Math.PI,
      });
    }
  }
}
