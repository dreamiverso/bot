import { oneLine, stripIndent } from "common-tags"
import {
  ActionRowBuilder,
  AutocompleteInteraction,
  ButtonBuilder,
  ButtonStyle,
  Channel,
  ChannelType,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  Role,
  TextChannel,
} from "discord.js"

import { collectComponentInteraction, constants, pipe, wait } from "~/utils"

import { formatChannelName } from "../utils"

import {
  projectRolePrefix,
  removeProjectRolePrefix,
} from "./removeProjectRolePrefix"

enum ID {
  VOTE_CONFIRM = "confirmVoteProjectDelete",
  VOTE_CANCEL = "cancelVoteProjectDelete",
  DELETE_CONFIRM = "confirmDeleteProject",
  DELETE_CANCEL = "cancelDeleteProject",
}

const confirmDeleteBuilder =
  new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(ID.DELETE_CONFIRM)
      .setStyle(ButtonStyle.Danger)
      .setLabel("Eliminar proyecto"),
    new ButtonBuilder()
      .setCustomId(ID.DELETE_CANCEL)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("Cancelar")
  )

const confirmDeletionVoteBuilder =
  new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(ID.VOTE_CONFIRM)
      .setStyle(ButtonStyle.Primary)
      .setLabel("Abrir votación"),
    new ButtonBuilder()
      .setCustomId(ID.VOTE_CANCEL)
      .setStyle(ButtonStyle.Secondary)
      .setLabel("Cancelar")
  )

async function removeProject(channel: TextChannel, role: Role) {
  const deleteChannelPromise = channel.delete("Deleted via slash command")
  const deleteRolePromise = role.delete("Deleted via slash command")

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

  return Promise.all([
    deleteChannelPromise,
    deleteRolePromise,
    renameRolesPromise,
  ])
}

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

  const projectName = removeProjectRolePrefix(roleName)
  const channelName = formatChannelName(projectName)

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

  if (channel.type !== ChannelType.GuildText) {
    throw Error("Unexpected channel type")
  }

  // This is required to foce a cache update from Discord APIs
  await channel.guild.members.fetch({ force: true })

  const role = channel.guild.roles.cache.find((role) => role.name === roleName)

  if (!role) {
    throw Error("Role from autocomplete does not exist")
  }

  if (role.members.size > 1) {
    const minimum = Math.floor(role.members.size / 2) + 1

    await interaction.reply({
      ephemeral: true,
      content: "Hace falta votar, quieres votar?",
      components: [confirmDeletionVoteBuilder],
    })

    try {
      const buttonInteraction = await collectComponentInteraction(interaction, {
        ids: [ID.VOTE_CONFIRM, ID.VOTE_CANCEL],
        componentType: ComponentType.Button,
        time: 15000,
      })

      if (buttonInteraction.customId === ID.VOTE_CANCEL) {
        return interaction.editReply({
          embeds: [],
          components: [],
          content: "Has cancelado la eliminación del proyecto",
        })
      }

      if (buttonInteraction.customId !== ID.VOTE_CONFIRM) return

      interaction.editReply({
        content: "Abriendo votación…",
        components: [],
      })

      const embed = new EmbedBuilder().setColor(0x8000ff).addFields(
        {
          name: "Votos necesarios",
          value: minimum.toString(),
        },
        {
          name: "Duración de votación",
          value: "15 segundos",
        }
      )

      const message = await channel.send({
        embeds: [embed],
        content: `¡Atención, ${role}! ${interaction.user} ha abierto una votación para borrar el proyecto *${projectName}*.`,
      })

      await message.react("✅")

      const membersIds = role.members.map((member) => member.id)

      return message
        .awaitReactions({
          time: 15000,
          filter: (reaction, user) =>
            ["✅"].includes(reaction.emoji.name || "") &&
            membersIds.includes(user.id) &&
            !user.bot,
        })
        .then(async (collected) => {
          // TODO: please make this beautiful
          const count = (collected?.get("✅")?.count ?? 1) - 1

          const embed = new EmbedBuilder().setColor(0x8000ff).addFields(
            {
              name: "Votos necesarios",
              value: minimum.toString(),
            },
            {
              name: "Votos recibidos",
              value: count.toString(),
            }
          )

          if (count < minimum) {
            return message.edit({
              embeds: [embed],
              components: [],
              content: `Se ha cancelado la eliminación del proyecto porque no se han recibido votos suficientes.`,
            })
          }

          message.edit({
            embeds: [embed],
            components: [],
            content: "Eliminando proyecto…",
          })

          await wait(3000)
          return removeProject(channel, role)
        })
    } catch (error) {
      return interaction.editReply({
        embeds: [],
        components: [],
        content: `Se ha cancelado la eliminación del proyecto porque no has respondido`,
      })
    }
  }

  await interaction.reply({
    ephemeral: true,
    components: [confirmDeleteBuilder],
    content: stripIndent`
      Estás a punto de borrar el proyecto *${projectName}*.
      ¡Esta acción es irreversible! ¿Estás seguro?
    `,
  })

  try {
    const buttonInteraction = await collectComponentInteraction(interaction, {
      ids: [ID.DELETE_CONFIRM, ID.DELETE_CANCEL],
      componentType: ComponentType.Button,
      time: 15000,
    })

    if (buttonInteraction.customId === ID.DELETE_CANCEL) {
      return buttonInteraction.update({
        embeds: [],
        components: [],
        content: "Has cancelado la eliminación del proyecto",
      })
    }

    if (buttonInteraction.customId !== ID.DELETE_CONFIRM) return

    await removeProject(channel, role)

    return buttonInteraction.update({
      embeds: [],
      components: [],
      content: "Se ha eliminado el proyecto correctamente",
    })
  } catch (error) {
    return interaction.editReply({
      embeds: [],
      components: [],
      content: `Se ha cancelado la eliminación del proyecto porque no has respondido`,
    })
  }
}
