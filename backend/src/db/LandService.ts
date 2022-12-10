import { Land } from "@prisma/client";
import { prisma } from "./DbService";

class LandService {
  async findLandById(id: number, includeCell: boolean = false): Promise<Land> {
    return await prisma.land.findUnique({
      where: { id: id },
      include: { Cell: includeCell },
    });
  }

  async findLandByIdwithCell(id: number) {
    return await prisma.land.findUnique({
      where: { id: id },
      include: { Cell: true },
    });
  }

  async updateLandToMinted(id: number) {
    await prisma.land.update({ where: { id: id }, data: { minted: true } });
  }
}

export const landService = new LandService();
