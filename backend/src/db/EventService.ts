import { PrismaClient } from "@prisma/client";
import { log } from "../tools/logger";
import prisma from "./DbService";

class EventService {
  async getLastBlockEvent() {
    return await (
      await prisma.event.findUnique({ where: { id: 1 } })
    ).lastBlock;
  }

  async updateLastBlockEvent(block: number) {
    log.info("updating last block to " + block);
    await prisma.event.update({ where: { id: 1 }, data: { lastBlock: block } });
  }
}

const eventService = new EventService();
export default eventService;
