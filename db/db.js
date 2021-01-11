import conf from './knexfile.cjs';
import knex from 'knex';

const db = knex(conf);
export default db;