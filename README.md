# PoC - Fluxo GitHub OAuth com Fastify

## Requisitos

- [NodeJS](https://nodejs.org/en/)
- [Github OAuth Credentials](https://github.com/settings/developers)
- [Docker and Docker compose (opcional)](https://docs.docker.com/get-docker/)


## Instalação
> É recomendado usar o NodeJS na versão LTS (20.17.0)

```bash
git clone https://github.com/meiazero/poc-fluxo-github-oauth.git
cd poc-fluxo-github-oauth/fastify
npm install
```

## Configuração

### .env

```bash
cp .env.example .env
```

### Banco de Dados (MongoDB)
> [!TIP]
> Utilize o Compass para gerenciar o banco de dados.

```bash
docker compose -f ./docker/docker-compose.yaml up
```

ou use o comando `-d` para rodar o container em background.

```bash
docker compose -f ./docker/docker-compose.yaml up -d
```

> [!IMPORTANT]
> Se ao criar o container do MongoDB, você perceber que o banco com o nome `poc-github-oauth-flow` não foi criado, crie o banco manualmente.

#### Coleções (Database)

- users
- accounts
- queues

## Rodando

```bash
npm run dev
```