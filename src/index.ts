import { Client } from "discord.js"

import { env } from "./utils"

const client = new Client({ intents: [] })

client.once("ready", () => {
  console.log("client is ready", env.NODE_ENV)
})

client.login(env.DISCORD_BOT_TOKEN)
