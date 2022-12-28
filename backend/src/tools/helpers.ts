import { TowerType } from "@prisma/client";

export const euclideanDistanceSquared = (x1: number, y1: number, x2: number, y2: number) => {
    const deltaX = x1 - x2;
    const deltaY = y1 - y2;
    return deltaX * deltaX + deltaY * deltaY;
}

  export function getTowerType(towerType: TowerType) {
     switch (towerType) {
       case TowerType.FIRE: {
         return 0;
       }
       case TowerType.ICE: {
         return 1;
       }
       case TowerType.JUNGLE: {
         return 2;
       }
     }
  }