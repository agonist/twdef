import { Enemy } from "../enemy/Enemy";
import { IPool } from "./IPool";

const KEY_CRATE = 'crate'

class EnemyPool extends Phaser.GameObjects.Group implements IPool {

    constructor(scene: Phaser.Scene)
	{

		super(scene)

		this.createMultiple({
			classType: Enemy, // This is the class we create just below
			frameQuantity: 100, // Create 30 instances in the pool
			active: false,
			visible: false,
			key: KEY_CRATE
		})
	}

    spawn(x: number, y: number, key: string){
		const crate: Phaser.GameObjects.Arc = this.get(x, y, KEY_CRATE)

		crate.setVisible(true)
		crate.setActive(true)

		return crate
	}

    despawn(crate: Phaser.GameObjects.Arc) {
		this.killAndHide(crate)

		crate.alpha = 1
		crate.scale = 1
	};


}