import { getLatestRelease } from './github';
import { getKnownLatestReleaseDate } from "./loadrelease"
import { runner } from './runner';
import utils from "node:util"

const main = async () => {
  const newestRelease = await getLatestRelease()

  const newRelease = new Date(newestRelease.published_at);
  const oldRelease = await getKnownLatestReleaseDate();
  const isNewVersion = newRelease.getTime() > oldRelease.getTime();

  console.log({ newRelease, oldRelease, isNewVersion })

  if (!isNewVersion) {
    throw new Error(`There is not a new version, STOP!`)
  }

  const version = newestRelease.tag_name.split(`v`)[1]

  const asset = newestRelease.assets.find(({ name }) => name === `bun-linux-x64.zip`)

  if (!asset) {
    throw new Error(`bun-linux-x64.zip cannot be found`)
  }

  const bun_url = asset.browser_download_url;

  const args = utils.parseArgs({
    options: {
      "token": {
        type: "string",
        multiple: false,
      }
    }
  })

  const dockerToken = args.values.token;

  if (!dockerToken) {
    throw new Error(`no token to auth with docker was supped with --token`)
  }

  const loginCommand = `docker login -u nwylynko -p ${dockerToken}`

  await runner(loginCommand)

  const flavours = [`alpine`, `ubuntu`];

  for (const flavour of flavours) {

    const tag = `nwylynko/bun:${version}-${flavour}`

    const buildCommand = `docker build -f ./${flavour}.Dockerfile -t ${tag} --build-arg BUN_URL=${bun_url} .`

    console.log({ buildCommand })

    await runner(buildCommand)

    const pushCommand = `docker push ${tag}`

    console.log({ pushCommand })

    await runner(pushCommand)

  }

}

main();