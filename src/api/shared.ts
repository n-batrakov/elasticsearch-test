import fastify from 'fastify';

export type RegisterHandler = (server: fastify.FastifyInstance, container: AppContainer) => void;

export type AppContainer = {};