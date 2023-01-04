import { Entity } from "../entity/Entity";

export abstract class EntityRenderer<T extends Entity> {
  protected entities: T[] = [];
}
