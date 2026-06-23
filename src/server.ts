import "dotenv/config"
import { pathToFileURL } from "node:url"
import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox"
import closeWithGrace from "close-with-grace"
import fastify from "fastify"

import conf from "#config/environment.js"
import db from "#plugins/db.js"
import schemas from "#plugins/schemas.js"
import routes from "./routes.js"

process.setMaxListeners(20)

const devLogger = {
    target: "pino-pretty",
    options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
    },
} as const

export const createServer = async () => {
    const app = fastify({
        trustProxy: true,
        requestTimeout: conf.requestTimeout,
        keepAliveTimeout: conf.keepAliveTimeout,
        bodyLimit: conf.bodyLimit,
        logger: {
            level: process.env.LOG_LEVEL || "info",
            transport: conf.isDevEnvironment ? devLogger : undefined,
            redact: {
                paths: ["req.headers.authorization", "req.headers.cookie", "*.password", "*.secret", "*.token"],
                censor: "[REDACTED]",
            },
        },
    }).withTypeProvider<TypeBoxTypeProvider>()

    await app
        .register(import("@fastify/helmet"), {
            global: true,
            contentSecurityPolicy: {
                directives: conf.csp.directives,
            },
        })
        .register(import("@fastify/cors"), conf.cors)
        .register(import("@fastify/formbody"))
        .register(import("@fastify/sensible"))
        .register(import("@fastify/under-pressure"), conf.healthcheck)

    if (conf.isDevEnvironment) {
        await app.register(import("@fastify/swagger"), conf.swagger)
        await app.register(import("@scalar/fastify-api-reference"), {
            routePrefix: "/openapi",
        })
    }

    await app.register(schemas)
    await app.register(db, conf.database.pool)
    await app.register(routes)

    const closeListeners = closeWithGrace({ delay: 2000 }, async ({ signal, err }) => {
        app.log.info({ signal }, "Graceful shutdown initiated")
        if (err) {
            app.log.error({ err }, "Graceful shutdown received an error")
        }
        await app.close()
    })

    app.addHook("onClose", async () => {
        closeListeners.uninstall()
        app.log.info("Graceful shutdown completed")
    })

    await app.ready()
    return app
}

const startServer = async () => {
    try {
        const app = await createServer()
        await app.listen({
            host: conf.host,
            port: conf.port,
        })
        app.log.info({ host: conf.host, port: conf.port }, "Server is running")
    } catch (error) {
        console.error("Failed to start server:", error)
        process.exit(1)
    }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    await startServer()
}
