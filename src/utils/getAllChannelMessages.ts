import { Client, Message } from "discord.js"

import { CHANNEL_ID } from "./constants"

/**
 * Gets all messages from a text channel.
 */
export async function getAllChannelMessages({
  client,
  id,
}: {
  client: Client<true>
  id: CHANNEL_ID
}) {
  const channel =
    client.channels.cache.get(id) ?? (await client.channels.fetch(id))

  if (!channel) {
    throw Error(`Channel with id ${id} not found`)
  }

  if (!channel.isTextBased()) {
    throw Error(`Channel with id ${id} is not text based`)
  }

  const messages: Message[] = []
  const firstBatch = await channel.messages.fetch({ limit: 1 })

  let pointer = firstBatch.size === 1 ? firstBatch.at(0) : null

  while (pointer) {
    const nextBatch = await channel.messages.fetch({
      limit: 100,
      before: pointer.id,
    })

    nextBatch.forEach((m) => messages.push(m))
    pointer = nextBatch.size ? nextBatch.at(nextBatch.size - 1) : null
  }

  return messages
}
