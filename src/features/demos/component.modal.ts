import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js"
import { createComponent } from "~/utils"

const builder = new ModalBuilder().setCustomId("myModal").setTitle("My Modal")

const favoriteColorInput = new TextInputBuilder()
  .setCustomId("favoriteColorInput")
  .setLabel("What's your favorite color?")
  .setStyle(TextInputStyle.Short)

const hobbiesInput = new TextInputBuilder()
  .setCustomId("hobbiesInput")
  .setLabel("What's some of your favorite hobbies?")
  .setStyle(TextInputStyle.Paragraph)

const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
  favoriteColorInput
)
const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
  hobbiesInput
)

builder.addComponents(firstActionRow, secondActionRow)

export default createComponent(builder, async (interaction) => {
  if (!interaction.isModalSubmit()) return

  const favoriteColor =
    interaction.fields.getTextInputValue("favoriteColorInput")

  const hobbiesInput = interaction.fields.getTextInputValue("hobbiesInput")

  await interaction.reply(`${favoriteColor} ${hobbiesInput}`)
})
