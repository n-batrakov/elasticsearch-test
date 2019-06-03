import { RegisterHandler } from './shared';
import { search } from '../search';

const searchHandler: RegisterHandler = (server, container) => server.route({
    method: 'GET',
    url: '/search',
    schema: {
        querystring: {
            type: 'object',
            properties: {
                q: {
                    type: 'string',
                },
            },
            required: ['q'],
        },
    },
    handler: async (req, res) => {
        const query = req.query['q'];

        const results = await search(query);

        return results;
    },
});

export default <RegisterHandler[]>[
    searchHandler,
];