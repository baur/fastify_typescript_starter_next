import type { SwaggerOptions } from "@fastify/swagger"
import { parseNumber } from "./parsers.js"

export const swaggerConfig: SwaggerOptions = {
    openapi: {
        openapi: "3.1.0",
        info: {
            title: "Fastify TypeScript Starter API",
            description: "Minimal API documentation for the starter backend",
            version: "1.0.0",
        },
        servers: [
            {
                url: `http://localhost:${parseNumber(process.env.PORT, 3000)}`,
                description: "Local development server",
            },
        ],
    },
    refResolver: {
        buildLocalReference(json, _baseUri, fragment, i) {
            if (typeof json.$id === "string") {
                return json.$id
            }
            if (typeof json.title === "string") {
                return json.title
            }
            if (fragment) {
                const name = fragment.split("/").pop()
                if (name && name !== "properties" && name !== "items") {
                    return `${name}${i}`
                }
            }
            return `AutoSchema${i}`
        },
    },
}
