import { Entity } from "../entity/Entity";

export abstract class EntityRenderer<T extends Entity> {

protected entities: T[] = [];

    public add(entity: T) {
        this.entities.push(entity);
    }

    update() {
        this.entities.forEach(entity => entity.update());
    }

}