import { ActionRowBuilder, SelectMenuBuilder } from "discord.js"

import { createComponent } from "~/utils"

import { roles } from "../utils"

import playStationIdForm from "./playStationIdForm"

enum ID {
  AURA_PICKER = "AURA_PICKER",
}

export const builder = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
  new SelectMenuBuilder()
    .setCustomId(ID.AURA_PICKER)
    .setPlaceholder("Selecciona el aura al que cambiar")
    .addOptions(Object.values(roles))
)

export default createComponent(builder, async (interaction) => {
  if (!interaction.isSelectMenu()) return
  if (interaction.customId !== ID.AURA_PICKER) return

  const [selection] = interaction.values

  if (selection !== "auto") {
    interaction.reply(`te tengo que asignar el aura ${selection}`)
    return
  }

  const existingUser = await db.user.findUnique({
    select: {
      idPSN: true,
    },
    where: {
      idDiscord: interaction.user.id,
    },
  })

  if (!existingUser) {
    interaction.showModal(playStationIdForm.builder)
    return
  }

  interaction.reply(
    `tengo que mirar si tu id ${existingUser.idPSN} existe en indreams y asignarte lo que encuentre`
  )
})
