import {
  AutocompleteInteraction,
  CommandInteraction,
  EmbedBuilder,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js"

import { collectModalInteraction } from "~/utils"

import {
  formatChannelName,
  getProjectInfoFromAutocompleteOption,
  projectRolePrefix,
} from "../utils"

enum ID {
  MODAL = "editProjectNameModal",
  FIELD = "editProjectNameField",
}

const builder = new ModalBuilder()
  .setCustomId(ID.MODAL)
  .setTitle("Editar proyecto")

const input = new TextInputBuilder()
  .setCustomId(ID.FIELD)
  .setLabel("Nombre del proyecto")
  .setStyle(TextInputStyle.Short)
  .setPlaceholder("El nuevo nombre de tu proyecto")
  .setRequired(true)
  .setMinLength(1)
  .setMaxLength(100)

const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input)

builder.addComponents(row)

export async function editName(
  interaction: CommandInteraction | AutocompleteInteraction
) {
  if (!interaction.isChatInputCommand()) return

  const info = await getProjectInfoFromAutocompleteOption(interaction)

  if (!info) {
    throw Error("Could not find info for this project")
  }

  const { role, channel } = info

  await interaction.showModal(builder)

  try {
    const form = await collectModalInteraction(interaction, {
      time: 5 * 60 * 1000,
      ids: [ID.MODAL],
    })

    if (!form.guild) return

    const name = form.fields.getTextInputValue(ID.FIELD)
    const channelName = formatChannelName(name)

    if (!channelName) {
      return form.reply({
        ephemeral: true,
        content: "¡Ups! No podemos usar ese nombre 🤔",
      })
    }

    const exists = form.guild.channels.cache.find(
      (channel) => channel.name === channelName
    )

    if (exists) {
      return form.reply({
        ephemeral: true,
        content: "¡Ups! Ya existe un proyecto con ese nombre 🤔",
      })
    }

    const matches = role.name.match(projectRolePrefix)

    if (!matches) {
      throw Error("expected project role prefix in role name")
    }

    const [prefix] = matches

    const roleName = `${prefix}${name}`
    await role.edit({ name: roleName })
    await channel.edit({ name: channelName })

    const embed = new EmbedBuilder().setColor(0x8000ff).addFields(
      {
        name: "Nombre del rol",
        value: roleName,
      },
      {
        name: "Nombre del canal",
        value: `\`${channelName}\``,
      }
    )

    return form.reply({
      ephemeral: true,
      embeds: [embed],
      content: `¡Hecho! 🥳 Se ha actualizado la siguiente información de tu proyecto:`,
    })
  } catch (error) {
    // noop
  }
}
