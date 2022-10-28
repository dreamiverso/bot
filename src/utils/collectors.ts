import {
  AwaitModalSubmitOptions,
  ButtonInteraction,
  ChatInputCommandInteraction,
  ComponentType,
  MessageChannelCollectorOptionsParams,
  MessageComponentType,
  ModalSubmitInteraction,
  SelectMenuInteraction,
} from "discord.js"

export async function collectComponentInteraction<
  T extends MessageComponentType
>(
  interaction: ChatInputCommandInteraction,
  options: MessageChannelCollectorOptionsParams<T> & {
    ids: string[]
  }
) {
  return new Promise<
    T extends ComponentType.Button
      ? ButtonInteraction
      : T extends ComponentType.SelectMenu
      ? SelectMenuInteraction
      : never
  >((resolve, reject) => {
    if (!interaction.channel) {
      return reject("Expected property 'channel' in interaction")
    }

    const collector =
      interaction.channel.createMessageComponentCollector<T>(options)

    collector.on("collect", async (i) => {
      // @ts-expect-error I don't know anymore, sorry
      if (i.user.id !== interaction.user.id) return
      // @ts-expect-error I don't know anymore, sorry
      if (!options.ids.includes(i.customId)) return
      // @ts-expect-error I don't know anymore, sorry
      return resolve(i)
    })

    collector.on("end", (interactions) => {
      const collected = interactions.some((i) => {
        // @ts-expect-error I don't know anymore, sorry
        if (i.user.id !== interaction.user.id) return false
        // @ts-expect-error I don't know anymore, sorry
        if (!options.ids.includes(i.customId)) return false
        return true
      })

      if (!collected) reject("No interaction found")
    })
  })
}

export async function collectModalInteraction(
  interaction: ChatInputCommandInteraction,
  options: AwaitModalSubmitOptions<ModalSubmitInteraction> & {
    ids: string[]
  }
) {
  return new Promise<ModalSubmitInteraction>((resolve, reject) => {
    interaction
      .awaitModalSubmit(options)
      .then((i) => {
        if (i.user.id !== interaction.user.id) return
        if (!options.ids.includes(i.customId)) return
        return resolve(i)
      })
      .catch(() => {
        reject("No interaction found")
      })
  })
}
