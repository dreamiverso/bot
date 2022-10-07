import { SlashCommandBuilder } from "discord.js"

import { createCommand } from "~/utils"

import { visibilityChoices, mapChoicesToArray } from "./utils"
import { handleCreateProjectSubcommand } from "./handleCreateProjectSubcommand"
import { handleEditProjectSubcommand } from "./handleEditProjectSubcommand"

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
          .addChoices(...mapChoicesToArray(visibilityChoices))
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("editar")
      .setDescription("Modifica un proyecto al que pertenezcas")
      .addStringOption((option) =>
        option
          .setName("proyecto")
          .setDescription("El proyecto a modificar")
          .setRequired(true)
          .setAutocomplete(true)
      )
  )

export default createCommand(builder, async (interaction) => {
  // @ts-expect-error getSubcommand also works with autocomplete wth is this error
  switch (interaction.options.getSubcommand()) {
    case "crear":
      return handleCreateProjectSubcommand(interaction)
    case "editarconform":
      return handleEditProjectSubcommand(interaction)
    default:
      throw Error("unhandled subcommand")
  }
})
