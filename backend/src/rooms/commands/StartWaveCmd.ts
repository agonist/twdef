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
import { log } from "../../tools/logger";

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
    let wave = await waveService.getWaveByMapId(this.room.mapId());
    if (wave == undefined) {
      wave = await waveService.createWave(this.room.mapId());
    }

    interval(5000).subscribe(async (x) => {
      this.sub?.unsubscribe();

      wave = await waveService.nextWave(wave);

      log.info(
        "Starting wave " + wave.count + " with multiplier " + wave.multiplier
      );

      let mult = wave.multiplier;
      this.generateWave(wave);
      this.state.wave.multiplier = mult;
      this.state.wave.count = wave.count;
    });
  }

  generateWave(wave: Wave) {
    this.sub = interval(200)
      .pipe(take(5))
      .subscribe((x) => {
        const r = Math.random();
        // /let mult = Math.floor(1 + Math.random() * (100 - 1 + 1));
        let mult = 1;
        if (r > 0.9) {
          this.enemiesRenderer.add(
            new BossEnemy(0, 1, mult, (i, j) => {
              return this.map.getPathFromGridCell(i, j);
            })
          );
        } else if (r > 0.8) {
          this.enemiesRenderer.add(
            new HealerEnemy(0, 1, mult, (i, j) => {
              return this.map.getPathFromGridCell(i, j);
            })
          );
        } else if (r > 0.7) {
          this.enemiesRenderer.add(
            new ArmoredEnemy(0, 1, mult, (i, j) => {
              return this.map.getPathFromGridCell(i, j);
            })
          );
        } else if (r > 0.5) {
          this.enemiesRenderer.add(
            new FastEnemy(0, 1, mult, (i, j) => {
              return this.map.getPathFromGridCell(i, j);
            })
          );
        } else {
          this.enemiesRenderer.add(
            new SimpleEnemy(0, 1, mult, (i, j) => {
              return this.map.getPathFromGridCell(i, j);
            })
          );
        }
      });
  }
}
