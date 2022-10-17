import { AutocompleteInteraction, CommandInteraction } from "discord.js"
import { collectModalInteraction } from "~/utils"

import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js"
import { getProjectInfoFromAutocompleteOption } from "../utils"

enum ID {
  MODAL = "editProjectThemeModal",
  FIELD = "editProjectThemeField",
}

const builder = new ModalBuilder()
  .setCustomId(ID.MODAL)
  .setTitle("Editar proyecto")

const input = new TextInputBuilder()
  .setCustomId(ID.FIELD)
  .setLabel("Tema del proyecto")
  .setPlaceholder("El nuevo tema de tu proyecto")
  .setStyle(TextInputStyle.Paragraph)
  .setRequired(false)
  .setMaxLength(1024)

const row = new ActionRowBuilder<TextInputBuilder>().addComponents(input)

builder.addComponents(row)

export async function editTheme(
  interaction: CommandInteraction | AutocompleteInteraction
) {
  if (!interaction.isChatInputCommand()) return

  const info = await getProjectInfoFromAutocompleteOption(interaction)

  if (!info) {
    throw Error("Could not find info for this project")
  }

  const { channel, projectName } = info

  await interaction.showModal(builder)

  try {
    const form = await collectModalInteraction(interaction, {
      time: 5 * 60 * 1000,
      ids: [ID.MODAL],
    })

    const theme = form.fields.getTextInputValue(ID.FIELD)

    await channel.edit({ topic: theme })

    return form.reply({
      ephemeral: true,
      content: theme
        ? `¡Hecho! 🥳 Se ha cambiado el tema de tu proyecto *${projectName}*`
        : `¡Hecho! 🥳 Se ha eliminado el tema de tu proyecto *${projectName}*`,
    })
  } catch (error) {
    // noop
  }
}
