import fetch from 'node-fetch';
import { ElasticConfig } from './types';

type BulkOperationPayload = {
    type: 'index',
    id: string,
    document: any,
};
const formatBulkOperation = (payload: BulkOperationPayload) => {
    switch (payload.type) {
        case 'index':
            const header = JSON.stringify({ index: { _id: payload.id } });
            const document = JSON.stringify(payload.document);
            return `${header}\n${document}`;
        default:
            throw new Error(`Unknown type - ${payload.type}`);
    }
};
const formatBulkPayload = (operations: BulkOperationPayload[]) => {
    return operations.map(formatBulkOperation).join('\n');
};


export type Document = {
    name: string,
    text: string,
};
export const bulkIndex = async (docs: Document[], config: ElasticConfig) => {
    const url = `${config.host}/${config.index}/${config.type}/_bulk`;

    const operations = docs.map<BulkOperationPayload>(x => ({
        type: 'index',
        id: x.name,
        document: {
            [config.textField]: x.text,
        },
    }));
    const payload = formatBulkPayload(operations);

    const response = await fetch(url, {
        method: 'POST',
        body: payload,
        headers: { 'Content-Type': 'application/x-ndjson' },
    });

    const { errors, items } = await response.json();

    if (errors === true) {
        console.error(JSON.stringify(items, null, 2));
        throw new Error('Unable to bulk index docuements.');
    }
};