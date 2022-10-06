const invalidChannelNameCharacters = new RegExp(/([^-_\p{L}0-9\s\p{Z}·¬¨]+)/giu)
const whitespaces = new RegExp(/[\p{Z}\s]+/giu)

/**
 * Parses a string to match Discord's channel format
 *
 * ```ts
 * formatChannelName(¿Cuándo sale Starfarmer™?) // cuándo-sale-starfarmer
 *
 * ```
 */
export function formatChannelName(name: string) {
  return name
    .replace(invalidChannelNameCharacters, "")
    .replace(whitespaces, "-")
    .toLocaleLowerCase()
}
