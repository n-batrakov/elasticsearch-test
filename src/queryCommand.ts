import { search } from './search';

export const queryCommandHandler = async (query: string) => {
    const results = await search(query);

    results.forEach(x => console.log(`{ id: ${x.id}, score: ${x.score} }: ${x.data.body}`));
};