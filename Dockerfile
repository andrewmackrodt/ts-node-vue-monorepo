################################################################################
# Stage 1 : Prepare the target image with pm2
################################################################################

FROM andrewmackrodt/nodejs:12 AS target

RUN yarn global add pm2

################################################################################
# Stage 2 : Install node_modules
################################################################################

FROM andrewmackrodt/nodejs:12 AS cache

COPY --chown=ubuntu:ubuntu packages/common/package.json app/packages/common/
COPY --chown=ubuntu:ubuntu packages/backend/package.json app/packages/backend/
COPY --chown=ubuntu:ubuntu packages/frontend/package.json app/packages/frontend/
COPY --chown=ubuntu:ubuntu lerna.json app/
COPY --chown=ubuntu:ubuntu package.json app/
COPY --chown=ubuntu:ubuntu yarn.lock app/

WORKDIR app

RUN yarn install

################################################################################
# Stage 3 : Create dist bundle
################################################################################

FROM cache AS dist

COPY --chown=ubuntu:ubuntu ./ ./

RUN yarn build

################################################################################
# Stage 4 : Copy the dist bundle
################################################################################

FROM target

COPY --from=dist --chown=ubuntu:ubuntu /home/ubuntu/app/build/dist/ app/

WORKDIR app

COPY --chown=ubuntu:ubuntu pm2.json pm2.json

# default NODE_ENV to production
ENV NODE_ENV "production"

# use pm2 to run the application
ENV ENTRYPOINT0="pm2-runtime start /home/ubuntu/app/pm2.json"
