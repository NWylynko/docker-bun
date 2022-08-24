# Found here https://github.com/oven-sh/bun/issues/211#issuecomment-1180644348
# Found here https://github.com/TheOtterlord/docker-bun/blob/main/edge/ubuntu/Dockerfile

### GET ###
FROM ubuntu:latest as get

# prepare environment
WORKDIR /tmp

RUN apt-get update
RUN apt-get install curl unzip -y

# get bun
ARG BUN_URL
RUN curl -LO ${BUN_URL} && \
  unzip bun-linux-x64.zip

### IMAGE ###
FROM ubuntu:latest

# prepare bun
COPY --from=get /tmp/bun-linux-x64/bun /usr/local/bin/bun