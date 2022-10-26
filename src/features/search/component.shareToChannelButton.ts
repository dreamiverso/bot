import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"

import { createComponent } from "~/utils"

const shareButtonCustomId = "searchShareButton"

export const shareButton = new ButtonBuilder()
  .setCustomId(shareButtonCustomId)
  .setLabel("Compartir en este canal")
  .setStyle(ButtonStyle.Primary)

const builder = new ActionRowBuilder<ButtonBuilder>().addComponents(shareButton)

export default createComponent(builder, async (interaction) => {
  if (!interaction.isButton()) return

  let url: string | null = null

  interaction.message.components.forEach((component) => {
    component.components.forEach((component) => {
      if ("url" in component) url = component.url
    })
  })

  if (!url) {
    throw Error("Could not find component url")
  }

  const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setStyle(ButtonStyle.Link)
      .setLabel("Ver en indreams.me")
      .setURL(url)
  )

  return interaction.reply({
    content: "¡Echadle un vistazo a esto!",
    embeds: interaction.message.embeds,
    components: [buttons],
  })
})
