import {
  AutocompleteInteraction,
  CommandInteraction,
  GuildMemberRoleManager,
} from "discord.js"

import { formatChannelName } from "./utils"

const projectRolePrefix = new RegExp(/(P[0-9]+) - /)

export async function handleEditProjectSubcommand(
  interaction: CommandInteraction | AutocompleteInteraction
) {
  if (!interaction.isAutocomplete()) return
  if (!interaction.guild) return
  if (!interaction.member) return

  if (!(interaction.member.roles instanceof GuildMemberRoleManager)) {
    throw Error("Unhandled code path: member roles property is id array")
  }

  const value = interaction.options.getFocused()

  const validProjects = interaction.member.roles.cache.reduce<
    { name: string; value: string }[]
  >((accumulator, role) => {
    if (projectRolePrefix.test(role.name)) {
      const projectName = role.name.replace(projectRolePrefix, "")

      if (!value) {
        accumulator.push({
          name: projectName,
          value: formatChannelName(projectName),
        })
      } else if (
        projectName.toLocaleLowerCase().startsWith(value.toLocaleLowerCase())
      ) {
        accumulator.push({
          name: projectName,
          value: formatChannelName(projectName),
        })
      }
    }

    return accumulator
  }, [])

  await interaction.respond(validProjects)
}
