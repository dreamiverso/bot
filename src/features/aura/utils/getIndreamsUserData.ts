import { Window } from "happy-dom"

const window = new Window()

export async function getIndreamsUserData(id: string) {
  const response = await fetch(`https://indreams.me/${id}`)
  const data = await response.text()

  window.document.body.innerHTML = data

  const [level, ...auras] = window.document.querySelectorAll(".persona")

  return {
    level: level.textContent,
    auras: auras.map((aura) => aura.textContent),
  }
}
