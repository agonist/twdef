import { Point } from "../../../tools/Point";
import { BulletRenderer } from "../../renderer/BulletRenderer";
import { EnemiesRenderer } from "../../renderer/EnemiesRenderer";
import { BasicBulletMunition } from "../bullet/BasicBulletMunition";
import { Enemy } from "../enemy/Enemy";
import {Tower} from "./Tower";



export class CanonTower extends Tower {
    public name = 'Canon';
    public description = 'Basic early game tower. Low cost, low damages.'
    public reloadDurationMs: number = 400;
    public damage: number = 25;
    public cost: number = 50;

    private readonly radius: number;
    private canonLength: number;
    public target: Enemy | undefined;
    private canonExtremity: Point;
    public aimRadius: number;
    public colors = {
        primary: '#556EE6',
        secondary: '#778BEB'
    };
    bulletRenderer: BulletRenderer
    
    constructor(enemyRenderer: EnemiesRenderer, bulletRenderer: BulletRenderer, x: number, y: number, width: number, id: number, owner: string, damage: number) {
        super(enemyRenderer, x, y, width, id, owner);
        this.bulletRenderer = bulletRenderer
        this.damage = damage
        this.radius = this.halfWidth * 0.8;
        this.canonLength = this.halfWidth * 1.2;
        this.canonExtremity = {
            x: this.center.x,
            y: this.center.y + this.canonLength
        }
        this.aimRadius = this.width * 2 + this.halfWidth;
    }

    shoot() {
        this.bulletRenderer.add(new BasicBulletMunition(this.target!, this));
        this.canonLength *= 0.8;
    }

    update() {
        this.canonLength = this.halfWidth * 1.2;

        super.update();

        if (this.target) {
            const angle = Math.atan2(this.target.y - this.center.y, this.target.x - this.center.x);

            this.canonExtremity.x = this.center.x + this.canonLength * Math.cos(angle);
            this.canonExtremity.y = this.center.y + this.canonLength * Math.sin(angle)
        }
    }

    // draw(ctx: CanvasRenderingContext2D): void {
    //     ctx.strokeStyle = this.colors.secondary;
    //     ctx.fillStyle = this.colors.primary;

    //     this.drawCanon(ctx)

    //     ctx.beginPath();
    //     ctx.lineWidth = 4;

    //     ctx.ellipse(this.center.x, this.center.y, this.radius, this.radius, 0, 0, PI2);
    //     ctx.fill()
    //     ctx.stroke()

    //     super.draw(ctx);
    // }

    // drawCanon(ctx: CanvasRenderingContext2D) {
    //     ctx.lineWidth = 12;

    //     ctx.beginPath()
    //     ctx.moveTo(this.center.x, this.center.y);
    //     ctx.lineTo(this.canonExtremity.x, this.canonExtremity.y);
    //     ctx.stroke()
    // }

    setCoordinates(x: number, y: number) {
        super.setCoordinates(x, y);

        this.canonExtremity = {
            x: this.center.x + this.canonLength,
            y: this.center.y
        }
    }

}