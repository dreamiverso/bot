import got from "got"
import { Window } from "happy-dom"
import { AutocompleteInteraction } from "discord.js"
import { Choice } from "../command.search"

function getUrl(query: string, type: Choice) {
  return `https://indreams.me/search/results/?term=${query}&type=${type}&sort=recommended`
}

const window = new Window()

export async function autocomplete(interaction: AutocompleteInteraction) {
  if (!interaction.guild) return

  const type = interaction.options.getString("tipo") as Choice | null

  if (!type) throw Error("missing type")

  const value = interaction.options.getFocused()
  const url = getUrl(value, type)
  const data = await got(url).text()

  window.document.body.innerHTML = data

  const elements = window.document.querySelectorAll("li.list__item")

  if (!elements.length) return interaction.respond([])

  const options = elements.map((element) => {
    const name = element.querySelector("h4").textContent
    const value = element.querySelector("a").getAttribute("href").substring(1)
    return { name, value }
  })

  await interaction.respond(options.slice(0, 25))
}
