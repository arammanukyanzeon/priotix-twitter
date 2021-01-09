import knex from "../../../db/db.js"

class TwitterClient {
    static tableName = "twitter_client";
    constructor(data) {
        this.id = data.id;
        this.consumer_key = data.consumer_key;
        this.consumer_secret = data.consumer_secret;
        this.access_token_key = data.access_token_key;
        this.access_token_secret = data.access_token_secret;
    }

    async addTwitterClient(data) {
        await knex("twitter_client")
            .insert({
                api_key: data.consumer_key,
                api_key_secret: data.consumer_secret,
                acces_token: data.access_token_key,
                acces_token_secret: data.access_token_secret
            })
            .returning("*");
    }

    async getAllTwiterClients() {
        return await knex("twitter_client");
    }

    async updateRequestCount(id, count) {
        await knex("twitter_client")
            .increment('requests_count', count)
            .where({ id })
    }
    async addTweets(data, topicID) {
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

    async getTweetsSinceID(topicID) {
        return await knex("tweets")
            .where('topic_id', topicID)
            .orderBy('twitter_id', 'desc')
            .returning('twitter_id')
            .limit(1);
    }
}
export const addTwitterClient = TwitterClient.prototype.addTwitterClient;
export const getAllTwiterClients = TwitterClient.prototype.getAllTwiterClients;
export const updateRequestCount = TwitterClient.prototype.updateRequestCount;
export const addTweets = TwitterClient.prototype.addTweets;
export const getTweetsSinceID = TwitterClient.prototype.getTweetsSinceID;