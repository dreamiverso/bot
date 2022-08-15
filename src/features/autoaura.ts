import { Window } from "happy-dom"

import { FeatureHandler } from "~/types"
import { cron, db, CHANNEL_ID, AUTOAURA_SUBSCRIPTION_STATE } from "~/utils"

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

async function getLevelAndAuras(id: string) {
  const response = await fetch(`https://indreams.me/${id}`)
  const data = await response.text()

  window.document.body.innerHTML = data

  const [level, ...auras] = window.document.querySelectorAll(".persona")

  return {
    level: level.textContent,
    auras: auras.map((aura) => aura.textContent),
  }
}

/**
 * Tries to get the PlayStation Network id on each new message in the nicknames channel.
 * Automatically starts the autoaura enrollment funnel for new users.
 * Skips users who already went through the funnel.
 */
export const messageCreate: FeatureHandler<"messageCreate"> = async (
  message
) => {
  if (message.author.bot) return
  if (message.channel.id !== CHANNEL_ID.NICKNAMES) return

  const id = findPlayStationId(message.content)

  // Could not get a valid PSN id from the message.
  // Maybe we can check if the user is endolled and ask they for their PSN id instead of aborting
  if (!id) return

  const existingUser = await db.user.findUnique({
    where: {
      idDiscord: message.author.id,
    },
  })

  // User is already subscribed, exit process
  if (existingUser?.autoaura) return

  // TODO ask for consent
  // Here we assume user wants to endoll to autoaura
  const consents = true

  const levelAurasPromise = getLevelAndAuras(id)

  const createUserPromise = db.user.create({
    data: {
      idDiscord: message.author.id,
      idPSN: id,
      autoaura: consents
        ? AUTOAURA_SUBSCRIPTION_STATE.ENROLLED
        : AUTOAURA_SUBSCRIPTION_STATE.DECLINED,
    },
  })

  const [levelAndAuras] = await Promise.all([
    levelAurasPromise,
    createUserPromise,
  ])

  // TODO: assign role based on this values
  console.log("autoaura subscription flow scrape result", levelAndAuras)
}

/**
 * Creates a cron job that updates all existing autoaura subscriptions.
 */
export const ready: FeatureHandler<"ready"> = async () => {
  cron("0 * * * *", async () => {
    console.log("updating all autoaura subscriptions every hour")

    const endolledUsers = await db.user.findMany({
      where: {
        autoaura: {
          not: null,
        },
      },
    })

    endolledUsers.forEach(async (user) => {
      const { level, auras } = await getLevelAndAuras(user.idPSN)

      // TODO: assign role based on this values
      console.log(`will update user ${user} with new scrape data`, level, auras)
    })
  })
}
