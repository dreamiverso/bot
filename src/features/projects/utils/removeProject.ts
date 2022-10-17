import { Role, TextChannel } from "discord.js"

import { projectRolePrefix } from "./removeProjectRolePrefix"

export async function removeProject(channel: TextChannel, role: Role) {
  const deleteChannelPromise = channel.delete("Deleted via slash command")
  const deleteRolePromise = role.delete("Deleted via slash command")

  await Promise.all([deleteChannelPromise, deleteRolePromise])

  const otherProjectRoles = channel.guild.roles.cache
    .filter(({ name }) => projectRolePrefix.test(name) && name !== role.name)
    .sort((a, b) => a.name.localeCompare(b.name))

  /**
   * This is required because apparently the second argument in `Collection.map`
   * is not a number but a string
   */
  let index = 1
  const renameRolesPromise = otherProjectRoles.map((role) => {
    const name = role.name.replace(projectRolePrefix, `P${index++} - `)
    return role.setName(name)
  })

  return Promise.all(renameRolesPromise)
}
