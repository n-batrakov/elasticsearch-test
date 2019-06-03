import config from '../settings';
import { createIndex } from '../es/createIndex';
import { createMapping } from '../es/createMapping';

export const createIndexCommandHandler = async () => {
    await createIndex(config);
    await createMapping(config);

    console.log(`Index '${config.index}' was created!`);
};