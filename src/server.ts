import Fastify from 'fastify'

import axios from 'axios'

import { IGithubUser, IOAuthAccessTokenResponse } from './types'


const fastify = Fastify({
  logger: true,
})

const clientId = process.env.GITHUB_CLIENT_ID
const secretId = process.env.GITHUB_CLIENT_SECRET
const scope = encodeURIComponent("repo,user:email");
const state = encodeURIComponent("random_state_string");

/**
 * Route: http://localhost:3333/api/v1/login/github?redirectUri=http://localhost:3333/api/v1/login/github/callback
 *
 */
fastify.get('/api/v1/login/github', async (request, reply) => {
  const { redirectUri } = request.query as { redirectUri: string }

  reply.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`);
})

/**
 * Route: http://localhost:3333/api/v1/login/github/callback?code=CODE&state=STATE
 *
 */
fastify.get('/api/v1/login/github/callback', async (request, reply) => {
  const { code, state } = request.query as { code: string, state?: string }

  const response = axios.post('https://github.com/login/oauth/access_token', {
    client_id: clientId,
    client_secret: secretId,
    code,
    state,
  }, {
    headers: {
      Accept: 'application/json',
    },
  }).then(response => response.data)

  const { access_token } = await response as unknown as IOAuthAccessTokenResponse

  reply.redirect(`/api/v1/users?access_token=${access_token}`)
})

/**
 * Route: http://localhost:3333/api/v1/users?access_token=TOKEN
 *
 */
fastify.get('/api/v1/users', async (request, reply) => {
  const { access_token } = request.query as { access_token: string }

  const response = await axios.get("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  }).then(response => response.data) as unknown as { response: IGithubUser }

  reply.send({ response })
})

fastify.listen({
  port: 3333,
  host: "0.0.0.0"
}).then(() => {
  console.log("Server is running");
})