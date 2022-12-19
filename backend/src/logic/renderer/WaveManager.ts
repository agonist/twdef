import { log } from "../../tools/logger";
import { Enemy } from "../entity/enemy/Enemy";

interface WaveOb {
  num: number;
  enemies: Enemy[];
  inProgress: boolean;
}

export class WaveManager {
  waves: WaveOb[] = [];

  constructor() {}

  addWave(num: number, enemies: Enemy[]) {
    this.waves.push({ num: num, enemies: enemies, inProgress: true });
  }

  update() {
    this.waves.forEach((w, i) => {
      const alive = w.enemies.filter((e) => e.alive);
      if (alive.length == 0) {
        w.inProgress = false;
      }
      if (!w.inProgress) {
        log.info("Wave #" + w.num + " ended");
      }
    });

    const res = this.waves.filter((w) => w.inProgress);
    this.waves = res;
  }
}
