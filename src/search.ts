import settings from './settings';
import fetch from 'node-fetch';

const config = {
    ...settings,
    highlight: {
        fields: { [settings.textField]: {} },
    },
};

type ElasticQueryHit = {
    _index: string,
    _type: string,
    _id: string,
    _score: number,
    _source: any,
};

type ElasticQueryHitCollection = {
    total: number,
    max_score: number,
    hits: Array<ElasticQueryHit>,
};

type ElasticError = {
    type: string,
    reason: string,
};
type ElasticErrorResponse = {
    status: string,
    error: ElasticError & { root_cause: ElasticError[] },
};

type ElasticQueryResponse = {
    took: number,
    timed_out: boolean,
    hits: ElasticQueryHitCollection,
};


export const search = async (query: string) => {
    const uri = `${settings.host}/${settings.index}/${settings.type}/_search`;
    const body = {
        query: {
            multi_match: {
                query,
                fields: [settings.textField],
                fuzziness: 2,
            },
        },
        highlight: config.highlight,
    };

    console.log(JSON.stringify(body));

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