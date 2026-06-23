import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import rootRoutes from "#app/base/routes.js"
import testItemRoutes from "#app/test-items/routes.js"

const routes: FastifyPluginAsync = async (app: FastifyInstance) => {
    app.setNotFoundHandler(async (_request, reply) => {
        reply.code(404)
        return { error: true, message: "404 - Route Not Found" }
    })

    await app.register(rootRoutes)
    await app.register(testItemRoutes, { prefix: "/v1" })
}

export default routes
