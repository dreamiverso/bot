import { Client } from "discord.js"

import { env } from "~/utils"
import Commands from "~/commands"

const client = new Client({ intents: [] })

const commands = new Commands()

commands.sync()

client.on("ready", async () => {
  console.log("client is ready", env.NODE_ENV)
})

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const command = commands.list.find(
    (command) => command.builder.name === interaction.commandName
  )

  if (command) {
    await command.execute(interaction)
  } else {
    await interaction.reply("Ese comando no existe!")
  }
})

client.login(env.DISCORD_BOT_TOKEN)
