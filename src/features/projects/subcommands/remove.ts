import { oneLine } from "common-tags"
import { AutocompleteInteraction, CommandInteraction } from "discord.js"

import { constants, pipe } from "~/utils"

import { formatChannelName } from "../utils"

import {
  projectRolePrefix,
  removeProjectRolePrefix,
} from "./removeProjectRolePrefix"

export async function remove(
  interaction: CommandInteraction | AutocompleteInteraction
) {
  if (!interaction.isChatInputCommand()) return
  if (!interaction.guild) return

  const roleName = interaction.options.getString("proyecto")

  if (!roleName) {
    return interaction.reply({
      ephemeral: true,
      content: "¡Debes elegir un proyecto!",
    })
  }

  const channelName = pipe(removeProjectRolePrefix, formatChannelName)(roleName)

  const channel = interaction.guild.channels.cache.find(
    (channel) =>
      channel.name === channelName &&
      channel.parentId === constants.CATEGORY_ID.PROJECTS
  )

  if (!channel) {
    return interaction.reply({
      ephemeral: true,
      content: oneLine`
        ¡Ups! Ese proyecto no existe.
        Quizás alguien acaba de eliminarlo 🤔
      `,
    })
  }

  const role = channel.guild.roles.cache.find((role) => role.name === roleName)

  if (!role) {
    throw Error("Role from autocomplete does not exist")
  }

  if (role.members.size > 1) {
    const minimum = Math.ceil(role.members.size / 2)
    // TODO: votar para eliminar
    return interaction.reply({
      ephemeral: true,
      content: `No puedo hacer eso todavía! Hay que votar para eliminar este proyecto. Miembros: ${role.members.size}, mínimo de votos: ${minimum}`,
    })
  }

  const response = await interaction.reply({
    ephemeral: true,
    content: `Estás a punto de borrar el proyecto ${channel.name} y el rol ${role.name}. ¡Esta acción es irreversible! ¿Estás seguro?`,
  })

  // TODO: Verify that user really wants to do this

  const deleteChannelPromise = channel.delete("Deleted via slash command")
  const deleteRolePromise = role.delete("Deleted via slash command")

  const otherProjectRoles = channel.guild.roles.cache.filter(
    ({ name }) => projectRolePrefix.test(name) && name !== role.name
  )

  /**
   * This is required because apparently the second argument in `Collection.map`
   * is not a number but a string
   */
  let index = 0
  const renameRolesPromise = otherProjectRoles.map((role) => {
    const nameWithoutPrefix = removeProjectRolePrefix(role.name)
    const newName = `P${index + 1} - ${nameWithoutPrefix}`
    index++

    return role.setName(newName)
  })

  await Promise.all([
    deleteChannelPromise,
    deleteRolePromise,
    renameRolesPromise,
  ])

  console.log("ya estaría")
}
