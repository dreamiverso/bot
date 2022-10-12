import { SlashCommandBuilder } from "discord.js"

import { createCommand } from "~/utils"

import { visibilityChoices, mapChoicesToArray } from "./utils"

import { autocompleteProject } from "./subcommands/autocompleteProject"
import { create } from "./subcommands/create"
import { editName } from "./subcommands/editName"
import { editTheme } from "./subcommands/editTheme"
import { editVisibility } from "./subcommands/editVisibility"
import { membersList } from "./subcommands/membersList"
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
          .setDescription("El proyecto a eliminar")
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
          .addStringOption((option) =>
            option
              .setName("proyecto")
              .setDescription("El proyecto a consultar")
              .setRequired(true)
              .setAutocomplete(true)
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
  const group = interaction.options.data[0].name

  // @ts-expect-error getSubcommand also works with autocomplete wth is this error
  switch (interaction.options.getSubcommand()) {
    case "crear":
      return create(interaction)
    case "nombre":
      if (interaction.isAutocomplete()) return autocompleteProject(interaction)
      return editName(interaction)
    case "tema":
      if (interaction.isAutocomplete()) return autocompleteProject(interaction)
      return editTheme(interaction)
    case "visibilidad":
      if (interaction.isAutocomplete()) return autocompleteProject(interaction)
      return editVisibility(interaction)
    case "listar":
      if (interaction.isAutocomplete()) return autocompleteProject(interaction)
      return membersList(interaction)
    case "añadir":
      if (interaction.isAutocomplete()) return autocompleteProject(interaction)
      return interaction.reply("miembros añadir")
    case "eliminar":
      if (interaction.isAutocomplete()) return autocompleteProject(interaction)
      if (group === "miembros") return interaction.reply("miembros eliminar")
      return remove(interaction)
    default:
      throw Error("unhandled subcommand")
  }
})
