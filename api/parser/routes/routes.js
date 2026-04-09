import { getControllerJournalesAndArticlesUrls, getControllerArticleRdf, getControllerJournaleXml } from '../controllers/controllers.js'
// import { getSchemaJournales } from '../schemas/schemas.js';
import { RES_GET_JOURNALES_AND_ARTICLES_URLS, RES_POST_ARTICLE_RDF, RES_POST_JOURNALE_XML } from '../constants/constants.js'

export function useRoutes(fastify, options, done) {

    fastify.get(RES_GET_JOURNALES_AND_ARTICLES_URLS, getControllerJournalesAndArticlesUrls);

    fastify.post(RES_POST_ARTICLE_RDF, getControllerArticleRdf);

    fastify.post(RES_POST_JOURNALE_XML, getControllerJournaleXml);

    done();

};