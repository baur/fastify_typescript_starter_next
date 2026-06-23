import "dotenv/config"
import type { FastifyCorsOptions } from "@fastify/cors"
import type { SwaggerOptions } from "@fastify/swagger"
import type { FastifyUnderPressureOptions } from "@fastify/under-pressure"
import type { FastifyInstance } from "fastify"
import type { PoolConfig } from "pg"

interface AppConfig {
    host: string
    port: number
    isDevEnvironment: boolean
    keepAliveTimeout: number
    requestTimeout: number
    bodyLimit: number
    database: {
        pool: PoolConfig
        timezone: string
    }
    cors: FastifyCorsOptions
    csp: {
        directives: {
            defaultSrc: string[]
            scriptSrc: string[]
            styleSrc: string[]
            fontSrc: string[]
            imgSrc: string[]
            connectSrc: string[]
            objectSrc: string[]
            mediaSrc: string[]
            frameSrc: string[]
        }
    }
    healthcheck: FastifyUnderPressureOptions
    swagger: SwaggerOptions
}

const parseNumber = (value: string | undefined, defaultValue: number): number => {
    if (value === undefined || value.trim().length === 0) {
        return defaultValue
    }

    const parsed = Number.parseInt(value.trim(), 10)
    return Number.isNaN(parsed) ? defaultValue : parsed
}

const parseDecimal = (value: string | undefined, defaultValue: number): number => {
    if (value === undefined || value.trim().length === 0) {
        return defaultValue
    }

    const parsed = Number.parseFloat(value.trim())
    return Number.isNaN(parsed) ? defaultValue : parsed
}

const dbHost = process.env.DB_HOST || "localhost"
const dbPort = parseNumber(process.env.DB_PORT, 5432)
const dbName = process.env.DB_NAME || "postgres"
const dbUser = process.env.DB_USER || "postgres"
const dbPassword = process.env.DB_PASSWORD || "postgres"
const dbConnectionString = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?sslmode=disable`

const config: AppConfig = {
    host: process.env.HOST || "0.0.0.0",
    port: parseNumber(process.env.PORT, 3000),
    isDevEnvironment: process.env.NODE_ENV !== "production",
    keepAliveTimeout: parseNumber(process.env.SERVER_KEEP_ALIVE_TIMEOUT, 60000),
    requestTimeout: parseNumber(process.env.SERVER_REQUEST_TIMEOUT, 30000),
    bodyLimit: parseNumber(process.env.SERVER_BODY_LIMIT, 5 * 1024 * 1024),
    database: {
        pool: {
            application_name: process.env.DB_APP_NAME || "fastify-starter",
            connectionString: dbConnectionString,
            min: parseNumber(process.env.DB_POOL_MIN, 1),
            max: parseNumber(process.env.DB_POOL_MAX, 10),
            idleTimeoutMillis: parseNumber(process.env.DB_POOL_IDLE_TIMEOUT, 10000),
            connectionTimeoutMillis: parseNumber(process.env.DB_POOL_CONNECTION_TIMEOUT, 5000),
            query_timeout: parseNumber(process.env.DB_QUERY_TIMEOUT, 30000),
            lock_timeout: parseNumber(process.env.DB_LOCK_TIMEOUT, 5000),
            statement_timeout: parseNumber(process.env.DB_STATEMENT_TIMEOUT, 30000),
            keepAliveInitialDelayMillis: parseNumber(process.env.DB_KEEP_ALIVE_INITIAL_DELAY, 30000),
            idle_in_transaction_session_timeout: parseNumber(process.env.DB_IDLE_IN_TRANSACTION_SESSION_TIMEOUT, 30000),
        },
        timezone: process.env.DB_TIMEZONE || "UTC",
    },
    cors: {
        origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim()) : true,
        methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Origin", "User-Agent", "X-Requested-With", "Cache-Control", "Range"],
        credentials: true,
    },
    csp: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'", "data:"],
            imgSrc: ["'self'", "data:"],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            mediaSrc: ["'none'"],
            frameSrc: ["'self'"],
        },
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
    swagger: {
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
    },
}

export default config as Readonly<AppConfig>
