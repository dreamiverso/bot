import { GuildMemberRoleManager, SlashCommandBuilder } from "discord.js"

import { createCommand } from "~/utils"

import { roles, roleSet } from "./utils"
import componentAuraRemoveButtons from "./component.auraRemoveButtons"

const choices = Object.entries(roles).map(([key, value]) => ({
  name: value,
  value: key,
}))

const builder = new SlashCommandBuilder()
  .setName("aura")
  .setDescription("Cambia tu aura")
  .addStringOption((option) =>
    option
      .setName("tipo")
      .setDescription("Tipo de aura")
      .setRequired(true)
      .addChoices(...choices)
  )

export default createCommand(builder, async (interaction) => {
  if (!interaction.isChatInputCommand()) return

  const selection = interaction.options.getString("tipo") as
    | keyof typeof roles
    | null

  if (!selection) {
    return interaction.reply({
      content: `Debes elegir una opción`,
      ephemeral: true,
    })
  }

  if (!interaction.member) {
    throw Error("Missing interaction member")
  }

  if (!(interaction.member.roles instanceof GuildMemberRoleManager)) {
    throw Error("Unhandled code path: member roles property is id array")
  }

  // Try to get current user aura role
  const currentAuraRole = interaction.member.roles.cache.find((role) =>
    roleSet.has(role.name)
  )

  // User has the selected aura
  if (currentAuraRole?.name === roles[selection]) {
    return interaction.reply({
      content: `¡Ya tienes ese aura! ¿Quieres eliminarla?`,
      ephemeral: true,
      components: [componentAuraRemoveButtons.builder],
    })
  }

  // TODO Autoaura option
  // if (selection === "auto") {
  //   return interaction.reply({
  //     content: `El usuario quiere suscribirse autoaura. Mirar si está suscrito o no y hacer cosas`,
  //     ephemeral: true,
  //   })
  // }

  // Remove aura option
  if (selection === "none") {
    if (!currentAuraRole) {
      return interaction.reply({
        content: `¡No tienes aura asignada!`,
        ephemeral: true,
      })
    }

    // TODO: mirar si venía de autoaura y borrarlo

    await interaction.member.roles.remove(currentAuraRole)

    return interaction.reply({
      content: `¡Hecho! 🥳 Ya no tienes aura asignada`,
      ephemeral: true,
    })
  }

  const serverRoles = interaction.guild?.roles.cache.values()

  if (!serverRoles) {
    throw Error("Could not find server roles")
  }

  const targetRole = Array.from(serverRoles).find(
    (role) => role.name === roles[selection]
  )

  if (!targetRole) {
    throw Error(`Unhandled option: ${targetRole}`)
  }

  // If user has any other aura role, remove it
  if (currentAuraRole) {
    await interaction.member.roles.remove(currentAuraRole)
  }

  await interaction.member.roles.add(targetRole)

  return interaction.reply({
    content: `¡Hecho! 🥳 Te he asignado el aura ${
      targetRole.name.charAt(0).toLowerCase() + targetRole.name.slice(1)
    }`,
    ephemeral: true,
  })
})
