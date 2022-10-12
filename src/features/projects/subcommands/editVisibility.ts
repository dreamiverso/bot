import { AutocompleteInteraction, CommandInteraction } from "discord.js"

import {
  getProjectInfoFromAutocompleteOption,
  visibilityChoices,
} from "../utils"

export async function editVisibility(
  interaction: CommandInteraction | AutocompleteInteraction
) {
  if (!interaction.isChatInputCommand()) return

  const visibility = interaction.options.getString("visibilidad") as
    | keyof typeof visibilityChoices
    | null

  if (!visibility) {
    return interaction.reply({
      content: "¡Debes escoger la visibilidad de tu canal de proyecto!",
      ephemeral: true,
    })
  }

  const info = await getProjectInfoFromAutocompleteOption(interaction)

  if (!info) {
    throw Error("Could not find info for this project")
  }

  const { channel, role, projectName } = info

  switch (visibilityChoices[visibility]) {
    case visibilityChoices.archived:
      if (channel.permissionOverwrites.cache.size) {
        return interaction.reply({
          ephemeral: true,
          content: `Amigo esto ya es privado`,
        })
      }

      await channel.permissionOverwrites.create(channel.guild.roles.everyone, {
        ViewChannel: false,
      })

      await channel.permissionOverwrites.create(role, {
        ViewChannel: true,
      })

      return interaction.reply({
        ephemeral: true,
        content: `¡Hecho! 🥳 El proyecto *${projectName}* es ahora visible solo para miembros`,
      })
    case visibilityChoices.public:
      if (!channel.permissionOverwrites.cache.size) {
        return interaction.reply({
          ephemeral: true,
          content: `Amigo esto ya es público`,
        })
      }

      await channel.permissionOverwrites.delete(channel.guild.roles.everyone)
      await channel.permissionOverwrites.delete(role)

      return interaction.reply({
        ephemeral: true,
        content: `¡Hecho! 🥳 El proyecto *${projectName}* es ahora visible para todo el mundo`,
      })
    default:
      throw Error(`Unhandled case: ${visibility}`)
  }
}
