# Usa a imagem base do Node.js 17
FROM node:17

# Instala pacotes necessários e o Oracle Instant Client
RUN apt-get update && apt-get install -y \
    libaio1 \
    libnsl-dev \
    curl \
    unzip \
    && curl -o /tmp/instantclient-basiclite.zip https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip -SL \
    && cd /tmp && unzip instantclient-basiclite.zip \
    && mv instantclient*/ /usr/lib/instantclient \
    && rm /tmp/instantclient-basiclite.zip \
    && ln -s /usr/lib/instantclient/libclntsh.so.19.1 /usr/lib/libclntsh.so \
    && ln -s /usr/lib/instantclient/libocci.so.19.1 /usr/lib/libocci.so \
    && ln -s /usr/lib/instantclient/libociicus.so /usr/lib/libociicus.so \
    && ln -s /usr/lib/instantclient/libnnz19.so /usr/lib/libnnz19.so \
    && ln -s /usr/lib/libnsl.so.2 /usr/lib/libnsl.so.1 \
    && ln -s /lib/x86_64-linux-gnu/libc.so.6 /usr/lib/libresolv.so.2 \
    && ln -s /lib64/ld-linux-x86-64.so.2 /usr/lib/ld-linux-x86-64.so.2 \
    && apt-get clean

# Define variáveis de ambiente para o Oracle Instant Client
ENV ORACLE_BASE /usr/lib/instantclient
ENV LD_LIBRARY_PATH /usr/lib/instantclient
ENV TNS_ADMIN /usr/lib/instantclient
ENV ORACLE_HOME /usr/lib/instantclient

# Define o diretório de trabalho
WORKDIR /app

# Copia arquivos do projeto
COPY package*.json ./
RUN npm install
COPY . .

# Comando para rodar a aplicação com dumb-init
CMD ["node", "src/app.js"]
