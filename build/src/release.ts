import { readFile, writeFile } from "fs/promises"
import { join } from "path"

const path = join(__dirname, "../../latestrelease")

export const getKnownLatestReleaseDate = async () => {

  const file = await readFile(path, "utf-8")
  const latestreleaseFile = file.toString();
  const knownLatestRelease = new Date(latestreleaseFile)

  return knownLatestRelease;
}

export const setKnownLatestReleaseDate = async (knownLatestRelease: string) => {
  await writeFile(path, knownLatestRelease, "utf-8")
}