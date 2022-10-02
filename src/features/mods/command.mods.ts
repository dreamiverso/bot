import { GuildMemberRoleManager, SlashCommandBuilder } from "discord.js"
import { createCommand } from "~/utils"

import { handleClearSubcommand } from "./handleClearSubcommand"
import { handleSendSubcommand } from "./handleSendSubcommand"

const builder = new SlashCommandBuilder()
  .setName("mod")
  .setDescription("Comandos especiales del equipo de moderación")
  .setDefaultMemberPermissions(32)
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

  if (!(interaction.member?.roles instanceof GuildMemberRoleManager)) {
    throw Error("Member roles missing or not GuildMemberRoleManager")
  }

  const isMod = interaction.member.roles.cache.find(
    (role) => role.name === "Moderadores"
  )

  if (!isMod) {
    return interaction.reply({
      content: "¡No puedes usar este comando!",
      ephemeral: true,
    })
  }

  switch (interaction.options.getSubcommand()) {
    case "limpiar":
      return handleClearSubcommand(interaction)
    case "enviar":
      return handleSendSubcommand(interaction)
    default:
      throw Error("Unhandled subcommand")
  }
})
