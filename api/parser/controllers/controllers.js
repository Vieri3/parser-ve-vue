import { parsePageJournales, parsePageArticles, parsePageArticle } from '../handlers/handlers.js'
import { Readable } from 'stream'

export async function getControllerJournales(req, reply) {
    const result = await parsePageJournales();
    reply.send(result)
};

export async function getControllerArticles(req, reply) {
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
    // Запускаем парсинг асинхронно
    parsePageArticles(req.body, stream)

    return reply.send(stream)
};

export async function getControllerArticle(req, reply) {
    const result = await parsePageArticle(req.body);
    reply.send(result)
};