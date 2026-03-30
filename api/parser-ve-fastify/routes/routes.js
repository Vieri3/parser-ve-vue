import { getControllerArchives, getControllerViews, getControllerView } from '../controllers/controllers.js'

export function useRoutes(fastify, options, done) {

    fastify.post('/archives', getControllerArchives);

    fastify.post('/views', getControllerViews);

    fastify.post('/view', getControllerView);
    
    done();

};