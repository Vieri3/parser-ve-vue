import { getJournalesAndArticlesUrls, getArticleRdf, getJournaleXml } from '../handlers/handlers.js'
import { Readable } from 'stream'


export async function getControllerJournalesAndArticlesUrls(_, reply) {
    // Каждая строка - JSON
    reply.header('Content-Type', 'application/x-ndjson');
    // Валидируется каждый раз
    reply.header('Cache-Control', 'no-cache');
    // не закрываем поток сразу
    reply.header('Connection', 'keep-alive');
    // Создаем читаемый поток
        const stream = new Readable({
        objectMode: true,
        read() { }
    });

    await getJournalesAndArticlesUrls(stream); 

    return reply.send(stream)
}

export async function getControllerArticleRdf(req, reply) {
    const result = await getArticleRdf(req.body);
    reply.send(result)
};

export async function getControllerJournaleXml(req, reply) {
    const result = await getJournaleXml(req.body);
    reply.send(result)
};
