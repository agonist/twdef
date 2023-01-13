import userService from "../../db/UserService";
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

  update(currentMultiplier: number, multReducer: number) {
    let increaseMultiplier = currentMultiplier;
    let playerBalanceAdd = new Map<string, number>();

    this.waves.forEach((w, i) => {
      const alive = w.enemies.filter((e) => e.alive);
      if (alive.length == 0) {
        w.inProgress = false;
      }
      if (!w.inProgress) {
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

        damageForWave.forEach((v, k) => {
          const rewardForAddr = (waveRewards / totalDamage) * v;
          const total = playerBalanceAdd.get(k);
          if (total === undefined) {
            playerBalanceAdd.set(k, rewardForAddr);
          } else {
            playerBalanceAdd.set(k, total + rewardForAddr);
          }
        });

        const deadEnemies = w.enemies.filter((e) => !e.dieFromWin);
        const aliveEnemies = w.enemies.filter((e) => e.dieFromWin);

        // takes dead ennemis and increase multiplier
        deadEnemies.forEach((d) => {
          increaseMultiplier =
            increaseMultiplier + d.multiplierEffect * multReducer;
        });

        // takes survivor ennemies and decrase multiplier
        aliveEnemies.forEach((d) => {
          if (increaseMultiplier - d.multiplierEffect * multReducer >= 1) {
            increaseMultiplier =
              increaseMultiplier - d.multiplierEffect * multReducer;
          } else {
            increaseMultiplier = 1;
          }
        });
      }
    });

    playerBalanceAdd.forEach(async (v, k) => {
      await userService.updateUserBalance(k, v);
    });

    this.waves = this.waves.filter((w) => w.inProgress);
    return increaseMultiplier;
  }
}
