FROM node:10.16.3-alpine

WORKDIR /usr/src/app

# Dependencies
COPY ./package.json .
COPY ./yarn.lock .
COPY ./packages/client/package.json ./packages/client/
COPY ./packages/common/package.json ./packages/common/
COPY ./packages/server/package.json ./packages/server/

# --no-cache: download package index on-the-fly, no need to cleanup afterwards
# --virtual: bundle packages, remove whole bundle at once, when done
RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && yarn install \
    && apk del build-dependencies

# Files
COPY . .

# Build
RUN yarn build

# Port
EXPOSE 3001

# Serve
CMD [ "yarn", "serve" ]
