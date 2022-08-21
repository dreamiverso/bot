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

export function findPlayStationId(text: string) {
  const matches =
    text
      .replace(stripBrackets, "")
      .replace(normalizedMessage, " ")
      .replace(removeNoiseWords, "")
      .match(keywordsRegex) ?? []

  return matches.length ? matches[0] : null
}
