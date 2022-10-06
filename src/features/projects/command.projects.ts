import { SlashCommandBuilder } from "discord.js"

import { createCommand } from "~/utils"

import { visibilityChoices } from "./utils/choices"
import { handleCreateProjectSubcommand } from "./handleCreateProjectSubcommand"

const visibilityChoicesArray = Object.entries(visibilityChoices).map(
  ([key, value]) => ({
    name: value,
    value: key,
  })
)

const builder = new SlashCommandBuilder()
  .setName("proyecto")
  .setDescription("Comandos relacionados con los canales de proyecto")
  .addSubcommand((subcommand) =>
    subcommand
      .setName("crear")
      .setDescription("Crea un nuevo proyecto")
      .addStringOption((option) =>
        option
          .setName("nombre")
          .setDescription("El nombre de tu nuevo proyecto")
          .setRequired(true)
          .setMinLength(1)
          .setMaxLength(100)
      )
      .addStringOption((option) =>
        option
          .setName("visibilidad")
          .setDescription(
            "Escoge si tu canal de proyecto empezará siendo visible para todo el mundo o solo para sus miembros"
          )
          .setRequired(true)
          .addChoices(...visibilityChoicesArray)
      )
  )

export default createCommand(builder, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  switch (interaction.options.getSubcommand()) {
    case "crear":
      return handleCreateProjectSubcommand(interaction)
    default:
      throw Error("unhandled subcommand")
  }
})
