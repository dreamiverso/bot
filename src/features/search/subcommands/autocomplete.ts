import got from "got"
import { Window } from "happy-dom"
import { decode } from "html-entities"
import { AutocompleteInteraction } from "discord.js"

import { Choice } from "../command.search"

function getUrl(query: string, type: Choice) {
  const url = new URL("https://indreams.me/search/results/")
  if (query) url.searchParams.set("term", query)
  if (type && type !== "all") url.searchParams.set("type", type)
  url.searchParams.set("sort", "recommended")
  return url.toString()
}

const window = new Window()

export async function autocomplete(interaction: AutocompleteInteraction) {
  if (!interaction.guild) return

  const type = interaction.options.getString("tipo") as Choice | null

  if (!type) return

  const value = interaction.options.getFocused()
  const url = getUrl(value, type)
  const data = await got(url, { headers: { cookie: "Locale=es_ES" } }).text()

  window.document.body.innerHTML = data

  const elements = window.document.querySelectorAll("li.list__item")

  if (!elements.length) return interaction.respond([])

  const options = elements.map((element) => {
    const name = decode(element.querySelector("h4").textContent)
    const value = element.querySelector("a").getAttribute("href").substring(1)
    return { name, value }
  })

  await interaction.respond(options.slice(0, 25))
}
