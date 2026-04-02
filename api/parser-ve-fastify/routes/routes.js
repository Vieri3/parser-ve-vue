import { getControllerArchives, getControllerViews, getControllerView } from '../controllers/controllers.js'
import { getSchemaArchives } from '../shemas/schemas.js';

export function useRoutes(fastify, options, done) {

    fastify.get('/archives', getSchemaArchives, getControllerArchives);

    fastify.post('/views', getControllerViews);

    fastify.post('/view', getControllerView);
    
    done();

};