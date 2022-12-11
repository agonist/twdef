import { InGame, Land } from "@prisma/client";
import { prisma } from "./DbService";
import { landService } from "./LandService";

class GamezService {
  async findGameByLandId(landId: number): Promise<InGame> {
    return await prisma.inGame.findUnique({ where: { landId: landId } });
  }

  async create(towerId: number, landId: number): Promise<InGame> {
    const land = await prisma.land.findUnique({
      where: { id: landId },
      include: { Cell: true },
    });

    const inGame = await prisma.inGame.create({
      data: {
        towerId: towerId,
        landId: landId,
        mapId: land.Cell.mapId,
      },
    });

    return inGame;
  }

  async remove(towerId: number, landId: number) {
    await prisma.inGame.delete({ where: { landId: landId } });
  }

  async updateLandToMinted(id: number) {
    await prisma.land.update({ where: { id: id }, data: { minted: true } });
  }
}

export const gameService = new GamezService();
