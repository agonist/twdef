import { Command } from "@colyseus/command";

import { debounce, interval, Subscription, take } from "rxjs";
import { ArmoredEnemy } from "../../logic/entity/enemy/ArmoredEnemy";
import { BossEnemy } from "../../logic/entity/enemy/BossEnemy";
import { FastEnemy } from "../../logic/entity/enemy/FastEnemy";
import { HealerEnemy } from "../../logic/entity/enemy/HealerEnemy";
import { SimpleEnemy } from "../../logic/entity/enemy/SimpleEnemy";
import { Entity } from "../../logic/entity/Entity";
import { EnemiesRenderer } from "../../logic/renderer/EnemiesRenderer";
import { GameRoom } from "../GameRoom";

export class StartWaveCmd extends Command<GameRoom, {}> {

    sub: Subscription
    enemiesRenderer: EnemiesRenderer

    constructor(enemiesRenderer: EnemiesRenderer){
        super()
        this.enemiesRenderer = enemiesRenderer
    }

    execute() {
        this.generateWave()

         interval(10000)
        .subscribe( x => {
            this.sub?.unsubscribe()
            this.generateWave()
        })
    }

    generateWave() {
        this.sub = interval(200)
        .pipe(take(5))
        .subscribe(x => {
            const r = Math.random()

            const mult =  Math.floor(1 + Math.random()*(100 - 1 + 1))
            if (r > 0.9) {
                this.enemiesRenderer.add(new BossEnemy(1, 1, mult))
            } else if (r > 0.8) {
               this.enemiesRenderer.add(new HealerEnemy(1, 1, mult))
            } else if (r > 0.7) {
                this.enemiesRenderer.add(new ArmoredEnemy(1, 1, mult))
            }else if (r > 0.5) {
                this.enemiesRenderer.add(new FastEnemy(1, 1, mult))
            } else {
               this.enemiesRenderer.add(new SimpleEnemy(1, 1, mult))
            }
        })
    }

    generateRandomEnemy(){}

}