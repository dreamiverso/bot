import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js"

import { createComponent, constants } from "~/utils"

import { getLevelAndAuras } from "../utils"

enum ID {
  AURA_FORM_INPUT_PSN_ID = "AURA_FORM_INPUT_PSN_ID",
  AURA_FORM_MODAL = "AURA_FORM_MODAL",
}

const input = new TextInputBuilder()
  .setCustomId(ID.AURA_FORM_INPUT_PSN_ID)
  .setLabel("Introduce tu ID de PSN")
  .setStyle(TextInputStyle.Short)
  .setMinLength(3)
  .setMaxLength(16)
  .setRequired(true)

const row =
  new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(input)

const builder = new ModalBuilder()
  .setCustomId(ID.AURA_FORM_MODAL)
  .setTitle("Autoaura")
  .addComponents(row)

export default createComponent(builder, async (interaction) => {
  if (!interaction.isModalSubmit()) return
  if (interaction.customId !== ID.AURA_FORM_MODAL) return

  const idPSN = interaction.fields.getTextInputValue(ID.AURA_FORM_INPUT_PSN_ID)

  try {
    const { level, auras } = await getLevelAndAuras(idPSN)
    await db.user.create({
      data: {
        idDiscord: interaction.user.id,
        autoaura: constants.AUTOAURA_SUBSCRIPTION_STATE.ENROLLED,
        idPSN,
      },
    })

    await interaction.reply({
      content: `te pongo aura que la he encontrao nivel: ${level} auras: ${auras[0]}`,
    })
  } catch (error) {
    // la ha liado y no es correcto. Volver a mandarle el modal
    console.log(error)
    await interaction.reply({
      content: "ese psn id no existe en dreams!",
    })
  }
})
