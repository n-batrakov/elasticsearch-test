export type ElasticConfig = {
    host: string,
    index: string,
    type: string,
    textField: string,
};

export type ElasticQueryHit<T> = {
    _index: string,
    _type: string,
    _id: string,
    _score: number,
    _source: T,
    highlight?: {
        [field: string]: string[],
    },
};

export type ElasticQueryHitCollection<T> = {
    total: number,
    max_score: number,
    hits: Array<ElasticQueryHit<T>>,
};

export type ElasticError = {
    type: string,
    reason: string,
};

export type ElasticErrorResponse = {
    status: string,
    error: ElasticError & { root_cause: ElasticError[] },
};

export type ElasticQueryResponse<T> = {
    took: number,
    timed_out: boolean,
    hits: ElasticQueryHitCollection<T>,
};

export type ElasticAckResponse = {
    acknowledged: boolean,
    shards_acknowledged: boolean,
};