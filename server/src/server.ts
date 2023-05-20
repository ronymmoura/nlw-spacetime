import "dotenv/config";

import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { memoriesRoutes } from "./routes/memories";
import { usersRoutes } from "./routes/users";
import { authRoutes } from "./routes/auth";

const app = fastify();

app.register(cors, { origin: true });

app.register(jwt, {
  secret: "spwe8¨@$7rbyv#%c873ç48v9c34!$%acetime",
});

app.register(usersRoutes);
app.register(memoriesRoutes);
app.register(authRoutes);

app
  .listen({
    port: 3333,
    host: "0.0.0.0",
  })
  .then(() => {
    console.log("🚀 Server running on http://localhost:3333");
  });
