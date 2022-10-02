import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  GuildMemberRoleManager,
} from "discord.js"

import { createComponent } from "~/utils"

import { roleSet } from "./utils"

enum ID {
  REMOVE = "auraRemoveButtonsRemove",
  CANCEL = "auraRemoveButtonsCancel",
}

const builder = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder()
    .setCustomId(ID.REMOVE)
    .setLabel("Eliminar")
    .setStyle(ButtonStyle.Danger),
  new ButtonBuilder()
    .setCustomId(ID.CANCEL)
    .setLabel("Cancelar")
    .setStyle(ButtonStyle.Secondary)
)

export default createComponent(builder, async (interaction) => {
  if (!interaction.isButton()) return

  switch (interaction.customId) {
    case ID.CANCEL: {
      return interaction.update({
        content: `¡Vale! No haré nada`,
        components: [],
      })
    }
    case ID.REMOVE: {
      if (!interaction.member) {
        throw Error("Missing interaction member")
      }

      if (!(interaction.member.roles instanceof GuildMemberRoleManager)) {
        throw Error("Unhandled code path: member roles property is id array")
      }

      const currentAuraRole = interaction.member.roles.cache.find((role) =>
        roleSet.has(role.name)
      )

      if (!currentAuraRole) {
        throw Error("Missing currentAuraRole")
      }

      // TODO: mirar si venía de autoaura y borrarlo

      await interaction.member.roles.remove(currentAuraRole)

      return interaction.update({
        content: `¡Hecho! 🥳 Ya no tienes aura asignada`,
        components: [],
      })
    }
    default:
      throw Error("Unhandled code path")
  }
})
