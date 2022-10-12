import { AutocompleteInteraction, CommandInteraction } from "discord.js"

import { getProjectInfoFromAutocompleteOption } from "../utils"

const separator = "\n • "

export async function membersList(
  interaction: CommandInteraction | AutocompleteInteraction
) {
  if (!interaction.isChatInputCommand()) return

  const info = await getProjectInfoFromAutocompleteOption(interaction, {
    force: true,
  })

  if (!info) {
    throw Error("Could not find info for this project")
  }

  const { role, projectName } = info

  const usernames = role.members
    .map((member) => member)
    .sort((a, b) => a.user.username.localeCompare(b.user.username))
    .join(separator)

  return interaction.reply({
    ephemeral: true,
    content: `Miembros del proyecto *${projectName}*: ${separator}${usernames}`,
  })
}
