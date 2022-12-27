import { Wave } from "@prisma/client";
import { map } from "lodash";
import { prisma } from "./DbService";

class WaveService {
  async createWave(mapId: number): Promise<Wave> {
    return await prisma.wave.create({
      data: {
        count: 1,
        multiplier: 1,
        mapId: mapId,
      },
    });
  }

  async getWaveByMapId(mapId: number): Promise<Wave | undefined> {
    const wave = await prisma.wave.findUnique({ where: { mapId: mapId } });
    return wave;
  }

  async nextWave(wave: Wave, increaseMultiplier: number): Promise<Wave> {
    return await prisma.wave.update({
      where: { mapId: wave.mapId },
      data: {
        count: wave.count + 1,
        multiplier: increaseMultiplier,
      },
    });
  }
}

export const waveService = new WaveService();
