import { ElasticConfig } from './es/types';

export default <ElasticConfig>{
    host: 'http://192.168.0.106:9200',
    index: 'test_index',
    type: 'doc',
    textField: 'body',
};