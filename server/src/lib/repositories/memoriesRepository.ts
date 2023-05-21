import { Memory } from "@prisma/client";
import { prisma } from "../prisma";

export const MemoriesRepository = {
  async get(id: string) {
    const memory = await prisma.memory.findUniqueOrThrow({
      where: { id },
    });

    return memory;
  },

  async list() {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return memories;
  },

  async listByUserId(userId: string) {
    const memories = await prisma.memory.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return memories;
  },

  async create(data: Memory) {
    const memory = await prisma.memory.create({ data });

    return memory;
  },

  async update(data: Memory) {
    const memory = await prisma.memory.update({ data, where: { id: data.id } });

    return memory;
  },

  async delete(id: string) {
    await prisma.memory.delete({
      where: { id },
    });
  },
};
