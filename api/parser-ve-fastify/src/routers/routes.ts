import { getOptionsArchive } from '../schemas/schema.js'

export function itemRoutes(fastify, options, done) {

    fastify.post('/api/parser-fastify/archives', getOptionsArchive)

    done()

}