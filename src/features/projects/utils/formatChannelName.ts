const invalidChannelNameCharacters = /([^-_\p{L}0-9\s\p{Z}·¬¨]+)/giu
const whitespaces = /[\p{Z}\s]+/giu

/**
 * Parses a string to match Discord's channel format
 *
 * ```ts
 * formatChannelName(¿Cuándo sale Starfarmer™?) // cuándo_sale_starfarmer
 *
 * ```
 */
export function formatChannelName(name: string) {
  return name
    .replace(invalidChannelNameCharacters, "")
    .trim()
    .replace(whitespaces, "_")
    .toLocaleLowerCase()
}
