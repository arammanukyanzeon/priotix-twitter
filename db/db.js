import conf from './knexfile.js';
import knex from 'knex';

const env = process.env.NODE_ENV || 'development';
const configOptions = conf[env];
const db = knex(configOptions);
export default db;