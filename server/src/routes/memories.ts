import { FastifyInstance } from "fastify";
import { z } from "zod";
import { MemoriesRepository } from "../lib/repositories";
import { Memory } from "@prisma/client";

export async function memoriesRoutes(app: FastifyInstance) {
  app.addHook("preHandler", async (request) => {
    await request.jwtVerify();
  });

  app.get("/memories", async (request) => {
    const { sub: userId } = request.user;

    const memories = await MemoriesRepository.listById(userId);

    return memories.map((memory) => ({
      ...memory,
      excerpt: memory.content.substring(0, 115).concat("..."),
    }));
  });

  app.get("/memories/:id", async (request, reply) => {
    const { sub: userId } = request.user;

    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const memory = await MemoriesRepository.get(id);

    if (!memory.isPublic && memory.userId !== userId) {
      return reply.status(401).send();
    }

    return memory;
  });

  app.post("/memories", async (request) => {
    const { sub: userId } = request.user;

    const bodySchema = z.object({
      content: z.string(),
      coverUrl: z.string().default("https://github.com/ronymmoura.png"),
      isPublic: z.coerce.boolean().default(false),
    });

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body);

    return await MemoriesRepository.create({
      content,
      coverUrl,
      isPublic,
      userId,
    } as Memory);
  });

  app.put("/memories", async (request, reply) => {
    const { sub: userId } = request.user;

    const bodySchema = z.object({
      id: z.string().uuid(),
      content: z.string(),
      coverUrl: z.string(),
      userId: z.string(),
      isPublic: z.coerce.boolean(),
    });

    const data = bodySchema.parse(request.body);

    const memory = await MemoriesRepository.get(data.id);

    if (!memory.isPublic && memory.userId !== userId) {
      return reply.status(401).send();
    }

    return await MemoriesRepository.update(data as Memory);
  });

  app.delete("/memories/:id", async (request, reply) => {
    const { sub: userId } = request.user;

    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    const memory = await MemoriesRepository.get(id);

    if (!memory.isPublic && memory.userId !== userId) {
      return reply.status(401).send();
    }

    await MemoriesRepository.delete(id);
  });
}
