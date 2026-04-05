FROM node:20-alpine

# Instala ferramentas essenciais
RUN apk add --no-cache git curl bash postgresql-client

# Instala PNPM globalmente
RUN npm install -g pnpm@9

# Instala ferramentas de desenvolvimento globais
RUN npm install -g @nestjs/cli tsx

# Cria diretório de trabalho
WORKDIR /workspace

# Configura usuário não-root para segurança
RUN addgroup -g 1001 -S devgroup && \
    adduser -S devuser -u 1001 -G devgroup

USER devuser

EXPOSE 3000 3001 3333
