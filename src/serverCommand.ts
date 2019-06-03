import fastify from 'fastify';
import staticFiles from 'fastify-static';
import api from './api';
import { AppContainer } from './api/shared';
import path from 'path';
import fs from 'fs';

const logger = process.env.NODE_ENV !== 'production'
    ? {
        base: null,
        timestamp: false,
        prettyPrint: process.env.NODE_ENV !== 'production',
    }
    : {
        level: 'info',
    };

export const startServerCommandHandler = async (cmd: { host: string, port: string }) => {
    const server = fastify({ logger });

    const container: AppContainer = {};

    const host = cmd.host;
    const parsedPort = parseInt(cmd.port, 10);
    const port = isNaN(parsedPort) ? 8080 : parsedPort;

    api.forEach(addRoute => addRoute(server, container));

    const staticPath = path.resolve('./src/public');
    if (fs.existsSync(staticPath)) {
        server.register(staticFiles, { root: staticPath });
    } else {
        console.warn(`${staticPath} does not exists. Static files are disabled.`);
    }

    await server.listen(port, host);

    console.log('Server is up and running...');
};