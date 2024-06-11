FROM node:18-alpine as installer
# Create app directory
WORKDIR /app
# Install app dependencies
COPY package*.json ./
COPY yarn.lock ./
RUN yarn

FROM node:18-alpine
WORKDIR /app
RUN apk update && \
    apk upgrade && \
    rm -rf /var/cache/apk/*

COPY --chown=node:node --from=installer /app/node_modules ./node_modules

#Copy project files
COPY package*.json ./
COPY yarn.lock ./

#Copy source directory
COPY --chown=node:node src ./src

#Copy documentation directory
COPY --chown=node:node doc ./doc

#Copy scripts directory
COPY --chown=node:node etc/script ./script

#Copy public directory
# COPY --chown=node:node public ./public

ARG AMBIENTE
ENV AMBIENTE $AMBIENTE

#Copy .env file
COPY --chown=node:node etc/config/${AMBIENTE}.env ./.env

RUN chmod -R 755 /app/script \
    && chown node:node /app
USER node

ENTRYPOINT ["/app/script/startup.sh"]