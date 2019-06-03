export type ElasticConfig = {
    host: string,
    index: string,
    type: string,
    textField: string,
};

export type ElasticQueryHit = {
    _index: string,
    _type: string,
    _id: string,
    _score: number,
    _source: any,
};

export type ElasticQueryHitCollection = {
    total: number,
    max_score: number,
    hits: Array<ElasticQueryHit>,
};

export type ElasticError = {
    type: string,
    reason: string,
};

export type ElasticErrorResponse = {
    status: string,
    error: ElasticError & { root_cause: ElasticError[] },
};

export type ElasticQueryResponse = {
    took: number,
    timed_out: boolean,
    hits: ElasticQueryHitCollection,
};

export type ElasticAckResponse = {
    acknowledged: boolean,
    shards_acknowledged: boolean,
};