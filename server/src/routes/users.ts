import { FastifyInstance } from "fastify";
import { z } from "zod";
import { UserRepository } from "../lib/repositories/userRepository";
import { User } from "@prisma/client";

export async function usersRoutes(app: FastifyInstance) {
  app.get("/users", async () => {
    return await UserRepository.list();
  });

  app.get("/users/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    return await UserRepository.get(id);
  });

  app.post("/users", async (request) => {
    const bodySchema = z.object({
      githubId: z.number(),
      name: z.string(),
      login: z.string(),
      avatarUrl: z.string(),
    });

    const data = bodySchema.parse(request.body);

    return await UserRepository.create(data as User);
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

    return await UserRepository.update(data as User);
  });

  app.delete("/users/:id", async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = paramsSchema.parse(request.params);

    await UserRepository.delete(id);
  });
}
