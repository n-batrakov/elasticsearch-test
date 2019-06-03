import fs from 'fs';
import pathUtil from 'path';
import settings from '../settings';
import { Document, bulkIndex } from '../es/bulkIndexDocuments';

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
    const batches = batch(availableFiles, 5);
    const documents = batches.map(batch => batch.map(getDocument));

    console.log('Indexing documents...');

    const promises = documents.map(x => bulkIndex(x, settings));
    await Promise.all(promises);

    console.log('All done!');
};