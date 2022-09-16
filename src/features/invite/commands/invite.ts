import { oneLine } from "common-tags"
import { SlashCommandBuilder } from "discord.js"

import { createCommand } from "~/utils"

const content = oneLine`
  Utiliza este enlace para invitar a gente a este servidor: \n
  https://discord.dreamiverso.me/
`

const builder = new SlashCommandBuilder()
  .setName("invitar")
  .setDescription("Consigue un enlace para invitar a usuarios al servidor")

export default createCommand(builder, (interaction) => {
  interaction.reply({
    ephemeral: true,
    content,
  })
})
