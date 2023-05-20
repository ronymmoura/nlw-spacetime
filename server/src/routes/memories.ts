import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { z } from "zod";

export async function memoriesRoutes(app: FastifyInstance) {
  app.get("/memories", async () => {
    const memories = await prisma.memory.findMany({
      orderBy: {
        createdAt: "asc",
      },
    });

    return memories.map((memory) => ({
      ...memory,
      excerpt: memory.content.substring(0, 115).concat("..."),
    }));
  });

  app.get("/memories/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const memory = await prisma.memory.findUniqueOrThrow({
      where: { id },
    });

    return memory;
  });

  app.post("/memories", async (request) => {
    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string().default("https://github.com/ronymmoura.png"),
      userId: z.string().default("c65568d6-6aa5-432c-ad31-4ee66988d553"),
      isPublic: z.coerce.boolean().default(false),
    });

    const data = bodySchema.parse(request.body);

    const memory = await prisma.memory.create({ data });

    return memory;
  });

  app.put("/memories", async (request) => {
    const bodySchema = z.object({
      id: z.string().uuid(),
      content: z.string(),
      coverUrl: z.string(),
      userId: z.string(),
      isPublic: z.coerce.boolean(),
    });

    const data = bodySchema.parse(request.body);

    const memory = await prisma.memory.update({ data, where: { id: data.id } });

    return memory;
  });

  app.delete("/memories/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    await prisma.memory.delete({
      where: { id },
    });
  });
}
