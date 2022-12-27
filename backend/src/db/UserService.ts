import { add } from "lodash";
import { prisma } from "./DbService";

export class UserService {
  async findUserByAddress(address: string) {
    return await prisma.user.findUnique({where: {address: address}})
  }

  async updateUserBalance(address: string, balance: number) {
    await prisma.user.upsert({
      where: { address: address },
      update: { 
        address: address,
        balance: {
            increment: balance
        },
      },
      create: {
        address: address,
        balance: balance,
      },
    });
  }
}

export const userService = new UserService();
