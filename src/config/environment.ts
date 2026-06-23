import "dotenv/config"
import { type AppRuntimeConfig, appConfig } from "./app.js"
import { type DatabaseConfig, databaseConfig } from "./database.js"
import { type HttpConfig, httpConfig } from "./http.js"
import { type CspConfig, cspConfig } from "./security.js"
import { swaggerConfig } from "./swagger.js"

interface AppConfig extends AppRuntimeConfig, HttpConfig {
    database: DatabaseConfig
    csp: CspConfig
    swagger: typeof swaggerConfig
}

const config: AppConfig = {
    ...appConfig,
    ...httpConfig,
    database: databaseConfig,
    csp: cspConfig,
    swagger: swaggerConfig,
}

export default config as Readonly<AppConfig>
