import fetch from 'node-fetch';
import { ElasticErrorResponse, ElasticAckResponse, ElasticConfig } from './types';

const mappingConfig = {
    properties: {
        body: {
            type: 'text',
            index: true,
            search_analyzer: 'ru_analyzer',
            analyzer: 'ru_analyzer',
            term_vector: 'with_positions_offsets_payloads',
        },
    },
};

export const createMapping = async (config: ElasticConfig) => {
    const uri = `${config.host}/${config.index}/_mapping/${config.type}`;

    const response = await fetch(uri, {
        method: 'PUT',
        body: JSON.stringify(mappingConfig),
        headers: { 'Content-Type': 'application/json' },
    });

    const responseBody: ElasticAckResponse | ElasticErrorResponse = await response.json();

    if (response.status === 200) {
        return;
    } else {
        const err = responseBody as ElasticErrorResponse;
        throw new Error(err.error.reason);
    }
};