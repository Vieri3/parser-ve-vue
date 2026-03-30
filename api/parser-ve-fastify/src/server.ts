import Fastify from 'fastify'
import { itemRoutes } from './routers/routes.js'

// import cors from '@fastify/cors'

const port = process.env.PORT || 3000;

const fastify = Fastify({
    logger: true
});

// await fastify.register(cors, {
//   // put your options here
// });

fastify.register(itemRoutes)



fastify.listen({port}, (err, address) => {
    if (err) throw err
})