import { Client, GatewayIntentBits } from "discord.js"

import Commands from "~/commands"
import Features from "~/features"
import { env } from "~/utils"

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
  ],
})

const features = new Features()
features.init(client)

const commands = new Commands()
commands.init(client)

client.once("ready", async () => {
  console.log("client is ready", env.NODE_ENV)
})

client.login(env.DISCORD_BOT_TOKEN)
