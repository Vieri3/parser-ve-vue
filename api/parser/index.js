import Fastify from 'fastify'
import swagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import cors from '@fastify/cors'
import { useRoutes } from './routes/routes.js'
import { SUBDIRECTORY_SITE_API_NAME } from './constants/constants.js'

const fastify = Fastify({
    logger: true
});

const start = async () => {
    try {
        // Помогает генерировать и обслуживать страницу документации Swagger/OpenAPI для приложения Fastify.
        await fastify.register(swagger, {
            openapi: {
                openapi: '3.0.0',
            }
        })
        // Предоставляет встроенный интерфейс Swagger UI 
        await fastify.register(fastifySwaggerUi, {
            routePrefix: '/documentation',
            uiConfig: {
                docExpansion: 'full',
                deepLinking: false
            }
        })
        await fastify.register(cors)
        await fastify.register(useRoutes, { prefix: SUBDIRECTORY_SITE_API_NAME })
        // запускаем и считываем 
        await fastify.ready()
        fastify.swagger()

        const port = Number(process.env.PORT) || 3000;
        await fastify.listen({ port })

        console.log('************************************************************');
        console.log(`Server running on http://localhost:${port}`);
        console.log('************************************************************');
        console.log(`Swagger UI: http://localhost:${port}/documentation`);
        console.log('************************************************************');
        
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()