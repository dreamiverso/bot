import { SlashCommandBuilder } from "discord.js"

import { createCommand } from "~/utils"

const builder = new SlashCommandBuilder()
  .setName("buscar")
  .setDescription("Busca contenido en el Dreamiverso")
  .addStringOption((option) =>
    option
      .setName("filtro")
      .setDescription("Afina tu búsqueda")
      .setRequired(true)
      .addChoices(
        {
          name: "Usuario",
          value: "user",
        },
        {
          name: "Creación",
          value: "creation",
        }
      )
  )

export default createCommand(builder, (interaction) => {
  if (!interaction.isChatInputCommand()) return

  interaction.reply({
    ephemeral: true,
    content: "TODO",
  })
})
