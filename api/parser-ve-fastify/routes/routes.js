import { getControllerArchives, getControllerArticles, getControllerArticle } from '../controllers/controllers.js'
import { getSchemaArchives } from '../schemas/schemas.js';
import { RES_GET_ARCHIVES, RES_POST_ARTICLE, RES_POST_ARTICLES } from '../constants/constants.js'

export function useRoutes(fastify, options, done) {

    fastify.get(RES_GET_ARCHIVES, getSchemaArchives, getControllerArchives);

    fastify.post(RES_POST_ARTICLES, getControllerArticles);

    fastify.post(RES_POST_ARTICLE, getControllerArticle);
    
    done();

};