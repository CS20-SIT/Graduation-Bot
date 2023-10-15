###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build
ENV ci=true
RUN npm i -g pnpm

WORKDIR /usr/src/app

COPY --chown=node:node pnpm-lock.yaml ./

RUN pnpm fetch --prod

COPY --chown=node:node . .
RUN pnpm install

RUN pnpm prisma-generate
RUN pnpm build

ENV NODE_ENV production

RUN pnpm prune --prod

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production
WORKDIR /app
ENV NODE_ENV production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

CMD [ "node", "dist/main.js" ]
