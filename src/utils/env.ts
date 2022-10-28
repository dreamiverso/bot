import path from "path"
import { config } from "dotenv"
import { fileURLToPath } from "url"
import { z } from "zod"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

config({
  path: path.join(__dirname, "../../", `.env.${process.env.NODE_ENV}`),
})

const schema = z.object({
  NODE_ENV: z.enum(["development", "production"]),
  /**
   * A connection ID for a local postgresqsl database
   */
  DATABASE_URL: z.string().min(1),
  /**
   * Usually referred to as `token` on Discord documentation
   */
  DISCORD_BOT_TOKEN: z.string().min(1),
  /**
   * Usually referred to as `clientId` on Discord documentation
   */
  DISCORD_APPLICATION_ID: z.string().min(1),
  /**
   * Usually referred to as `guildId` on Discord documentation
   */
  DISCORD_SERVER_ID: z.string().min(1),
})

export const env = schema.parse(process.env)
