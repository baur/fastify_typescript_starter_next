import { parseNumber } from "./parsers.js"

export interface AppRuntimeConfig {
    host: string
    port: number
    isDevEnvironment: boolean
    keepAliveTimeout: number
    requestTimeout: number
    bodyLimit: number
}

export const appConfig: AppRuntimeConfig = {
    host: process.env.HOST || "0.0.0.0",
    port: parseNumber(process.env.PORT, 3000),
    isDevEnvironment: process.env.NODE_ENV !== "production",
    keepAliveTimeout: parseNumber(process.env.SERVER_KEEP_ALIVE_TIMEOUT, 60000),
    requestTimeout: parseNumber(process.env.SERVER_REQUEST_TIMEOUT, 30000),
    bodyLimit: parseNumber(process.env.SERVER_BODY_LIMIT, 5 * 1024 * 1024),
}
