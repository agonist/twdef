import { Land, Tower, TowerType } from "@prisma/client";
import { TSMT$Bin } from "../tools/binning";
import { prisma } from "./DbService";

class TowerService {
  damagebinning: TSMT$Bin = new TSMT$Bin();
  speedBinning: TSMT$Bin = new TSMT$Bin();
  towerType: TSMT$Bin = new TSMT$Bin();

  constructor() {
    this.damagebinning.create([
      { percentage: 10, action: 22 },
      { percentage: 10, action: 24 },
      { percentage: 50, action: 25 },
      { percentage: 10, action: 27 },
      { percentage: 10, action: 28 },
      { percentage: 10, action: 30 },
    ]);

    this.speedBinning.create([
      { percentage: 10, action: 380 },
      { percentage: 10, action: 390 },
      { percentage: 50, action: 400 },
      { percentage: 10, action: 410 },
      { percentage: 10, action: 420 },
      { percentage: 10, action: 425 },
    ]);


  this.towerType.create([
    { percentage: 33, action: 1 },
    { percentage: 33, action: 2 },
    { percentage: 34, action: 3 },
  ]);
  }

  async findTowerById(id: number): Promise<Tower> {
    return await prisma.tower.findUnique({ where: { id: id } });
  }

  async createTower(id: number, type: number): Promise<Tower> {
    const damage = this.getDammage();
    const speed = this.getSpeed();
    const rtype = this.getRandomType();

    const tower = await prisma.tower.create({
      data: {
        id: id,
        damage: damage,
        speed: speed,
        level: 1,
        type: rtype.type,
        imgUrl: rtype.img
      },
    });
    return tower;
  }

  getDammage() {
    return this.damagebinning.nextAction();
  }

  getSpeed() {
    return this.speedBinning.nextAction();
  }

  getRandomType() {
    const type = this.towerType.nextAction();
    switch (type) {
      case 1: {
        return {
          type: TowerType.FIRE,
          img: "https://ipfs.filebase.io/ipfs/QmaBvXzNhCoQiBcpNQ9pkSt8W1NGQ2nUFD8yiN5r3U2cvQ",
        };
      }
      case 2: {
        return {
          type: TowerType.ICE,
          img: "https://ipfs.filebase.io/ipfs/QmNW8UQYpV8zvyv4ofgQykQ1ukjCoaTnnaJJuyJceog6S2",
        };
      }
      case 3: {
        return {
          type: TowerType.JUNGLE,
          img: "https://ipfs.filebase.io/ipfs/QmagomZJjdngXgzfFfzGA23TUFU44dgvcc8ivGeV1UoW4v",
        };
      }
    }
  }
}

export const towerService = new TowerService();
