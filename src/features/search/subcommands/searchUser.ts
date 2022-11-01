import got from "got"
import { Window } from "happy-dom"
import { decode } from "html-entities"
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js"

import { shareButton } from "../component.shareToChannelButton"

const window = new Window()

export async function searchUser(interaction: CommandInteraction) {
  if (!interaction.isChatInputCommand()) return
  if (!interaction.guild) return

  const term = interaction.options.getString("término")

  if (!term) {
    return interaction.reply({
      content: "¡Debes escoger un usuario!",
      ephemeral: true,
    })
  }

  const url = `https://indreams.me/${term}`

  try {
    const data = await got(url, { headers: { cookie: "Locale=es_ES" } }).text()
    window.document.body.innerHTML = data

    const avatar = window.document
      .querySelector(".profile__thumbnail img")
      .getAttribute("src")

    const personas = window.document.querySelectorAll(".persona")

    const [level, primaryAura, secondaryAura] = Array.from(personas).map(
      (element) => decode(element.textContent)
    )

    const levelField = level && {
      name: "Nivel",
      value: level,
    }

    const auraField = primaryAura && {
      name: secondaryAura ? "Auras" : "Aura",
      value: secondaryAura ? `${primaryAura} + ${secondaryAura}` : primaryAura,
    }

    const embed = new EmbedBuilder()
      .setColor(0x8000ff)
      .setImage(avatar)
      .addFields({
        name: "Nombre de usuario",
        value: decode(term),
      })

    if (levelField) embed.addFields(levelField)
    if (auraField) embed.addFields(auraField)

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      shareButton,
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Ver en indreams.me")
        .setURL(url)
    )

    return interaction.reply({
      ephemeral: true,
      content: `¡Échale un vistazo al perfil de ${term}!`,
      embeds: [embed],
      components: [buttons],
    })
  } catch (error) {
    return interaction.reply({
      ephemeral: true,
      content: `¡Ups! No he podido encontrar eso… 🤔 Prueba visitando la url: ${url}`,
    })
  }
}
