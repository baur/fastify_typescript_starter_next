import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import { RouteSchema } from "./schema.js"
import { TestItemsService } from "./service.js"

const routes: FastifyPluginAsync = async (app: FastifyInstance) => {
    const testItemsService = new TestItemsService(app.db)

    app.route({
        method: "GET",
        url: "/test-items",
        schema: RouteSchema.list,
        handler: async (_request, reply) => {
            const data = await testItemsService.list()
            reply.code(200)
            return { data }
        },
    })
}

export default routes
