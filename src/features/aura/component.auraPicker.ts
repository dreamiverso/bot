import { ActionRowBuilder, SelectMenuBuilder } from "discord.js"

import { createComponent } from "~/utils"

import { roles } from "./utils"

import playStationIdForm from "./component.playStationIdForm"

const builder = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
  new SelectMenuBuilder()
    .setCustomId("AURA_PICKER")
    .setPlaceholder("Selecciona el aura al que cambiar")
    .addOptions(Object.values(roles))
)

export default createComponent(builder, async (interaction) => {
  if (!interaction.isSelectMenu()) return

  const [selection] = interaction.values

  const intent = await db.autoauraIntent.findUnique({
    where: {
      idDiscord: interaction.user.id,
    },
  })

  if (selection !== "auto") {
    interaction.reply(`te tengo que asignar el aura ${selection}`)

    // Keeps the intent to prevent invoking the enrollemnt flow on the nicknames channel,
    // but removes its PSN ID to opt out of the cron job
    if (intent) {
      await db.autoauraIntent.update({
        where: {
          idDiscord: interaction.user.id,
        },
        data: {
          idPSN: null,
        },
      })
    }

    return
  }

  // User is already endolled and selected autoaura
  if (intent?.idPSN) {
    await interaction.reply(
      "Ya estás en autoaura. Quieres forzar actualización?"
    )

    return
  }

  // User is not endolled. Ask for PSN ID
  await interaction.showModal(playStationIdForm.builder)
})
