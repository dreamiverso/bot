import { Client, Message } from "discord.js"

export type FeatureMessageHandler = (args: {
  client: Client<true>
  message: Message<boolean>
}) => Promise<void>

export type ConnectHandler = (args: { client: Client<true> }) => Promise<void>
