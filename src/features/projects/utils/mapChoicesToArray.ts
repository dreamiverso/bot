export function mapChoicesToArray<T extends Record<string, string>>(
  choices: T
) {
  return Object.entries(choices).map(([key, value]) => ({
    name: value,
    value: key,
  }))
}
