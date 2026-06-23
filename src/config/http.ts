import type { FastifyCorsOptions } from "@fastify/cors"
import type { FastifyUnderPressureOptions } from "@fastify/under-pressure"
import type { FastifyInstance } from "fastify"
import { parseDecimal, parseNumber } from "./parsers.js"

export interface HttpConfig {
    cors: FastifyCorsOptions
    healthcheck: FastifyUnderPressureOptions
}

export const httpConfig: HttpConfig = {
    cors: {
        origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()) : true,
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Origin", "User-Agent", "X-Requested-With", "Cache-Control", "Range"],
        credentials: true,
    },
    healthcheck: {
        maxEventLoopDelay: parseNumber(process.env.MAX_EVENT_LOOP_DELAY, 1000),
        maxEventLoopUtilization: parseDecimal(process.env.MAX_EVENT_LOOP_UTILIZATION, 0.9),
        message: process.env.UNDER_PRESSURE_MESSAGE || "Server under pressure",
        retryAfter: parseNumber(process.env.RETRY_AFTER, 60),
        exposeStatusRoute: {
            routeOpts: {},
            routeResponseSchemaOpts: {
                metrics: {
                    type: "object",
                    properties: {
                        eventLoopDelay: { type: "number" },
                        eventLoopUtilized: { type: "number" },
                        rssBytes: { type: "number" },
                        heapUsed: { type: "number" },
                    },
                },
            },
        },
        healthCheck: async (app: FastifyInstance) => ({
            metrics: app.memoryUsage(),
        }),
    },
}
