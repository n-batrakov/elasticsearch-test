import fs from 'fs';
import pathUtil from 'path';
import fetch from 'node-fetch';
import settings from './settings';

const indexConfig = {
    ...settings,
    batchSize: 5,
};

type Document = {
    name: string,
    text: string,
};

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

const putDocumentsBatch = async (texts: Document[]) => {
    const url = `${indexConfig.host}/${indexConfig.index}/${indexConfig.type}/_bulk`;

    const operations = texts.map<BulkOperationPayload>(x => ({
        type: 'index',
        id: x.name,
        document: {
            [indexConfig.textField]: x.text,
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
        console.error('Failed to index documents:', items);
        return;
    }
};

const getAvailableFilesPaths = (dir: string): string[] => {
    const paths = fs.readdirSync(dir, { encoding: 'utf-8' });

    return paths.map(filename => pathUtil.resolve(pathUtil.join(dir, filename)));
};

const getDocument = (path: string): Document => {
    const text = fs.readFileSync(path, 'utf-8');

    const { name } = pathUtil.parse(path);

    return { name, text };
};

function batch<T>(items: T[], n: number): T[][] {
    return items
        .filter((_, i) => i % n === 0)
        .map((_, i) => {
            const idx = i * n;
            return items.slice(idx, idx + n);
        });
}

export const indexDocumentsCommandHandler = async (dir: string) => {
    console.log('Reading files...');

    const availableFiles = getAvailableFilesPaths(dir);

    const batches = batch(availableFiles, indexConfig.batchSize);

    const documents = batches.map(batch => batch.map(getDocument));

    console.log('Indexing documents...');

    const promises = documents.map(putDocumentsBatch);

    await Promise.all(promises);

    console.log('All done!');
};