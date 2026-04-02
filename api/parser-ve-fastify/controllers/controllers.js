import { parsePageArchives, parsePageViews, parsePageView, parseLazyPageArchives } from '../handlers/handlers.js'
import { Readable } from 'stream'

export async function getControllerArchives(req, reply) {
    const result = await parsePageArchives();
    reply.send(result)
};

export async function getLazyControllerArchives(req, reply) {
    // Устанавливаем заголовки для потоковой передачи
    reply.header('Content-Type', 'application/x-ndjson') // Каждая строка - JSON
    reply.header('Cache-Control', 'no-cache') // Валидируется каждый раз
    reply.header('Connection', 'keep-alive')  // не закрываем поток сразу

    // Создаем читаемый поток
    const stream = new Readable({
        objectMode: true,
        read() { }
    })

    // Запускаем парсинг асинхронно
    parseLazyPageArchives(stream)

    return reply.send(stream)

};

export async function getControllerViews(req, reply) {
    const result = await parsePageViews(req.body);
    reply.send(result)
};

export async function getControllerView(req, reply) {
    const result = await parsePageView(req.body);
    reply.send(result)
};