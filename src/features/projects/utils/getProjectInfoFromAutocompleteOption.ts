import { oneLine } from "common-tags"
import { ChannelType, ChatInputCommandInteraction } from "discord.js"
import { constants } from "~/utils"
import { formatChannelName } from "./formatChannelName"
import { removeProjectRolePrefix } from "./removeProjectRolePrefix"

export async function getProjectInfoFromAutocompleteOption(
  interaction: ChatInputCommandInteraction,
  options: {
    force?: boolean
  } = {}
) {
  const { force = false } = options

  const roleName = interaction.options.getString("proyecto")

  if (!interaction.guild) {
    throw Error("Missing guild in interaction")
  }

  if (!roleName) {
    interaction.reply({
      ephemeral: true,
      content: "¡Debes elegir un proyecto!",
    })

    return
  }

  const projectName = removeProjectRolePrefix(roleName)
  const channelName = formatChannelName(projectName)

  const channel = interaction.guild.channels.cache.find(
    (channel) =>
      channel.name === channelName &&
      channel.id !== constants.CHANNEL_ID.PROJECTS_GUIDE &&
      channel.parentId === constants.CATEGORY_ID.PROJECTS
  )

  if (!channel) {
    interaction.reply({
      ephemeral: true,
      content: oneLine`
        ¡Ups! Ese proyecto no existe.
        Quizás alguien acaba de eliminarlo 🤔
      `,
    })

    return
  }

  if (channel.type !== ChannelType.GuildText) {
    throw Error("Unexpected channel type")
  }

  if (force) await channel.guild.members.fetch({ force: true })

  const role = interaction.guild.roles.cache.find(
    (role) => role.name === roleName
  )

  if (!role) {
    throw Error("Role not found")
  }

  return {
    roleName,
    projectName,
    channelName,
    channel,
    role,
  }
}
