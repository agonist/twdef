import { rearg } from "lodash";
import { userService } from "../../db/UserService";
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

  update(currentMultiplier: number) {
    let increaseMultiplier = currentMultiplier;
    let playerBalanceAdd = new Map<string, number>();
    this.waves.forEach((w, i) => {
      const alive = w.enemies.filter((e) => e.alive);
      if (alive.length == 0) {
        w.inProgress = false;
      }
      if (!w.inProgress) {
        // log.info("Wave #" + w.num + " ended");
        const damageForWave: Map<string, number> = new Map();
        let totalDamage = 0;
        let waveRewards = 0;
        w.enemies
          .filter((e) => !e.dieFromWin)
          .forEach((e) => {
            e.damageFrom.forEach((v, k) => {
              if (damageForWave.has(k)) {
                damageForWave.set(k, damageForWave.get(k) + v);
              } else {
                damageForWave.set(k, v);
              }
              totalDamage += v;
            });
            waveRewards += e.cash;
          });
        log.info(
          `Wave #${w.num} ended with ${totalDamage} total dmg and ${waveRewards} token dropped`
        );
        damageForWave.forEach(async (v, k) => {
          const rewardForAddr = (waveRewards / totalDamage) * v;
          const total = playerBalanceAdd.get(k);
          if (total === undefined) {
            playerBalanceAdd.set(k, rewardForAddr);
          } else {
            playerBalanceAdd.set(k, total + rewardForAddr);
          }
          log.info(`${k} gets ${rewardForAddr} tokens`);
        });

        const aliveEnemies = w.enemies.filter((e) => e.dieFromWin).length;
        if (aliveEnemies > 1 && increaseMultiplier >= 1.01) {
          increaseMultiplier -= 0.1;
        }
        if (aliveEnemies === 0) {
          increaseMultiplier += 0.1;
        }
      }
    });

    playerBalanceAdd.forEach(async (v, k) => {
      await userService.updateUserBalance(k, v);
    });

    const res = this.waves.filter((w) => w.inProgress);
    this.waves = res;
    return increaseMultiplier;
  }
}
