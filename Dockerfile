FROM    node:12-buster-slim
WORKDIR /app
COPY    . .
CMD     [ "npm", "run", "nodemon" ]
