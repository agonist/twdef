import { InGame, Land, Tower } from "@prisma/client";
import prisma from "./DbService";

class GamezService {
  async findGameByLandId(landId: number): Promise<InGame> {
    return await prisma.inGame.findUnique({ where: { landId: landId } });
  }

  async findGameByMapId(
    mapId: number
  ): Promise<(InGame & { tower: Tower; land: Land })[]> {
    return await prisma.inGame.findMany({
      where: { mapId },
      include: { tower: true, land: true },
    });
  }

  async create(towerId: number, landId: number, from: string): Promise<InGame> {
    const land = await prisma.land.findUnique({
      where: { id: landId },
      include: { Cell: true },
    });

    try {
      const inGame = await prisma.inGame.create({
        data: {
          towerId: towerId,
          landId: landId,
          mapId: land.Cell.mapId,
          x: land.Cell.x,
          y: land.Cell.y,
          owner: from,
        },
      });
      return inGame;
    } catch (e) {}
  }

  async remove(towerId: number, landId: number) {
    await prisma.inGame.delete({ where: { landId: landId } });
  }

  async updateLandToMinted(id: number) {
    await prisma.land.update({ where: { id: id }, data: { minted: true } });
  }

  async stakedCount(mapId: number) {
    return await prisma.inGame.count({ where: { mapId: mapId } });
  }
}

const gameService = new GamezService();
export default gameService;
