import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"

import { createComponent } from "~/utils"

const builder = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId("searchShareUserButton")
    .setLabel("Compartir en este canal")
    .setStyle(ButtonStyle.Primary)
)

export default createComponent(builder, async (interaction) => {
  if (!interaction.isButton()) return

  const { embeds } = interaction.message

  await interaction.reply({
    content: "¡Echadle un vistazo a esto!",
    embeds,
  })
})
