FROM node:16

ENV PORT 8080

WORKDIR /usr/src/app

#RUN npx prisma generate
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY ./prisma prisma

RUN yarn install --only=production
ENV NODE_ENV production

# run this for production
# npm ci --only=production

COPY . .

EXPOSE 8080

CMD [ "yarn", "start" ]