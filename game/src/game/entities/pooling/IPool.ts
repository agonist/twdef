

export interface IPool extends Phaser.GameObjects.Group
{
	spawn: (x: number, y: number, key: string) => void
	despawn: (crate: Phaser.GameObjects.Arc) => void
}
