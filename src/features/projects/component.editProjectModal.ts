import { stripIndent } from "common-tags"
import {
  ActionRowBuilder,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js"
import { createComponent } from "~/utils"
import { formatChannelName } from "./utils"

enum ID {
  MODAL = "editProjectModal",
  FIELD_NAME = "editProjectFieldName",
  FIELD_THEME = "editProjectFieldTheme",
}

const builder = new ModalBuilder()
  .setCustomId(ID.MODAL)
  .setTitle("Editar proyecto")

const nameInput = new TextInputBuilder()
  .setCustomId(ID.FIELD_NAME)
  .setLabel("Nombre del proyecto")
  .setStyle(TextInputStyle.Short)
  .setPlaceholder("Déjalo en blanco para mantener el valor actual")
  .setMinLength(1)
  .setMaxLength(100)

const themeInput = new TextInputBuilder()
  .setCustomId(ID.FIELD_THEME)
  .setLabel("Tema del proyecto")
  .setPlaceholder("Déjalo en blanco para mantener el valor actual")
  .setStyle(TextInputStyle.Paragraph)
  .setMaxLength(1024)

const firstActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
  nameInput
)
const secondActionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
  themeInput
)

builder.addComponents(firstActionRow, secondActionRow)

export default createComponent(builder, async (interaction) => {
  if (!interaction.isModalSubmit()) return

  if (!interaction.guild) {
    throw Error("This is a guild command")
  }

  const name = interaction.fields.getTextInputValue(ID.FIELD_NAME)
  const theme = interaction.fields.getTextInputValue(ID.FIELD_THEME)

  if (name) {
    const channelName = formatChannelName(name.trim())

    if (!channelName) {
      return interaction.reply({
        ephemeral: true,
        content: "¡Ups! No podemos usar ese nombre 🤔",
      })
    }

    const exists = interaction.guild.channels.cache.find(
      (channel) => channel.name === channelName
    )

    if (exists) {
      return interaction.reply({
        ephemeral: true,
        content: "¡Ups! Ya existe un proyecto con ese nombre 🤔",
      })
    }
  }

  // const embed = new EmbedBuilder().setColor(0x8000ff).addFields(
  //   {
  //     name: "Nombre del rol",
  //     value: roleName,
  //   },
  //   {
  //     name: "Nombre del canal",
  //     value: `\`${channelName}\``,
  //   },
  // )

  await interaction.reply({
    content: "¿Quieres crear un nuevo proyecto con la siguiente información?",
    ephemeral: true,
    // embeds: [embed],
    // components: [componentCreateProjectButtons.builder],
  })
})
