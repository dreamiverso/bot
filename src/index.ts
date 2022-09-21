import { Client, GatewayIntentBits } from "discord.js"

import { env } from "~/utils"
import { bootstrap } from "~/features"

console.log("Creating new client…")

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
})

client.once("ready", async () => {
  console.log("client is ready", env.NODE_ENV)
  await bootstrap(client)
  console.log("Bot is alive!!!")
})

client.login(env.DISCORD_BOT_TOKEN)
