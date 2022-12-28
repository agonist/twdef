import { Command } from "@colyseus/command";
import { Wave } from "@prisma/client";

import { debounce, interval, Subscription, take } from "rxjs";
import { waveService } from "../../db/WaveService";
import { ArmoredEnemy } from "../../logic/entity/enemy/ArmoredEnemy";
import { BossEnemy } from "../../logic/entity/enemy/BossEnemy";
import { FastEnemy } from "../../logic/entity/enemy/FastEnemy";
import { HealerEnemy } from "../../logic/entity/enemy/HealerEnemy";
import { SimpleEnemy } from "../../logic/entity/enemy/SimpleEnemy";
import { Map } from "../../logic/Map";
import { EnemiesRenderer } from "../../logic/renderer/EnemiesRenderer";
import { GameRoom } from "../GameRoom";
import { Enemy } from "../../logic/entity/enemy/Enemy";
import weightedRandom from "../utils/wightedrandom";

export class StartWaveCmd extends Command<GameRoom, {}> {
  sub: Subscription;
  enemiesRenderer: EnemiesRenderer;
  map: Map;

  constructor(enemiesRenderer: EnemiesRenderer, map: Map) {
    super();
    this.enemiesRenderer = enemiesRenderer;
    this.map = map;
  }

  async execute() {
    // try to restore the last wave or start from 0 if new map
    let wave = await waveService.getWaveByMapId(this.room.mapId());
    if (wave == undefined) {
      wave = await waveService.createWave(this.room.mapId());
    }

    const waveInterval = 5000;
    interval(waveInterval).subscribe(async (x) => {
      this.sub?.unsubscribe();

      const increaseMultiplier = this.room.game.waveManager.update(
        this.state.wave.multiplier
      );

      wave = await waveService.nextWave(wave, increaseMultiplier);

      this.generateWave(wave);

      this.state.wave.multiplier = wave.multiplier;
      this.state.wave.count = wave.count;
    });
  }

  generateWave(wave: Wave) {
    const takes = 5;
    let enemies: Enemy[] = [];

    this.sub = interval(200)
      .pipe(take(takes))
      .subscribe((x) => {
        let newEnemy: Enemy;

        let mult = wave.multiplier;

        let mob = [1, 2, 3, 4, 5];
        let weight = [0.5, 0.3, 0.3, 0.2, 0.01];
        const mobGen = weightedRandom(mob, weight);

        switch (mobGen.item) {
          case 1: {
            newEnemy = new SimpleEnemy(0, 1, mult, (i, j) => {
              return this.map.getPathFromGridCell(i, j);
            });
            break;
          }
          case 2: {
            newEnemy = new ArmoredEnemy(0, 1, mult, (i, j) => {
              return this.map.getPathFromGridCell(i, j);
            });
            break;
          }
          case 3: {
            newEnemy = new FastEnemy(0, 1, mult, (i, j) => {
              return this.map.getPathFromGridCell(i, j);
            });
            break;
          }
          case 4: {
            newEnemy = new HealerEnemy(0, 1, mult, (i, j) => {
              return this.map.getPathFromGridCell(i, j);
            });
            break;
          }
          case 5: {
            newEnemy = new BossEnemy(0, 1, mult, (i, j) => {
              return this.map.getPathFromGridCell(i, j);
            });
            break;
          }
        }

        this.enemiesRenderer.add(newEnemy);
        enemies.push(newEnemy);
        if (x + 1 === takes) {
          this.room.game.waveManager.addWave(wave.count, enemies);
        }
      });
  }
}
