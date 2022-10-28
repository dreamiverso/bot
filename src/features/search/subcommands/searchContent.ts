import got from "got"
import { Window } from "happy-dom"
import { decode } from "html-entities"
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

export async function searchContent(interaction: CommandInteraction) {
  if (!interaction.isChatInputCommand()) return
  if (!interaction.guild) return

  const term = interaction.options.getString("término")

  if (!term) {
    return interaction.reply({
      content: "¡Debes escoger un término!",
      ephemeral: true,
    })
  }

  const url = `https://indreams.me/${term}`

  try {
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
          value: decode(title),
        },
        {
          name: "Descripción",
          value: decode(descr),
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
      content: `¡Échale un vistazo a esto!`,
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
