import { exec } from "child_process"

import { env } from "~/utils"

async function getGitBranch() {
  return new Promise((resolve, reject) => {
    exec("git branch --show-current", (error, stdout) => {
      if (error) return reject()
      resolve(stdout.trim())
    })
  })
}

export async function image(name: `${string}.${string}`) {
  if (env.NODE_ENV === "production") {
    return `https://raw.githubusercontent.com/dreamiverso/bot/main/public/${name}`
  }

  const gitBranch = await getGitBranch()
  return `https://raw.githubusercontent.com/dreamiverso/bot/${gitBranch}/public/${name}`
}
