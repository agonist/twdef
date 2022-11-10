export abstract class Entity {
    public x: number;
    public y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    abstract update(): void;

    setCoordinates(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}