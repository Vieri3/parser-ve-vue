import { parsePageArchives, parsePageViews, parsePageView } from '../handlers/handlers.js'

export async function getControllerArchives(req, reply) {
    const result = await parsePageArchives();
    reply.send(result)
};

export async function getControllerViews(req, reply) {
    const result = await parsePageViews(req.body);
    reply.send(result)
};

export async function getControllerView(req, reply) {
    const result = await parsePageView(req.body);
    reply.send(result)
};