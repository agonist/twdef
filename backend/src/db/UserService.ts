import prisma from "./DbService";

export class UserService {
  async findUserByAddress(address: string) {
    return await prisma.user.findUnique({ where: { address: address } });
  }

  async updateManyUserBalance(balance: Map<string, number>) {
    balance.forEach(async (v, k) => {
      
    });
  }

  async updateUserBalance(address: string, balance: number) {
    // prisma.user.updateMany({data:{address: address, balance: balance}})
    await prisma.user.upsert({
      where: { address: address },
      update: {
        address: address,
        balance: {
          increment: balance,
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
