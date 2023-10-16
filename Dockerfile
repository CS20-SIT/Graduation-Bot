FROM node:18-alpine As backend-build
ENV ci=true
RUN npm i -g pnpm

WORKDIR /usr/src/app
COPY --chown=node:node ./backend/pnpm-lock.yaml ./
RUN pnpm fetch --prod

COPY --chown=node:node ./backend ./
RUN pnpm install

RUN pnpm prisma-generate
RUN pnpm build

ENV NODE_ENV production
RUN pnpm prune --prod
USER node

FROM node:18-alpine As frontend-build 
ENV ci=true
RUN npm i -g pnpm
WORKDIR /usr/src/app
COPY --chown=node:node ./frontend/pnpm-lock.yaml ./
RUN pnpm fetch --prod

COPY --chown=node:node ./frontend ./
RUN pnpm install
RUN pnpm build 

###################
# PRODUCTION
###################

FROM node:18-alpine As production
WORKDIR /app
ENV NODE_ENV production

COPY --chown=node:node --from=backend-build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=backend-build /usr/src/app/dist ./dist
COPY --chown=node:node --from=frontend-build /usr/src/app/dist ./client 


CMD [ "node", "/app/dist/main.js" ]
