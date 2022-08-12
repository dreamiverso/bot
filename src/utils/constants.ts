export const id = {
  channel: {
    nicknames: "1007016335261315213",
  },
} as const

type Id = typeof id

export type ChannelId = Id["channel"][keyof Id["channel"]]
