import { PrismaClient } from "@prisma/client";
import prisma from "./DbService";

class MapService {
  async loadMapById(id: number) {
    return await prisma.map.findUnique({
      where: { id: id },
      include: { cells: { include: { land: true } } },
    });
  }
}

export const mapService = new MapService();
