import knex from "../../../db/db.js"
import moment from "moment";

export async function addTwitterClient(data) {
    await knex("twitter_client")
        .insert({
            api_key: data.consumer_key,
            api_key_secret: data.consumer_secret,
            acces_token: data.access_token_key,
            acces_token_secret: data.access_token_secret
        })
        .returning("*");
}

export async function getAllTwiterClients() {
    return await knex("twitter_client");
}

export async function updateRequestCount(id, count) {
    await knex("twitter_client")
        .increment('requests_count', count)
        .where({ id })
}
export async function addTweets(data, topicID) {
    await knex("tweets")
        .insert({
            created_at: data.created_at,
            twitter_id: data.twitter_id,
            lang: data.lang,
            text: data.text,
            topic_id: topicID
        })
        .returning("*");
}

export async function getFirstTweetByTopic(topicID, date) {
    const from = moment(date).startOf("day").format();
    const to = moment(date).endOf("day").format();

    const [tweet] = await knex("tweets")
        .select('twitter_id')
        .where('topic_id', topicID)
        .orderBy('twitter_id', 'asc')
        .whereBetween('created_at', [from, to])
        .limit(1);
    return tweet;
}

export async function getLastTweetByTopic(topicID) {

    const [tweet] = await knex("tweets")
        .select('twitter_id')
        .where('topic_id', topicID)
        .orderBy('twitter_id', 'desc')
        .limit(1);
    return tweet;
}

export async function getFinishDates(topicID) {
    const dates = await knex("topic_finish_dates")
        .select('finish_date')
        .where('topic_id', topicID);
    return dates.map(date => moment(date.finish_date).format('YYYY-MM-DD'));
}

export async function addFinishDate(data) {
    await knex("topic_finish_dates")
        .insert({
            topic_id: data.topic_id,
            finish_date: data.finish_date,
        })
        .returning("*");
}
