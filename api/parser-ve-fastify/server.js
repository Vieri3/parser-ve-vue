import Fastify from 'fastify'
import { useRoutes } from './routes/routes.js'

// import cors from '@fastify/cors'

const port = process.env.PORT || 3000;

const fastify = Fastify({
    logger: true
});

// await fastify.register(cors, {
//   // put your options here
// });

fastify.register(useRoutes)


fastify.listen({port}, (err, address) => {
    if (err) throw err
})