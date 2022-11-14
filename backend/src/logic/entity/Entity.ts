export abstract class Entity {

    public x: number;
    public y: number;
    public width: number;
    public center!: {
        x: number;
        y: number;
    };
    public halfWidth!: number;
    public isHovered = false;
    public top!: number;
    public bottom!: number;
    public left!: number;
    public right!: number;
    public j: number;
    public i: number;

   constructor(i: number, j: number, width: number = 0) {
        this.i = i;
        this.j = j;
        this.width = width
        this.setCoordinates(i * width, j * width);
    }

    abstract update(): void;

    setCoordinates(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.halfWidth = this.width / 2;
        this.center = {
            x: this.x + this.width / 2,
            y: this.y + this.width / 2,
        }
        this.top = this.y;
        this.bottom = this.y + this.width;
        this.left = this.x;
        this.right = this.x + this.width;
    }
}