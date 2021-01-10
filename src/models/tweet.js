import knex from "../../db/db.js";
import moment from "moment";

const tableName = 'tweets';

const model = {
    async add(data, topicID) {
        await knex(tableName)
            .insert({
                created_at: data.created_at,
                twitter_id: data.twitter_id,
                lang: data.lang,
                text: data.text,
                topic_id: topicID
            })
            .returning("*");
    },

    async getByTopics(ids) {
        return await knex(tableName)
            .whereIn('topic_id', ids)
    },

    async getFirstByTopic(topicID, date) {
        const from = moment(date).startOf("day").format();
        const to = moment(date).endOf("day").format();

        const [tweet] = await knex(tableName)
            .select('twitter_id')
            .where('topic_id', topicID)
            .orderBy('twitter_id', 'asc')
            .whereBetween('created_at', [from, to])
            .limit(1);
        return tweet;
    },

    async getLastByTopic(topicID) {

        const [tweet] = await knex(tableName)
            .select('twitter_id')
            .where('topic_id', topicID)
            .orderBy('twitter_id', 'desc')
            .limit(1);
        return tweet;
    }
};

export default model;

