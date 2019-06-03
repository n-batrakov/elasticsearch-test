import fetch from 'node-fetch';
import { ElasticQueryResponse, ElasticErrorResponse, ElasticConfig } from './types';

export const search = async (query: string, config: ElasticConfig) => {
    const uri = `${config.host}/${config.index}/${config.type}/_search`;
    const body = {
        query: {
            multi_match: {
                query,
                fields: [config.textField],
                fuzziness: 2,
            },
        },
        highlight: {
            fields: { [config.textField]: {} },
        },
    };

    const response = await fetch(uri, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    });

    const responseBody: ElasticQueryResponse | ElasticErrorResponse = await response.json();

    if (response.status === 200) {
        const queryResponse = responseBody as ElasticQueryResponse;
        const { total, hits } = queryResponse.hits;
        if (total === 0) {
            return [];
        } else {
            return hits.map((hit: any) => {
                const id = hit._id;
                const data = hit._source;
                const score = hit._score;

                return { id, score, data };
            });
        }
    } else {
        const error = responseBody as ElasticErrorResponse;
        console.error(responseBody);
        throw new Error(`Unable to handle request: ${error.error.reason}`);
    }
};