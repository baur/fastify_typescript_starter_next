import type { PoolConfig } from "pg"
import { parseNumber } from "./parsers.js"

export interface DatabaseConfig {
    pool: PoolConfig
    timezone: string
}

const dbHost = process.env.DB_HOST || "localhost"
const dbPort = parseNumber(process.env.DB_PORT, 5432)
const dbName = process.env.DB_NAME || "postgres"
const dbUser = process.env.DB_USER || "postgres"
const dbPassword = process.env.DB_PASSWORD || "postgres"
const dbConnectionString = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}?sslmode=disable`

export const databaseConfig: DatabaseConfig = {
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
}
