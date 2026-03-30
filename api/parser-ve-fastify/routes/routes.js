import { getControllerArchives } from '../controllers/controllers.js'

export function useRoutes(fastify, options, done) {

    fastify.post('/api/parser-fastify/archives', getControllerArchives)

    done()

}