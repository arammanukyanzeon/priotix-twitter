import knex from "../../db/db.js";
import moment from "moment";
import _ from 'lodash';

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

    async getByTopicAndLastId(id, lastID = 0) {
        const createdDates = await knex(tableName)
            .select(knex.raw('date(created_at) as created_at'))
            .where('topic_id', id)
            .where('id', '>', lastID)
            .groupByRaw("date(created_at)");

        const dates = _.groupBy(createdDates, (tweet) => moment(tweet.created_at).format("YYYY-MM-DD"));
        const days = Object.keys(dates);
        if (!days.length) return [];
        const { rows } = await knex.raw(`
            SELECT *
            FROM tweets 
            WHERE date(created_at) in ('${days.join("', '")}')
            ORDER BY id DESC
            LIMIT 1000
        `);
        return rows;
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

