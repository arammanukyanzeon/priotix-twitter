import knex from "../../db/db.js";

const tableName = 'twitter_client';

const model = {

    async add(data) {
        await knex(tableName)
            .insert({
                api_key: data.consumer_key,
                api_key_secret: data.consumer_secret,
                acces_token: data.access_token_key,
                acces_token_secret: data.access_token_secret
            })
            .returning("*");
    },
    
    async getAll() {
        return await knex(tableName);
    },
    
    async updateRequestCount(id, count) {
        await knex(tableName)
            .increment('requests_count', count)
            .where({ id })
    }
};

export default model;

