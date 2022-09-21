import { Client, Message, MessagePayload, MessageOptions } from "discord.js"

import { CHANNEL_ID } from "./constants"

export async function getAllChannelMessages(
  client: Client<boolean>,
  id: CHANNEL_ID
) {
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

export async function sendMessageToChannel(
  client: Client,
  id: CHANNEL_ID,
  message: string | MessagePayload | MessageOptions
) {
  const channel = client.channels.cache.find((channel) => channel.id === id)

  if (!channel) {
    throw Error(`could not find channel ${id}`)
  }

  if (!channel.isTextBased()) {
    throw Error(`channel ${id} is not text based`)
  }

  return channel.send(message)
}
