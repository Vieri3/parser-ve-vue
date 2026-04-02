import { getControllerArchives, getControllerViews, getControllerView, getLazyControllerArchives } from '../controllers/controllers.js'
import { getSchemaArchives } from '../shemas/schemas.js';

export function useRoutes(fastify, options, done) {

    fastify.get('/archives', getSchemaArchives, getControllerArchives);
    fastify.get('/archives-lazy', getSchemaArchives, getLazyControllerArchives);

    fastify.post('/views', getControllerViews);

    fastify.post('/view', getControllerView);
    
    done();

};