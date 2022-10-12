import { SlashCommandBuilder } from "discord.js"

import { createCommand } from "~/utils"

import { visibilityChoices, mapChoicesToArray } from "./utils"

import { autocompleteProject } from "./subcommands/autocompleteProject"
import { create } from "./subcommands/create"
import { edit } from "./subcommands/edit"
import { remove } from "./subcommands/remove"

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
            "Quiénes podrán ver inicialmente tu canal de proyecto"
          )
          .setRequired(true)
          .addChoices(...mapChoicesToArray(visibilityChoices))
      )
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("eliminar")
      .setDescription("Elimina un proyecto al que pertenezcas")
      .addStringOption((option) =>
        option
          .setName("proyecto")
          .setDescription("El proyecto a modificar")
          .setRequired(true)
          .setAutocomplete(true)
      )
  )
  .addSubcommandGroup((group) =>
    group
      .setName("editar")
      .setDescription("Modifica un proyecto al que pertenezcas")
      .addSubcommand((subcommand) =>
        subcommand
          .setName("nombre")
          .setDescription(
            "Modifica el nombre de un proyecto al que pertenezcas"
          )
          .addStringOption((option) =>
            option
              .setName("proyecto")
              .setDescription("El proyecto a modificar")
              .setRequired(true)
              .setAutocomplete(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("tema")
          .setDescription("Modifica el tema de un proyecto al que pertenezcas")
          .addStringOption((option) =>
            option
              .setName("proyecto")
              .setDescription("El proyecto a modificar")
              .setRequired(true)
              .setAutocomplete(true)
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("visibilidad")
          .setDescription(
            "Modifica la visibilidad de un proyecto al que pertenezcas"
          )
          .addStringOption((option) =>
            option
              .setName("proyecto")
              .setDescription("El proyecto a modificar")
              .setRequired(true)
              .setAutocomplete(true)
          )
          .addStringOption((option) =>
            option
              .setName("visibilidad")
              .setDescription("Quiénes podrán ver tu canal de proyecto")
              .setRequired(true)
              .addChoices(...mapChoicesToArray(visibilityChoices))
          )
      )
  )
  .addSubcommandGroup((group) =>
    group
      .setName("miembros")
      .setDescription("Maneja los miembros de un proyecto al que pertenezcas")
      .addSubcommand((subcommand) =>
        subcommand
          .setName("listar")
          .setDescription(
            "Lista todos los miembros de un proyecto al que pertenezcas"
          )
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("añadir")
          .setDescription("Añade miembros a un proyecto al que pertenezcas")
      )
      .addSubcommand((subcommand) =>
        subcommand
          .setName("eliminar")
          .setDescription("Elimina miembros de un proyecto al que pertenezcas")
      )
  )

export default createCommand(builder, async (interaction) => {
  // @ts-expect-error getSubcommand also works with autocomplete wth is this error
  switch (interaction.options.getSubcommand()) {
    case "crear":
      return create(interaction)
    case "editar":
      if (interaction.isAutocomplete()) return autocompleteProject(interaction)
      return edit(interaction)
    case "eliminar":
      if (interaction.isAutocomplete()) return autocompleteProject(interaction)
      return remove(interaction)
    default:
      throw Error("unhandled subcommand")
  }
})
