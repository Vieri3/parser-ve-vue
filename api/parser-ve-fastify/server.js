import Fastify from 'fastify'
import cors from '@fastify/cors'
import { useRoutes } from './routes/routes.js'

const fastify = Fastify({
    logger: true
});

const start = async () => {
    try {
        await fastify.register(cors)
        await fastify.register(useRoutes, { prefix: '/api/parser-fastify' })
        const port = Number(process.env.PORT) || 3000;
        await fastify.listen({ port })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()