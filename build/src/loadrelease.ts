import { readFile } from "fs/promises"
import { join } from "path"

export const getKnownLatestReleaseDate = async () => {
  const path = join(__dirname, "../../latestrelease")
  console.log({ path })
  const file = await readFile(path, "utf-8")
  const latestreleaseFile = file.toString();
  const knownLatestRelease = new Date(latestreleaseFile)

  return knownLatestRelease;
}