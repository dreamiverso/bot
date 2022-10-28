export enum CONTENT_KIND {
  USER,
  DREAM,
  SCENE,
  ELEMENT,
  COLLECTION,
}

export function getContentKind(term: string) {
  const [kind] = term.split("/")

  switch (kind) {
    case "dream":
      return CONTENT_KIND.DREAM
    case "scene":
      return CONTENT_KIND.SCENE
    case "element":
      return CONTENT_KIND.ELEMENT
    case "collection":
      return CONTENT_KIND.COLLECTION
    default:
      return CONTENT_KIND.USER
  }
}
