import { ActivityType, Client, GatewayIntentBits } from "discord.js"
import dayjs from "dayjs"
import path from "path"
import fastify from "fastify"
import fastifyStatic from "@fastify/static"

import { env, sendMessageToChannel, constants } from "~/utils"
import { bootstrap } from "~/features"

console.log("⏳  Creating new client…")

export const server = fastify()

server.register(fastifyStatic, {
  root: path.join(__dirname, "..", "public"),
  prefix: "/public/",
})

server.listen({ port: 3000 }, (err) => {
  if (err) throw err
})

export const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,
  ],
  presence: {
    activities: [
      {
        type: ActivityType.Playing,
        name: "Dreams™",
      },
    ],
  },
})

client.once("ready", async (client) => {
  await bootstrap(client)

  client.emit("ready", client)

  console.log("🤖  Beep, boop!")

  if (env.NODE_ENV !== "production") return

  const date = dayjs().format("DD/MM/YYYY HH:mm:ss")

  sendMessageToChannel(
    client,
    constants.CHANNEL_ID.BOT_DEBUG,
    `Nueva conexión (${date})`
  )
})

client.login(env.DISCORD_BOT_TOKEN)
