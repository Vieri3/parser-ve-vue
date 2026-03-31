import { getControllerArchives, getControllerViews, getControllerView } from '../controllers/controllers.js'
import { getSchemaArchives, getSchemaViews } from '../shemas/schemas.js';

export function useRoutes(fastify, options, done) {

    fastify.post('/archives', getSchemaArchives, getControllerArchives);

    fastify.post('/views', getSchemaViews, getControllerViews);

    fastify.post('/view', getControllerView);
    
    done();

};