import { getJournalesAndArticlesUrls, getArticleRdf, getJournaleXml } from '../handlers/handlers.js'

export async function getControllerJournalesAndArticlesUrls(_, reply) {
    const result = await getJournalesAndArticlesUrls(); 
    reply.send(result)
}

export async function getControllerArticleRdf(req, reply) {
    const result = await getArticleRdf(req.body);
    reply.send(result)
};

export async function getControllerJournaleXml(req, reply) {
    const result = await getJournaleXml(req.body);
    reply.send(result)
};
