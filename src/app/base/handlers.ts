import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"

class BaseHandler {
    constructor(private readonly fastify: FastifyInstance) {}

    public welcome = async (_request: FastifyRequest, reply: FastifyReply) => {
        reply.code(200)
        return {
            label: "Welcome to API",
            uptime: process.uptime(),
            version: process.version,
            status: this.fastify.memoryUsage(),
        }
    }
}

export default BaseHandler
