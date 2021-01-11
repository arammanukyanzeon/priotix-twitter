import knex from "../../db/db.js";

const tableName = 'twitter_client';

const model = {

    async add(data) {
        await knex(tableName)
            .insert({
                api_key: data.consumer_key,
                api_key_secret: data.consumer_secret,
                access_token_key: data.access_token_key,
                acces_token_secret: data.access_token_secret,
                expire_date: data.expire_date,
                limit: data.limit,
            })
            .returning("*");
    },
    
    async getAll() {
        return await knex(tableName);
    },

    async getAvailable() {
        return await knex(tableName)
            .where((qb) => {
                qb.whereNull('blocked_until_date')
                qb.orWhere('blocked_until_date', '<=', knex.raw('now()'))
            })
            .where('expire_date', '>=', knex.raw('now()'));
    },

    async updateRequestCount(id, count) {
        await knex(tableName)
            .increment('requests_count', count)
            .where({ id })
    },

    async blockUserUntil(id, date) {
        await knex(tableName)
            .update('blocked_until_date', date)
            .where({ id })
    }
};

export default model;

