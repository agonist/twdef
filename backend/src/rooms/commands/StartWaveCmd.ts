import { Command } from "@colyseus/command";

import { debounce, interval, Subscription, take } from "rxjs";
import { FastEnemy } from "../../logic/entity/enemy/FastEnemy";
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
            if (Math.random() > 0.7) {
                this.enemiesRenderer.add(new FastEnemy(10, 10))
            } else {
                this.enemiesRenderer.add(new SimpleEnemy(10, 10))
            }
        })
    }

    generateRandomEnemy(){}

}