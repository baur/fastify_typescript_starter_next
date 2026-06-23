import "dotenv/config"
import { spawnSync } from "node:child_process"
import { platform } from "node:os"
import { join } from "node:path"

const command = process.argv[2]
const args = process.argv.slice(3)

if (!command) {
    console.error("Usage: npm run db:<new|up|down|status>")
    process.exit(1)
}

const encode = (value) => encodeURIComponent(value)
const dbHost = process.env.DB_HOST || "localhost"
const dbPort = process.env.DB_PORT || "5432"
const dbName = process.env.DB_NAME || "postgres"
const dbUser = process.env.DB_USER || "postgres"
const dbPassword = process.env.DB_PASSWORD || "postgres"
const databaseUrl = `postgres://${encode(dbUser)}:${encode(dbPassword)}@${dbHost}:${dbPort}/${encode(dbName)}?sslmode=disable`

const isWindows = platform() === "win32"
const executable = isWindows ? join(process.cwd(), "node_modules", ".bin", "dbmate.cmd") : "dbmate"
const dbmateArgs = ["--migrations-dir", "./db/migrations", "--no-dump-schema", command, ...args]
const spawnExecutable = isWindows ? process.env.ComSpec || "cmd.exe" : executable
const spawnArgs = isWindows ? ["/d", "/s", "/c", executable, ...dbmateArgs] : dbmateArgs
const result = spawnSync(
    spawnExecutable,
    spawnArgs,
    {
        env: {
            ...process.env,
            DATABASE_URL: databaseUrl,
        },
        shell: false,
        stdio: "inherit",
    },
)

if (result.error) {
    console.error(result.error.message)
    process.exit(1)
}

if (result.status !== 0) {
    process.exit(result.status ?? 1)
}

if (command === "status") {
    console.log("OK")
}
