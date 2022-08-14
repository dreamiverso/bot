import { Window } from "happy-dom"

import { Handler } from "~/types"
import { id, env, getAllChannelMessages } from "~/utils"

const keywords = [
  "ps",
  "psn",
  "ps3",
  "ps4",
  "ps5",
  "ps3id",
  "ps4id",
  "ps5id",
  "dreams",
  "play",
  "playid",
  "station",
  "network",
  "playstation3",
  "pipastation3",
  "playstation4",
  "pipastation4",
  "playstation5",
  "pipastation5",
] as const

const window = new Window()

/**
 * Removes invalid PSN ID characters.
 */
const normalizedMessage = new RegExp(/([^A-Za-z0-9\-_]+)/g)

/**
 * Removes content between brackets.
 */
const stripBrackets = new RegExp(/(\[.*?\])|(\(.*?\))/g)

/**
 * Searches for keywords in the message and matches the word after.
 */
const keywordsRegex = new RegExp(
  `(?<=(?:(${keywords
    .map((k) => `( |^)${k} +`)
    .join("|")}))+ *)(\\b([a-zA-Z0-9-_]{3,16})\\b)|$`,
  "gi"
)

/**
 * Removes short words that cannot be used to identify a PSN ID,
 * such as articles. Preserves keywords.
 */
const removeNoiseWords = new RegExp(
  `(\\b(?!${keywords.join("|")})(\\w{1,3})\\b(\\s|$))`,
  "gi"
)

function getPlayStationId(text: string) {
  const [match] =
    text
      .replace(stripBrackets, "")
      .replace(normalizedMessage, " ")
      .replace(removeNoiseWords, "")
      .match(keywordsRegex) ?? []

  return match
}

async function getLevelAndAura(id: string) {
  const response = await fetch(`https://indreams.me/${id}`)
  const data = await response.text()

  window.document.body.innerHTML = data

  const level = window.document.querySelector(".profile__level")
  const mainAura = window.document.querySelectorAll(".persona")[1]

  return {
    level: level.textContent,
    mainAura: mainAura.textContent,
  }
}

export const ready: Handler<"ready"> = async (client) => {
  const messages = await getAllChannelMessages({
    client,
    id: id.channel.nicknames,
  })

  if (!messages.length) return

  for (const message of messages) {
    const id = getPlayStationId(message.content)

    if (id && env.NODE_ENV === "production") {
      console.log(`found ${id}, trying to scrape indreams`)
      const { level, mainAura } = await getLevelAndAura(id)
      console.log({ id, level, mainAura })
    }
  }
}

export const messageCreate: Handler<"messageCreate"> = async (message) => {
  if (message.channel.id !== id.channel.nicknames) return
  console.log(message.content)
}
