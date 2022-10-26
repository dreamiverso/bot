import got from "got"
import { Window } from "happy-dom"
import { parseSrcset } from "srcset"
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
} from "discord.js"

import { shareButton } from "../component.shareToChannelButton"

const window = new Window()

export async function searchDream(interaction: CommandInteraction) {
  if (!interaction.isChatInputCommand()) return
  if (!interaction.guild) return

  const term = interaction.options.getString("término")

  if (!term) {
    return interaction.reply({
      content: "¡Debes escoger un usuario!",
      ephemeral: true,
    })
  }

  try {
    const url = `https://indreams.me/${term}`
    const data = await got(url, { headers: { cookie: "Locale=es_ES" } }).text()
    window.document.body.innerHTML = data

    const srcset = window.document
      .querySelector(".gallery img")
      .getAttribute("srcset")

    const [banner] = parseSrcset(srcset)

    const title = window.document.querySelector("h1").textContent

    const descr = window.document.querySelector(
      ".profile__block.profile__block--intro"
    ).textContent

    const embed = new EmbedBuilder()
      .setColor(0x8000ff)
      .setImage(banner.url)
      .addFields(
        {
          name: "Nombre",
          value: title,
        },
        {
          name: "Descripción",
          value: descr,
        }
      )

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      shareButton,
      new ButtonBuilder()
        .setStyle(ButtonStyle.Link)
        .setLabel("Ver en indreams.me")
        .setURL(url)
    )

    return interaction.reply({
      ephemeral: true,
      content: `¡Échale un vistazo a este sueño!`,
      embeds: [embed],
      components: [buttons],
    })
  } catch (error) {
    return interaction.reply({
      ephemeral: true,
      content: `¡Ups! No hemos podido encontrar el sueño ${term} 🤔`,
    })
  }
}
