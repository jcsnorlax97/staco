# https://www.youtube.com/watch?v=XiMBLwfMNss
# https://vuejs.org/v2/cookbook/dockerize-vuejs-app.html

# STEP 1 - BUILD VUE PROJECT
FROM node:lts-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# STEP 2 - CREATE NGINX SERVER
FROM nginx:stable-alpine AS prod-stage
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
