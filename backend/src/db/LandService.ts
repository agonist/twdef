import { Land } from "@prisma/client";
import { prisma } from "./DbService";

class LandService {
  async findLandById(id: number): Promise<Land> {
    return await prisma.land.findUnique({ where: { id: id } });
  }

  async updateLandToMinted(id: number) {
    await prisma.land.update({ where: { id: id }, data: { minted: true } });
  }
}

export const landService = new LandService();
