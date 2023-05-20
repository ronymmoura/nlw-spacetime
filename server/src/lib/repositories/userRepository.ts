import { User } from "@prisma/client";
import { prisma } from "../prisma";

export const UserRepository = {
  async get(id: string) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
    });

    return user;
  },

  async list() {
    const users = prisma.user.findMany();

    return users;
  },

  async create(data: Omit<User, "id">) {
    const user = await prisma.user.create({ data });

    return user;
  },

  async update(data: User) {
    const user = await prisma.user.update({ data, where: { id: data.id } });

    return user;
  },

  async delete(id: string) {
    await prisma.user.delete({
      where: { id },
    });
  },
};
