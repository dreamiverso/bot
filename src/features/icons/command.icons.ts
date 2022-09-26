import { oneLine } from "common-tags"
import { SlashCommandBuilder } from "discord.js"

import { createCommand } from "~/utils"

const content = oneLine`
  Aquí puedes consultar la lista de iconos oficial de Dreams: \n
  https://docs.indreams.me/es/help/getting-started/icons
`

const builder = new SlashCommandBuilder()
  .setName("iconos")
  .setDescription("Devuelve un enlace a la lista de iconos oficial de Dreams.")

export default createCommand(builder, (interaction) => {
  if (!interaction.isChatInputCommand()) return

  interaction.reply({
    ephemeral: true,
    content,
  })
})
