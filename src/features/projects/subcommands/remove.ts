import { oneLine } from "common-tags"
import {
  ActionRowBuilder,
  AutocompleteInteraction,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  ComponentType,
} from "discord.js"

import { collectComponentInteraction, constants, pipe } from "~/utils"

import { formatChannelName } from "../utils"

import {
  projectRolePrefix,
  removeProjectRolePrefix,
} from "./removeProjectRolePrefix"

enum ID {
  DELETE = "confirmDeleteProject",
  CANCEL = "cancelDeleteProject",
}

const builder = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId(ID.DELETE)
    .setStyle(ButtonStyle.Danger)
    .setLabel("Eliminar proyecto"),
  new ButtonBuilder()
    .setCustomId(ID.CANCEL)
    .setStyle(ButtonStyle.Secondary)
    .setLabel("Cancelar")
)

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
      content: oneLine`
        No puedo hacer eso todavía! Hay que votar para eliminar este proyecto.
        Miembros: ${role.members.size}, mínimo de votos: ${minimum}`,
    })
  }

  await interaction.reply({
    ephemeral: true,
    components: [builder],
    content: oneLine`
      Estás a punto de borrar el proyecto ${channel.name} y el rol ${role}.
      ¡Esta acción es irreversible! ¿Estás seguro?
    `,
  })

  try {
    const buttonInteraction = await collectComponentInteraction(interaction, {
      ids: [ID.DELETE, ID.CANCEL],
      componentType: ComponentType.Button,
      time: 15000,
    })

    switch (buttonInteraction.customId) {
      case ID.DELETE: {
        const deleteChannelPromise = channel.delete("Deleted via slash command")
        const deleteRolePromise = role.delete("Deleted via slash command")

        const otherProjectRoles = channel.guild.roles.cache
          .filter(
            ({ name }) => projectRolePrefix.test(name) && name !== role.name
          )
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

        await Promise.all([
          deleteChannelPromise,
          deleteRolePromise,
          renameRolesPromise,
        ])

        return buttonInteraction.update({
          embeds: [],
          components: [],
          content: "Se ha eliminado el proyecto correctamente",
        })
      }
      case ID.CANCEL:
        return buttonInteraction.update({
          embeds: [],
          components: [],
          content: "Has cancelado la eliminación del proyecto",
        })
    }
  } catch (error) {
    await interaction.editReply({
      embeds: [],
      components: [],
      content: "No has respondido ups",
    })
  }
}
