import { config } from "dotenv"
import { z } from "zod"

config()

const schema = z.object({
  DISCORD_BOT_TOKEN: z.string().min(1),
  NODE_ENV: z.enum(["development", "production"]),
})

export const env = schema.parse(process.env)
