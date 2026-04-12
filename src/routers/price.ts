import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import priceHandler from "../controllers/price";

const cache: { data?: any; expiry?: number } = {};

const priceRouters = async (app: FastifyInstance) => {
  app.get("/latest", async (request: FastifyRequest, reply: FastifyReply) => {
    const now = Date.now();
    if (cache.data && cache.expiry && cache.expiry > now) {
      reply.code(200).send(cache.data);
      return;
    }

    const data = await priceHandler();
    const response = {
      status: data.status,
      response: data.response,
    };
    cache.data = response;
    cache.expiry = now + 60 * 1000; // 1 minute
    reply.code(200).send(response);
  });
};

export default priceRouters;
