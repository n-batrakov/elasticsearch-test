import fetch from 'node-fetch';
import { ElasticErrorResponse, ElasticAckResponse } from './types';

const indexConfig = {
    settings: {
        analysis: {
            analyzer: {
                ru_analyzer: {
                    type: 'custom',
                    tokenizer: 'standard',
                    filter: ['lowercase', 'russian_morphology', 'english_morphology', 'ru_stopwords'],
                },
            },
            filter: {
                ru_stopwords: {
                    type: 'stop',
                    stopwords: 'а,без,более,бы,был,была,были,было,быть,в,вам,вас,весь,во,вот,все,всего,всех,вы,где,да,даже,для,до,его,ее,если,есть,еще,же,за,здесь,и,из,или,им,их,к,как,ко,когда,кто,ли,либо,мне,может,мы,на,надо,наш,не,него,нее,нет,ни,них,но,ну,о,об,однако,он,она,они,оно,от,очень,по,под,при,с,со,так,также,такой,там,те,тем,то,того,тоже,той,только,том,ты,у,уже,хотя,чего,чей,чем,что,чтобы,чье,чья,эта,эти,это,я,a,an,and,are,as,at,be,but,by,for,if,in,into,is,it,no,not,of,on,or,such,that,the,their,then,there,these,they,this,to,was,will,with'
                },
            },
        },
    },
};

export const createIndex = async (config: { host: string, index: string}) => {
    const uri = `${config.host}/${config.index}`;

    const response = await fetch(uri, {
        method: 'PUT',
        body: JSON.stringify(indexConfig),
        headers: { 'Content-Type': 'application/json' },
    });

    const responseBody: ElasticAckResponse | ElasticErrorResponse = await response.json();

    if (response.status === 200) {
        return;
    } else {
        const err = responseBody as ElasticErrorResponse;
        if (err.error.type === 'index_already_exists_exception') {
            return;
        } else {
            throw new Error(err.error.reason);
        }
    }
};