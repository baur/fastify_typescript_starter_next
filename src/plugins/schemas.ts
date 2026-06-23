import type { FastifyPluginAsync } from "fastify"
import fp from "fastify-plugin"
import { models as baseModels } from "#app/base/schema.js"
import { models as testItemModels } from "#app/test-items/schema.js"

const schemas: FastifyPluginAsync = async (app) => {
    for (const schema of [...baseModels, ...testItemModels]) {
        app.addSchema(schema)
    }
}

export default fp(schemas, {
    name: "schemas",
})
