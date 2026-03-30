import { parsePageArchives } from '../utils/utils.js'

export async function getControllerArchives(req, reply) {
    const result = await parsePageArchives();
    reply.send(result)
}