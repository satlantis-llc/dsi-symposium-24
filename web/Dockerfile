FROM node:20 as build

WORKDIR /app

COPY web/package.json web/package-lock.json ./

RUN npm install

COPY web/ .

RUN npm run build

# use nginx to serve the build directory
FROM nginx:alpine

# copy the build output to replace the default nginx contents
COPY --from=build /app/dist /usr/share/nginx/html

# copy custom nginx config to resolve server DNS
COPY web/nginx.conf /etc/nginx/nginx.conf

# expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
