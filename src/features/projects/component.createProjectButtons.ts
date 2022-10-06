import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"

import { createComponent } from "~/utils"

enum ID {
  CREATE = "confirmCreateProject",
  CANCEL = "cancelCreateProject",
}

const builder = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId(ID.CREATE)
    .setStyle(ButtonStyle.Primary)
    .setLabel("Crear proyecto"),
  new ButtonBuilder()
    .setCustomId(ID.CANCEL)
    .setStyle(ButtonStyle.Secondary)
    .setLabel("Cancelar")
)

export default createComponent(builder, async (interaction) => {
  if (!interaction.isButton()) return

  const { fields } = interaction.message.embeds[0].data

  if (!fields) {
    throw Error("missing create component fields")
  }

  switch (interaction.customId) {
    case ID.CANCEL:
      return interaction.update({
        content: "Has cancelado la creación del proyecto",
        embeds: [],
        components: [],
      })
    case ID.CREATE:
      return interaction.update({
        content: `Crear con esta info: ${JSON.stringify(fields)}`,
        embeds: [],
        components: [],
      })
    default:
      throw Error(`unhandled interaction ${interaction.customId}`)
  }
})
