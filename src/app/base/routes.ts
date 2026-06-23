import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import BaseHandler from "./handlers.js"
import { RouteSchema } from "./schema.js"

const routes: FastifyPluginAsync = async (app: FastifyInstance) => {
    const baseHandler = new BaseHandler(app)

    app.route({
        method: "GET",
        url: "/",
        schema: RouteSchema.welcome,
        handler: baseHandler.welcome,
    })
}

export default routes
