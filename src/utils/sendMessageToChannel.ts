import { Client, MessagePayload, MessageOptions } from "discord.js"

import { CHANNEL_ID } from "./constants"

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
