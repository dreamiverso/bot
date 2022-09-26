import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js"

import { createComponent } from "~/utils"

const builder = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId("primary")
    .setLabel("Primary button")
    .setStyle(ButtonStyle.Primary),
  new ButtonBuilder()
    .setCustomId("secondary")
    .setLabel("Secondary button")
    .setStyle(ButtonStyle.Secondary),
  new ButtonBuilder()
    .setCustomId("danger")
    .setLabel("Danger button")
    .setStyle(ButtonStyle.Danger),
  new ButtonBuilder()
    .setLabel("Link button")
    .setURL("https://dreamiverso.me")
    .setStyle(ButtonStyle.Link),
  new ButtonBuilder()
    .setCustomId("success")
    .setLabel("Success button")
    .setStyle(ButtonStyle.Success)
)

export default createComponent(builder, async (interaction) => {
  if (!interaction.isButton()) return

  await interaction.reply(interaction.customId)
})
