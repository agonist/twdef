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

interface GameCfg {
  waveInterval: number;
  enemiesPerWave: number;
  enemiesStats: EnemyCfg[];
}

export interface EnemyCfg {
  type: number;
  probability: number;
  multiplierEffect: number;
  life: number;
  cash: number;
  speed: number;
}

const gameCfg: GameCfg = {
  waveInterval: 5000, //ms
  enemiesPerWave: 5,
  enemiesStats: [
    {
      type: 0, // simple
      probability: 0.5,
      multiplierEffect: 1,
      life: 100,
      cash: 10,
      speed: 2.5,
    },
    {
      type: 1, // fast
      probability: 0.3,
      multiplierEffect: 1.5,
      life: 100,
      cash: 10,
      speed: 3,
    },
    {
      type: 2, // armored
      probability: 0.3,
      multiplierEffect: 2,
      life: 250,
      cash: 10,
      speed: 2.5,
    },
    {
      type: 3, // healer
      probability: 0.2,
      multiplierEffect: 1.2,
      life: 150,
      cash: 10,
      speed: 2.5,
    },
    {
      type: 4, //boss
      probability: 0.01,
      multiplierEffect: 10,
      life: 1000,
      cash: 10,
      speed: 2.5,
    },
  ],
};

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
      this.state.wave.multiplier = 1;
    }

    const waveInterval = gameCfg.waveInterval;
    interval(waveInterval).subscribe(async (x) => {
      this.sub?.unsubscribe();

      const multiplier =
        this.state.wave.multiplier !== undefined
          ? this.state.wave.multiplier
          : 1;
      const newMultiplier = this.room.game.waveManager.update(multiplier);

      wave = await waveService.nextWave(wave, newMultiplier);

      this.generateWave(wave);

      this.state.wave.multiplier = wave.multiplier;
      this.state.wave.count = wave.count;
    });
  }

  generateWave(wave: Wave) {
    const takes = gameCfg.enemiesPerWave;
    let enemies: Enemy[] = [];

    this.sub = interval(200)
      .pipe(take(takes))
      .subscribe((x) => {
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
              return this.map.getPathFromGridCell(i, j);
            });
            break;
          }
          case 1: {
            const eStats = gameCfg.enemiesStats[1];
            newEnemy = new ArmoredEnemy(0, 1, mult, eStats, (i, j) => {
              return this.map.getPathFromGridCell(i, j);
            });
            break;
          }
          case 2: {
            const eStats = gameCfg.enemiesStats[2];
            newEnemy = new FastEnemy(0, 1, mult, eStats, (i, j) => {
              return this.map.getPathFromGridCell(i, j);
            });
            break;
          }
          case 3: {
            const eStats = gameCfg.enemiesStats[3];
            newEnemy = new HealerEnemy(0, 1, mult, eStats, (i, j) => {
              return this.map.getPathFromGridCell(i, j);
            });
            break;
          }
          case 4: {
            const eStats = gameCfg.enemiesStats[4];
            newEnemy = new BossEnemy(0, 1, mult, eStats, (i, j) => {
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
