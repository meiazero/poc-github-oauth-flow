import Fastify from 'fastify'
import fastifyMongoDb from '@fastify/mongodb'

import axios from 'axios'

import { IGithubUser, IOAuthAccessTokenResponse, IQueue } from './types.js'
import { newId } from './utils/new-id.js'

const fastify = Fastify({
  logger: true,
})

await fastify.register(fastifyMongoDb, {
  // force to close the mongodb connection when app stopped
  // the default value is false
  forceClose: true,
  url: process.env.MONGODB_URI,
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
  const { code: githubCode, state } = request.query as { code: string, state?: string }

  const response = axios.post('https://github.com/login/oauth/access_token', {
    client_id: clientId,
    client_secret: secretId,
    code: githubCode,
    state,
  }, {
    headers: {
      Accept: 'application/json',
    },
  }).then(response => response.data)

  const { access_token } = await response as unknown as IOAuthAccessTokenResponse

  try {
    const queueCode = newId("queue")
    await fastify.mongo.db?.collection('queues').insertOne({
      task_type: 'oauth',
      status: 'pending',
      content: access_token,
      code: queueCode,
    })

    reply.redirect(`/api/v1/users/oauth?code=${queueCode}`)

  } catch (error) {
    reply.send({ error })
  }
})

/**
 * Route: http://localhost:3333/api/v1/users/oauth?code=QUEUE_CODE
 *
 */
fastify.get('/api/v1/users/oauth', async (request, reply) => {
  const { code } = request.query as { code: string }

  const queue = await fastify.mongo.db?.collection('queues').findOne({ code }) as unknown as IQueue

  if (!queue) {
    reply.status(400).send({
      code,
      error: 'Invalid code'
    })
    return
  }

  try {

    const response = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${queue.content}`,
      },
    }).then(response => response.data) as unknown as IGithubUser


    const user = await fastify.mongo.db?.collection('users').insertOne({
      name: response.name,
      email: response.email,
      avatar: response.avatar_url,
      githubId: response.id.toString(),
    })

    await fastify.mongo.db?.collection('accounts').insertOne({
      gh_access_token: queue.content,
      account_type: 'oauth',
      user_id: user?.insertedId.toString(),
    })

    await fastify.mongo.db?.collection('queues').deleteOne({ code })

    reply.send({ user: user?.insertedId.toString() })
  } catch (error) {
    reply.send({ error })
  }
})

/**
 * Route: http://localhost:3333/api/v1/users/queue?code=CODE
 *
 */
fastify.get('/api/v1/users/queue', async (request, reply) => {
  const { code } = request.query as { code: string }

  // get all the queue
  const queue = await fastify.mongo.db?.collection('queues').find({ code }).toArray()

  reply.send({ queue })
})


fastify.listen({
  port: 3333,
  host: "0.0.0.0"
}).then(() => {
  console.log("Server is running");
})