import { AutocompleteInteraction, CommandInteraction } from "discord.js"

import componentEditProjectModal from "../component.editProjectModal"

export async function edit(
  interaction: CommandInteraction | AutocompleteInteraction
) {
  if (!interaction.isChatInputCommand()) return
  await interaction.showModal(componentEditProjectModal.builder)
}
