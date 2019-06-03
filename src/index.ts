import app from 'commander';
import { searchCommandHandler } from './cli/searchCommand';
import { indexDocumentsCommandHandler } from './cli/indexDocumentsCommand';
import { startServerCommandHandler } from './cli/serverCommand';
import { createIndexCommandHandler } from './cli/createIndexCommand';


const catchErrors = (callback: () => Promise<void>) => {
    const onError = (e: Error) => {
        console.error(e.stack);
    };

    try {
        callback().catch((e) => {
            onError(e);
            process.exit(1);
        });
    } catch (e) {
        onError(e);
        process.exit(1);
    }
};

app
.name('es')
.version('0.1.0');

app
.command('init')
.action(() => catchErrors(() => createIndexCommandHandler()));

app
.command('index <dir>')
.action((dir, cmd) => catchErrors(() => indexDocumentsCommandHandler(dir)));

app
.command('search <phrase>')
.action((phrase, cmd) => catchErrors(() => searchCommandHandler(phrase)));

app
.command('server')
.action(() => catchErrors(() => startServerCommandHandler({ host: '0.0.0.0', port: '8080' })));



app.parse(process.argv);
