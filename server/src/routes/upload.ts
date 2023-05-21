import { FastifyInstance } from "fastify";

import fs from "node:fs";
import util from "node:util";
import { pipeline } from "node:stream";
import { randomUUID } from "node:crypto";
import { extname, resolve } from "node:path";

const pump = util.promisify(pipeline);

export async function uploadRoutes(app: FastifyInstance) {
  app.post("/upload", async (request, reply) => {
    const upload = await request.file({
      limits: {
        fileSize: 5_242_880, // 5mb
      },
    });

    if (!upload) {
      return reply.status(400).send();
    }

    const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/;
    const isValidFileFormat = mimeTypeRegex.test(upload.mimetype);

    if (!isValidFileFormat) {
      return reply.status(400).send();
    }

    const fileId = randomUUID();
    const extension = extname(upload.filename);
    const filename = fileId.concat(extension);

    await pump(
      upload.file,
      fs.createWriteStream(resolve(__dirname, "../../uploads/", filename))
    );

    const fullUrl = request.protocol.concat("://").concat(request.hostname);
    const fileUrl = new URL(`/uploads/${filename}`, fullUrl).toString();

    return { fileUrl };
  });
}
