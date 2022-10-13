import { AutocompleteInteraction, CommandInteraction } from "discord.js"

import { getProjectInfoFromAutocompleteOption } from "../utils"

export async function membersRemove(
  interaction: CommandInteraction | AutocompleteInteraction
) {
  if (!interaction.isChatInputCommand()) return
  if (!interaction.guild) return

  const user = interaction.options.getUser("usuario")

  if (!user) {
    return interaction.reply({
      ephemeral: true,
      content: "¡Debes elegir a un usuario!",
    })
  }

  if (user.bot) {
    return interaction.reply({
      ephemeral: true,
      content: `¡Ups! El usuario ${user} es un bot 🤔`,
    })
  }

  const info = await getProjectInfoFromAutocompleteOption(interaction, {
    force: true,
  })

  if (!info) {
    throw Error("Could not find info for this project")
  }

  const { role, projectName, channel } = info

  const exists = role.members.has(user.id)

  if (!exists) {
    return interaction.reply({
      ephemeral: true,
      content: `¡Ups! El usuario ${user} no es miembro del proyecto *${projectName}* 🤔`,
    })
  }

  await interaction.guild.members.removeRole({
    role,
    user,
    reason: "Removed with `/proyecto miembros eliminar` slash command",
  })

  await channel.send({
    content: `${interaction.user} ha eliminado a ${user} como miembro del proyecto *${projectName}*`,
  })

  return interaction.reply({
    ephemeral: true,
    content: `¡Hecho! 🥳 El usuario ${user} ya no es miembro del proyecto *${projectName}*`,
  })
}
