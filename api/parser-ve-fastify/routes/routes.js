import { getControllerArchives, getControllerViews, getControllerView } from '../controllers/controllers.js'

export function useRoutes(fastify, options, done) {

    fastify.post('/api/parser-fastify/archives', getControllerArchives);

    fastify.post('/api/parser-fastify/views', getControllerViews);

    fastify.post('/api/parser-fastify/view', getControllerView);
    
    done()

}