import { Client } from "discord.js"

import { env } from "~/utils"
import Commands from "~/commands"

const client = new Client({ intents: [] })

const commands = new Commands()

commands.sync()

client.once("ready", async () => {
  console.log("client is ready", env.NODE_ENV)
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return

  const command = commands.list.find(
    (command) => command.builder.name === interaction.commandName
  )

  if (!command) {
    return interaction.reply("Ese comando no existe!")
  }

  await command.execute(interaction)
})

client.login(env.DISCORD_BOT_TOKEN)
