import { ActionRowBuilder, SelectMenuBuilder } from "discord.js"

import { createComponent } from "~/utils"

const builder = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
  new SelectMenuBuilder()
    .setCustomId("select")
    .setPlaceholder("Nothing selected")
    .addOptions(
      {
        label: "Select me",
        description: "This is a description",
        value: "first_option",
      },
      {
        label: "You can select me too",
        description: "This is also a description",
        value: "second_option",
      }
    )
)

export default createComponent(builder, async (interaction) => {
  if (!interaction.isSelectMenu()) return

  const [selection] = interaction.values

  await interaction.reply(selection)
})
