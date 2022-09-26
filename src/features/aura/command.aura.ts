import { SlashCommandBuilder } from "discord.js"

import { createCommand } from "~/utils"

import auraPicker from "./component.auraPicker"

const builder = new SlashCommandBuilder()
  .setName("aura")
  .setDescription("Cambia tu aura")

export default createCommand(builder, (interaction) => {
  if (!interaction.isChatInputCommand()) return

  interaction.reply({
    ephemeral: true,
    components: [auraPicker.builder],
  })
})
