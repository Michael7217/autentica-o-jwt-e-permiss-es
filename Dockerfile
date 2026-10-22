FROM node:22-bookworm-slim
# diretorio de trabalho na imagem
WORKDIR /app 
# copia os arquivos package para o workdir
COPY package*.json ./
# roda esses comandos
RUN npm install --global npm@11.19.1
# instala todas as dependencias do projeto
RUN npm ci
# copia tudo do projeto para o workdir (menos o que esta no .dockerignore)
COPY . .
# comando para gerar o client de acordo com o db
RUN npx prisma generate
# faz o build do projeto
RUN npm run build
# expõe a porta
EXPOSE 3000
# comando para iniciar a api
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]