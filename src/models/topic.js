import knex from "../../db/db.js";

const tableName = 'topics';

const model = {
    async add(data) {
        await knex(tableName)
            .insert({
                name: data.name
            })
            .returning("*");
    },

    async getActive() {
        const data = await knex(tableName)
            .select(['id', 'name'])
            .where('deleted', false);
    
        return data;
    },

    async getToScrap() {
        const [topic] = await knex(tableName)
            .where('deleted', false)
            .orderBy('last_update', 'asc')
            .limit(1);

        return topic;
    },

    async updateUpdateDate(id, date) {
        await knex(tableName)
            .update('last_update', date)
            .where({ id })
    },

    async delete(id) {
        await knex(tableName)
            .update('deleted', true)
            .where({ id })
    }
};

export default model;