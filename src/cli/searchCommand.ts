import { search } from '../es/search';
import config from '../settings';

export const searchCommandHandler = async (query: string) => {
    const results = await search(query, config);

    if (results.length === 0) {
        console.log('Nothing found');
        return;
    }

    results.forEach(x => console.log(`{ id: ${x.id}, score: ${x.score} }: ${x.data.body}`));
};