import nodeCron from "node-cron"

type Schedule = typeof nodeCron["schedule"]

export function cron(...args: Parameters<Schedule>): ReturnType<Schedule> {
  nodeCron.validate(args[0])
  return nodeCron.schedule(...args)
}
