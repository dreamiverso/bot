import { SlashCommandBuilder } from "discord.js"

import { createCommand } from "~/utils"

import componentButtons from "./component.buttons"
import componentModal from "./component.modal"
import componentSelect from "./component.select"

const builder = new SlashCommandBuilder()
  .setName("components")
  .setDescription("Demo de componentes")
  .addStringOption((option) =>
    option
      .setName("component")
      .setDescription("The component to send")
      .setRequired(true)
      .addChoices(
        { name: "Buttons", value: "buttons" },
        { name: "Modal", value: "modal" },
        { name: "Select", value: "select" }
      )
  )

export default createCommand(builder, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const component = interaction.options.getString("component")

  switch (component) {
    case "buttons":
      await interaction.reply({
        components: [componentButtons.builder],
      })
      break
    case "modal":
      await interaction.showModal(componentModal.builder)
      break
    case "select":
      await interaction.reply({
        components: [componentSelect.builder],
      })
  }
})
