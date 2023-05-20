import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function usersRoutes(app: FastifyInstance) {
  app.get("/users", () => {
    const users = prisma.user.findMany();

    return users;
  });

  app.get("/users/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
    });

    return user;
  });

  app.post("/users", async (request) => {
    const bodySchema = z.object({
      githubId: z.number(),
      name: z.string(),
      login: z.string(),
      avatarUrl: z.string(),
    });

    const data = bodySchema.parse(request.body);

    const user = await prisma.user.create({ data });

    return user;
  });

  app.put("/users", async (request) => {
    const bodySchema = z.object({
      id: z.string().uuid(),
      githubId: z.number(),
      name: z.string(),
      login: z.string(),
      avatarUrl: z.string(),
    });

    const data = bodySchema.parse(request.body);

    const user = await prisma.user.update({ data, where: { id: data.id } });

    return user;
  });

  app.delete("/users/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    await prisma.user.delete({
      where: { id },
    });
  });
}
