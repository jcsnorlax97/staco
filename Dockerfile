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

# STEP 3
# docker build -t <hub_username>/dockerstaco . OR
# docker build -t dockerstaco .

# STEP 4
# docker run -it -p 8080:80 --rm --name dockerstaco <hub_username>/dockerstaco

# STEP 5
# Go to "localhost:8080" to enjoy!

# Others
# docker logout
# docker login
# docker tag dockerstaco <hub_username>/dockerstaco
# docker push <hub_username>/dockerstaco



