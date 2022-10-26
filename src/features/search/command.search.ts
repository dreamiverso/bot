import { SlashCommandBuilder } from "discord.js"

import { createCommand } from "~/utils"

import { autocomplete } from "./subcommands/autocomplete"
import { searchUser } from "./subcommands/searchUser"
import { searchContent } from "./subcommands/searchContent"
import { searchCollection } from "./subcommands/searchCollection"

export const choices = [
  { name: "Usuario", value: "users" },
  { name: "Sueño", value: "dreams" },
  { name: "Escena", value: "scenes" },
  { name: "Elemento", value: "elements" },
  { name: "Colección", value: "collections" },
] as const

export type Choice = typeof choices[number]["value"]

const builder = new SlashCommandBuilder()
  .setName("buscar")
  .setDescription("Busca contenido en el Dreamiverso")
  .addStringOption((option) =>
    option
      .setName("tipo")
      .setDescription("El tipo de contenido a buscar")
      .setRequired(true)
      .addChoices(...choices)
  )
  .addStringOption((option) =>
    option
      .setName("término")
      .setDescription("El término a buscar")
      .setRequired(true)
      .setAutocomplete(true)
  )

export default createCommand(builder, (interaction) => {
  if (interaction.isAutocomplete()) return autocomplete(interaction)
  if (!interaction.isChatInputCommand()) return

  const type = interaction.options.getString("tipo") as Choice | null

  if (!type) {
    return interaction.reply({
      ephemeral: true,
      content: "¡Debes elegir el tipo de contenido!",
    })
  }

  switch (type) {
    case "users":
      return searchUser(interaction)
    case "dreams":
    case "scenes":
    case "elements":
      return searchContent(interaction)
    case "collections":
      return searchCollection(interaction)
    default:
      throw Error(`Unhandled search type: ${type}`)
  }
})
