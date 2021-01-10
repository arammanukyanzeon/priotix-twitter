import conf from './knexfile.cjs';
import knex from 'knex';

const env = process.env.NODE_ENV || 'development';
const configOptions = conf[env];
const db = knex(configOptions);
export default db;