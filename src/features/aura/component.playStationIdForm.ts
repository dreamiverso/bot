import {
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js"

import { createComponent } from "~/utils"

import { getIndreamsUserData } from "./utils"

const ID = {
  AURA_FORM_INPUT_PSN_ID: "AURA_FORM_INPUT_PSN_ID",
  AURA_FORM_MODAL: "AURA_FORM_MODAL",
} as const

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

  const idPSN = interaction.fields.getTextInputValue(ID.AURA_FORM_INPUT_PSN_ID)

  try {
    const { level, auras } = await getIndreamsUserData(idPSN)

    await db.autoauraIntent.upsert({
      where: {
        idDiscord: interaction.user.id,
      },
      create: {
        idDiscord: interaction.user.id,
        idPSN,
      },
      update: {
        idPSN,
      },
    })

    await interaction.reply({
      content: `te pongo aura que la he encontrao nivel: ${level} auras: ${auras[0]}`,
    })
  } catch (error) {
    await interaction.reply({
      content: "ese psn id no existe en dreams! reintentar o cancelar",
    })
  }
})
