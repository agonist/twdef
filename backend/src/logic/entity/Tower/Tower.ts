
import { euclideanDistanceSquared } from "../../../tools/helpers";
import { cellSize } from "../../GameLogic";
import { EnemiesRenderer } from "../../renderer/EnemiesRenderer";
import { Enemy } from "../enemy/Enemy";
import { Entity } from "../Entity";

const frameDuration = 1000 / 60;

export abstract class Tower extends Entity {
  abstract reloadDurationMs: number;
  abstract damage: number | { max: number; min: number };
  abstract aimRadius: number;
  
  abstract cost: number;
  private countdown: number = 0;
  protected canShoot: boolean = true;
  public traversable = false;
  abstract target: Enemy | undefined;

  abstract colors: {
    primary: string;
    secondary: string;
  };
  public targetInRange = false;
  abstract name: string;
  abstract description: string;

  enemyRenderer: EnemiesRenderer;

  public id:number

  constructor(
    enemyRenderer: EnemiesRenderer,
    x: number,
    y: number,
    width: number,
    id: number
  ) {
    super(x, y, width);
    this.id = id
    this.enemyRenderer = enemyRenderer;
  }

  update() {
    this.countdown += frameDuration;
    if (this.countdown >= this.reloadDurationMs) {
      this.canShoot = true;
      this.countdown = 0;
    }

    if (this.target && !this.target.alive) {
      // Target died
      this.target = undefined;
      this.targetInRange = false;
    } else if (
      this.target &&
      euclideanDistanceSquared(
        this.x + cellSize / 2,
        this.y + cellSize / 2,
        this.target.x,
        this.target.y
      ) <
        this.aimRadius * this.aimRadius
    ) {
      // Target in range
      if (!this.targetInRange) {
        this.onNewTargetInRange();
        this.targetInRange = true;
      }

      if (this.canShoot) {
        this.canShoot = false;
        this.shoot();
      }
    } else {
      // No target or target no more in range
      this.target = this.enemyRenderer.getClosestPointInRadius(
        this.x + cellSize / 2,
        this.y + cellSize / 2,
        this.aimRadius
      );
      this.targetInRange = false;
    }
  }

  protected shoot() {}

  protected onNewTargetInRange() {}
}
