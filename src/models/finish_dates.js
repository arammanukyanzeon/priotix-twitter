import knex from "../../db/db.js";
import moment from "moment";

const tableName = 'topic_finish_dates';

const model = {

    async get(topicID) {
        const dates = await knex(tableName)
            .select('finish_date')
            .where('topic_id', topicID);
        return dates.map(date => moment(date.finish_date).format('YYYY-MM-DD'));
    },

    async add(data) {
        await knex(tableName)
            .insert({
                topic_id: data.topic_id,
                finish_date: data.finish_date,
            })
            .returning("*");
    },
};

export default model;

