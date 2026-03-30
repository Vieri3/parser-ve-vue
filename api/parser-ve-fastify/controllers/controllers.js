import { parsePageArchives } from '../handlers/handlers.js'

export async function getControllerArchives(req, reply) {
    const result = await parsePageArchives();
    reply.send(result)
}