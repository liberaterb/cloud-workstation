FROM node:latest

RUN mkdir -p /home/www
WORKDIR /home/www

COPY . /home/www

RUN npm install

EXPOSE 80

ENTRYPOINT ["npm", "run"]
CMD ["start"]