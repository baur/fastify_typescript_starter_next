import type { FastifySchema } from "fastify"
import { Type } from "typebox"

export namespace Data {
    export const status = Type.Object(
        {
            rssBytes: Type.Number(),
            heapUsed: Type.Number(),
            eventLoopDelay: Type.Number(),
            eventLoopUtilized: Type.Number(),
        },
        { $id: "BaseStatus", additionalProperties: false },
    )

    export const welcomeResponse = Type.Object(
        {
            label: Type.String(),
            uptime: Type.Number(),
            version: Type.String(),
            status: Type.Ref("BaseStatus"),
        },
        { $id: "BaseWelcomeResponse", additionalProperties: false },
    )

    export const notFoundResponse = Type.Object(
        {
            error: Type.Boolean(),
            message: Type.String(),
        },
        { $id: "BaseNotFoundResponse", additionalProperties: false },
    )
}

export const models = [Data.status, Data.welcomeResponse, Data.notFoundResponse]

export namespace RouteSchema {
    export const welcome: FastifySchema = {
        description: "Welcome and runtime status of the application",
        tags: ["base"],
        response: {
            200: Type.Ref("BaseWelcomeResponse"),
        },
    }
}
