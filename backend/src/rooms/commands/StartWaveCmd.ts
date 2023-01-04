import { Command } from "@colyseus/command";
import { Wave } from "@prisma/client";
import { waveService } from "../../db/WaveService";
import { ArmoredEnemy } from "../../logic/entity/enemy/ArmoredEnemy";
import { BossEnemy } from "../../logic/entity/enemy/BossEnemy";
import { FastEnemy } from "../../logic/entity/enemy/FastEnemy";
import { HealerEnemy } from "../../logic/entity/enemy/HealerEnemy";
import { SimpleEnemy } from "../../logic/entity/enemy/SimpleEnemy";
import { GameRoom } from "../GameRoom";
import { Enemy } from "../../logic/entity/enemy/Enemy";
import weightedRandom from "../utils/wightedrandom";
import { GameCfg, GameConfigProvider } from "../utils/ConfigProvider";
import { Delayed } from "colyseus";

export class StartWaveCmd extends Command<GameRoom, {}> {
  async execute() {
    // try to restore the last wave or start from 0 if new map
    let wave = await waveService.getWaveByMapId(this.room.mapId());
    if (wave == undefined) {
      wave = await waveService.createWave(this.room.mapId());
      this.state.wave.multiplier = 1;
    }

    const waveInterval =
      GameConfigProvider.getInstance().getCfonfig().waveInterval;

    const gameCfg = GameConfigProvider.getInstance().getCfonfig();

    const multiplier =
      this.state.wave.multiplier !== undefined ? this.state.wave.multiplier : 1;
    const newMultiplier = this.room.game.waveManager.update(multiplier);

    wave = await waveService.nextWave(wave, newMultiplier);

    this.generateWave(wave, gameCfg);

    this.state.wave.multiplier = wave.multiplier;
    this.state.wave.count = wave.count;
  }

  generateWave(wave: Wave, gameCfg: GameCfg) {
    const takes = gameCfg.enemiesPerWave;
    let enemies: Enemy[] = [];

    let count = 0;

    let delayedInterval!: Delayed;
    delayedInterval = this.clock.setInterval(() => {
      let newEnemy: Enemy;

      let mult = wave.multiplier;

      let mob = [0, 1, 2, 3, 4];
      let weight = [
        gameCfg.enemiesStats[0].probability,
        gameCfg.enemiesStats[1].probability,
        gameCfg.enemiesStats[2].probability,
        gameCfg.enemiesStats[3].probability,
        gameCfg.enemiesStats[4].probability,
      ];
      const mobGen = weightedRandom(mob, weight);

      switch (mobGen.item) {
        case 0: {
          const eStats = gameCfg.enemiesStats[0];
          newEnemy = new SimpleEnemy(0, 1, mult, eStats, (i, j) => {
            return this.room.game.map.getPathFromGridCell(i, j);
          });
          break;
        }
        case 1: {
          const eStats = gameCfg.enemiesStats[1];
          newEnemy = new ArmoredEnemy(0, 1, mult, eStats, (i, j) => {
            return this.room.game.map.getPathFromGridCell(i, j);
          });
          break;
        }
        case 2: {
          const eStats = gameCfg.enemiesStats[2];
          newEnemy = new FastEnemy(0, 1, mult, eStats, (i, j) => {
            return this.room.game.map.getPathFromGridCell(i, j);
          });
          break;
        }
        case 3: {
          const eStats = gameCfg.enemiesStats[3];
          newEnemy = new HealerEnemy(0, 1, mult, eStats, (i, j) => {
            return this.room.game.map.getPathFromGridCell(i, j);
          });
          break;
        }
        case 4: {
          const eStats = gameCfg.enemiesStats[4];
          newEnemy = new BossEnemy(0, 1, mult, eStats, (i, j) => {
            return this.room.game.map.getPathFromGridCell(i, j);
          });
          break;
        }
      }

      this.room.game.enemiesRenderer.add(newEnemy);
      enemies.push(newEnemy);
      if (count + 1 === takes) {
        this.room.game.waveManager.addWave(wave.count, enemies);
      }

      count++;

      if (count === takes) {
        console.log("Clearing the interval id after 5 executions");
        delayedInterval.clear();
      }
    }, 200);
  }
}
