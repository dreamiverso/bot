import { Client, GatewayIntentBits } from "discord.js"

import Commands from "~/commands"
import Handlers from "~/handlers"
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

const handlers = new Handlers()
handlers.init(client)

const commands = new Commands()
commands.init(client)

client.once("ready", async () => {
  console.log("client is ready", env.NODE_ENV)
})

client.login(env.DISCORD_BOT_TOKEN)
