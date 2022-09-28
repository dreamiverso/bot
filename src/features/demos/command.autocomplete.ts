import { SlashCommandBuilder } from "discord.js"

import { createCommand } from "~/utils"

const builder = new SlashCommandBuilder()
  .setName("autocomplete")
  .setDescription("Demo de la API de autocomplete")
  .addStringOption((option) =>
    option
      .setName("query")
      .setDescription("Phrase to search for")
      .setAutocomplete(true)
  )

export default createCommand(builder, async (interaction) => {
  if (!interaction.isAutocomplete()) return

  const focusedValue = interaction.options.getFocused()
  const choices = [
    "Popular Topics: Threads",
    "Sharding: Getting started",
    "Library: Voice Connections",
    "Interactions: Replying to slash commands",
    "Popular Topics: Embed preview",
  ]
  const filtered = choices.filter((choice) => choice.startsWith(focusedValue))
  await interaction.respond(
    filtered.map((choice) => ({ name: choice, value: choice }))
  )
})
