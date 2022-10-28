import { SlashCommandBuilder } from "discord.js"

import { createCommand } from "~/utils"

import {
  autocomplete,
  searchUser,
  searchContent,
  searchCollection,
} from "./subcommands"

import { getContentKind, CONTENT_KIND } from "./utils"

export const choices = [
  { name: "Cualquier cosa", value: "all" },
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

  const term = interaction.options.getString("término")

  if (!term) {
    return interaction.reply({
      content: "¡Debes escoger un usuario!",
      ephemeral: true,
    })
  }

  const kind = getContentKind(term)

  switch (kind) {
    case CONTENT_KIND.DREAM:
    case CONTENT_KIND.SCENE:
    case CONTENT_KIND.ELEMENT:
      return searchContent(interaction)
    case CONTENT_KIND.COLLECTION:
      return searchCollection(interaction)
    case CONTENT_KIND.USER:
      return searchUser(interaction)
  }
})
