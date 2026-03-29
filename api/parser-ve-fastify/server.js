import Fastify from 'fastify'
import cors from '@fastify/cors'
import axios from 'axios'
import * as cheerio from 'cheerio'
import { PDFParse } from 'pdf-parse'

const port = process.env.PORT || 3000;

const fastify = Fastify({
    logger: true
});

// await fastify.register(cors, {
//   // put your options here
// });


fastify.get('/', async (request, reply) => {
    reply.type('application/json').code(200)
    return { hello: 'world' }
})

fastify.listen({port}, (err, address) => {
    if (err) throw err
    // console.info(`Server is now listening on ${address}`)
})