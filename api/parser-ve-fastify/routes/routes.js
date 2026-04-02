import { getControllerArchives, getControllerArticles, getControllerArticle, getLazyControllerArchives } from '../controllers/controllers.js'
import { getSchemaArchives } from '../schemas/schemas.js';
import { RES_GET_ARCHIVES, RES_GET_ARCHIVES_LAZY, RES_POST_ARTICLE, RES_POST_ARTICLES } from '../constants/constants.js'

export function useRoutes(fastify, options, done) {

    fastify.get(RES_GET_ARCHIVES, getSchemaArchives, getControllerArchives);
    fastify.get(RES_GET_ARCHIVES_LAZY, getSchemaArchives, getLazyControllerArchives);

    fastify.post(RES_POST_ARTICLES, getControllerArticles);

    fastify.post(RES_POST_ARTICLE, getControllerArticle);
    
    done();

};