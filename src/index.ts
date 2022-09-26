import { ActivityType, Client, GatewayIntentBits } from "discord.js"

import { env, sendMessageToChannel, constants } from "~/utils"
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

client.once("ready", async (client) => {
  console.log("client is ready", env.NODE_ENV)

  client.user.setPresence({
    activities: [
      {
        type: ActivityType.Playing,
        name: "Dreams™",
      },
    ],
  })

  await bootstrap(client)

  client.emit("ready", client)

  console.log("Bot is alive!!!")

  if (env.NODE_ENV !== "production") return

  sendMessageToChannel(
    client,
    constants.CHANNEL_ID.BOT_DEBUG,
    `Acaban de enchufarme (${new Date().toISOString()})`
  )
})

client.login(env.DISCORD_BOT_TOKEN)
