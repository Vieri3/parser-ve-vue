import Fastify from 'fastify'
import cors from '@fastify/cors'
import { useRoutes } from './routes/routes.js'

const port = process.env.PORT || 3000;

const fastify = Fastify({
    logger: true
});

const start = async () => {
    try {
        await fastify.register(cors)
        await fastify.register(useRoutes)
        await fastify.listen({ port })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()