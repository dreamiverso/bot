import { AutocompleteInteraction, GuildMemberRoleManager } from "discord.js"

import {
  projectRolePrefix,
  removeProjectRolePrefix,
} from "./removeProjectRolePrefix"

export async function autocompleteProject(
  interaction: AutocompleteInteraction
) {
  if (!interaction.guild) return
  if (!interaction.member) return

  if (!(interaction.member.roles instanceof GuildMemberRoleManager)) {
    throw Error("Unhandled code path: member roles property is id array")
  }

  const value = interaction.options.getFocused()

  const validProjects = interaction.member.roles.cache.reduce<
    // TODO: hay un tipo de esto fijísimo
    { name: string; value: string }[]
  >((accumulator, role) => {
    if (projectRolePrefix.test(role.name)) {
      const projectName = removeProjectRolePrefix(role.name)

      if (!value) {
        accumulator.push({ name: projectName, value: role.name })
      } else if (
        projectName.toLocaleLowerCase().startsWith(value.toLocaleLowerCase())
      ) {
        accumulator.push({ name: projectName, value: role.name })
      }
    }

    return accumulator
  }, [])

  await interaction.respond(validProjects)
}
