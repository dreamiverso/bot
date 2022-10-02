import { SlashCommandBuilder } from "discord.js"
import { createCommand } from "~/utils"

import { handleClearSubcommand } from "./handleClearSubcommand"
import { handleSendSubcommand } from "./handleSendSubcommand"

const builder = new SlashCommandBuilder()
  .setName("mod")
  .setDescription("Comandos especiales del equipo de moderación")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("limpiar")
      .setDescription(
        "Elimina uno o varios mensajes en el canal en el que se ejecuta"
      )
      .addIntegerOption((option) =>
        option
          .setName("cantidad")
          .setDescription("Cantidad de mensajes a eliminar")
          .setRequired(true)
          .setMinValue(0)
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("enviar")
      .setDescription(
        "Envía un mensaje desde la cuenta del bot en el canal en el que se ejecuta"
      )
      .addStringOption((option) =>
        option
          .setName("contenido")
          .setDescription("El contenido del mensaje a enviar")
          .setRequired(true)
      )
  )

export default createCommand(builder, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  switch (interaction.options.getSubcommand()) {
    case "limpiar":
      return handleClearSubcommand(interaction)
    case "enviar":
      return handleSendSubcommand(interaction)
    default:
      throw Error("Unhandled subcommand")
  }
})
