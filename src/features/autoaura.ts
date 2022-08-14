import { Message } from "discord.js"
import { Window } from "happy-dom"

import { FeatureHandler } from "~/types"
import { id, cron } from "~/utils"

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

function findPlayStationId(text: string) {
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
  const aura = window.document.querySelectorAll(".persona")[1]

  return {
    level: level.textContent,
    aura: aura.textContent,
  }
}

async function handleMessage(message: Message) {
  const id = findPlayStationId(message.content)

  if (!id) return

  const levelAndAura = await getLevelAndAura(id)
  return { id, ...levelAndAura }
}

/**
 * Tries to get the PlayStation Network id on each new message in the nicknames channel.
 * Starts the autoaura subscription flow.
 */
export const messageCreate: FeatureHandler<"messageCreate"> = async (
  message
) => {
  if (message.author.bot) return
  if (message.channel.id !== id.channel.nicknames) return

  const result = handleMessage(message)
  console.log("autoaura subscription flow scrape result", result)
}

/**
 * Creates a cron job that updates all existing autoaura subscriptions.
 */
export const ready: FeatureHandler<"ready"> = async () => {
  cron("0 * * * *", () => {
    console.log("update autoaura subscriptions")
  })
}
