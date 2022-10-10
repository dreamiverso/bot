import {
  AutocompleteInteraction,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js"

import { constants } from "~/utils"

import { visibilityChoices, formatChannelName } from "../utils"
import componentCreateProjectButtons from "../component.createProjectButtons"

export async function create(
  interaction: CommandInteraction | AutocompleteInteraction
) {
  if (!interaction.isChatInputCommand()) return
  if (!interaction.guild) return

  const name = interaction.options.getString("nombre")
  const visibility = interaction.options.getString("visibilidad") as
    | keyof typeof visibilityChoices
    | null

  if (!name) {
    return interaction.reply({
      content: "¡Debes escoger un nombre para tu proyecto!",
      ephemeral: true,
    })
  }

  if (!visibility) {
    return interaction.reply({
      content: "¡Debes escoger la visibilidad de tu canal de proyecto!",
      ephemeral: true,
    })
  }

  const channelName = formatChannelName(name.trim())

  if (!channelName) {
    return interaction.reply({
      content: "¡Ups! No podemos crear un canal con ese nombre 🤔",
      ephemeral: true,
    })
  }

  const exists = interaction.guild.channels.cache.find(
    (channel) => channel.name === channelName
  )

  if (exists) {
    return interaction.reply({
      content: "¡Ups! Ya existe un proyecto con ese nombre 🤔",
      ephemeral: true,
    })
  }

  const projects = interaction.guild.channels.cache.filter(
    (channel) => channel.parentId === constants.CATEGORY_ID.PROJECTS
  )

  const roleName = `P${projects.size + 1} - ${name.trim()}`

  const embed = new EmbedBuilder().setColor(0x8000ff).addFields(
    {
      name: "Nombre del rol",
      value: roleName,
    },
    {
      name: "Nombre del canal",
      value: `\`${channelName}\``,
    },
    {
      name: "Visibilidad del canal",
      value: visibilityChoices[visibility],
    }
  )

  await interaction.reply({
    content: "¿Quieres crear un nuevo proyecto con la siguiente información?",
    ephemeral: true,
    embeds: [embed],
    components: [componentCreateProjectButtons.builder],
  })
}
