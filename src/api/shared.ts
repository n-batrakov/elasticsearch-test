import fastify from 'fastify';
import { ElasticConfig } from '../es/types';

export type RegisterHandler = (server: fastify.FastifyInstance, container: AppContainer) => void;

export type AppContainer = {
    config: ElasticConfig,
};