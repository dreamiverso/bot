export const projectRolePrefix = new RegExp(/(P[0-9]+) - /)

export function removeProjectRolePrefix(string: string) {
  if (!projectRolePrefix.test(string)) {
    throw Error("No role prefix found")
  }

  return string.replace(projectRolePrefix, "")
}
