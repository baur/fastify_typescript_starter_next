import type { FastifySchema } from "fastify"
import { Type } from "typebox"

export namespace Data {
    export const testItem = Type.Object(
        {
            id: Type.Number(),
            slug: Type.String(),
            name: Type.String(),
            description: Type.Union([Type.Null(), Type.String()]),
            isActive: Type.Boolean(),
            createdAt: Type.String({ format: "date-time" }),
            updatedAt: Type.String({ format: "date-time" }),
        },
        { $id: "TestItem", additionalProperties: false },
    )

    export const testItemListResponse = Type.Object(
        {
            data: Type.Array(Type.Ref("TestItem")),
        },
        { $id: "TestItemListResponse", additionalProperties: false },
    )
}

export const models = [Data.testItem, Data.testItemListResponse]

export namespace RouteSchema {
    export const list: FastifySchema = {
        description: "List seeded test items from PostgreSQL",
        tags: ["test-items"],
        response: {
            200: Type.Ref("TestItemListResponse"),
        },
    }
}
