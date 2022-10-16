# docker-bun
docker files for bun and github actions to build base docker images and push them to dockerhub 
https://hub.docker.com/r/nwylynko/bun


https://bun.sh/ base images to run your bun service on top of.

Current have ubuntu and alpine images
```dockerfile
FROM nwylynko/bun:0.2.0-alpine
FROM nwylynko/bun:0.2.0-ubuntu
```

Repo: https://github.com/NWylynko/docker-bun

Example for using bun for npm deps and to run typescript
```dockerfile
FROM nwylynko/bun:0.2.0-alpine

# copy over codebase
COPY . .

# install NPM modules
RUN bun install

# bundle up npm modules so bun can read them in faster
RUN bun bun ./index.ts

# start the service
CMD ["bun", "run", "./index.ts"]
```

Example for using bun for npm deps and running tsc but node for running service. This has no runtime benefit but should speed up your CI/CD pipeline, resulting in faster deploys.
```dockerfile
FROM nwylynko/bun:0.2.0-alpine as Deps
WORKDIR /app

# copy in the package and lock from codebase
COPY ./package.json ./bun.lockb ./

# install dependencies
RUN bun install

FROM nwylynko/bun:0.2.0-alpine as Builder
WORKDIR /app

# copy in everything we need to build the source code
COPY ./tsconfig.json ./
COPY --from=Deps /app .
COPY src/ src/

# run our build step
RUN bun run build

FROM node:18.11.0-alpine as Runner
WORKDIR /app

# copy in everything we need to run the service
COPY ./package.json ./
COPY --from=Builder /app/dist ./dist

ENV NODE_ENV=production

CMD ["yarn", "start"]
```
