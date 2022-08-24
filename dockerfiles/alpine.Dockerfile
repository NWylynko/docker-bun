# Found here https://github.com/oven-sh/bun/issues/211#issuecomment-1180644348

### GLOBALS ###
ARG GLIBC_VERSION='2.34-r0'


### GET ###
FROM alpine:latest as get

# prepare environment
WORKDIR /tmp
RUN apk --update add curl unzip

# get bun
ARG BUN_URL
RUN curl -LO ${BUN_URL} && \
  unzip bun-linux-x64.zip

# get glibc
ARG GLIBC_VERSION
RUN curl -LO https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
  curl -LO https://github.com/sgerrand/alpine-pkg-glibc/releases/download/${GLIBC_VERSION}/glibc-${GLIBC_VERSION}.apk


### IMAGE ###
FROM alpine:latest

# prepare bun
COPY --from=get /tmp/bun-linux-x64/bun /usr/local/bin

# prepare glibc
ARG GLIBC_VERSION
COPY --from=get /tmp/sgerrand.rsa.pub /etc/apk/keys
COPY --from=get /tmp/glibc-${GLIBC_VERSION}.apk /tmp

# install and clean up
RUN apk --no-cache add /tmp/glibc-${GLIBC_VERSION}.apk && \
  rm /tmp/*