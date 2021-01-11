import Twitter from 'twitter';
import _ from 'lodash';
import moment from 'moment';

import {
    Topic,
    Tweet,
    TwitterClient,
    FinishDates,
} from '../models/index.js';
import {
    parseTweet,
    getAvailableDates,
    getClientForScraping,
} from '../utils.js';

const scraper = {
    async start() {
        const [clients, topic] = await Promise.all([TwitterClient.getAvailable(), Topic.getToScrap()]);

        if (!topic) {
            console.log("No topics");
            return;
        }

        const client = getClientForScraping(clients);
        if(!client) {
            console.log("No available client");
            return;
        }
    
        // Geting tweets for old dates
        const success = await this.getForOldDates(client, topic);
    
        // Geting fresh tweets
        if (success) await this.getFreshTweets(client, topic);
    },

    async getForOldDates(client, topic) {
        const finishDates = await FinishDates.get(topic.id);
        const availableDates = getAvailableDates();
        const dates = _.difference(availableDates, finishDates);

        for (let date of dates) {
            const tweet = await Tweet.getFirstByTopic(topic.id, date);
            const maxID = tweet ? tweet.twitter_id : null;
            const [tweets, blocked] = await this.getTweetsForTopic(client, topic.name, null, maxID, date);
            if (tweets.length === 0) {
                FinishDates.add({finish_date: date, topic_id: topic.id});
            } else {
                tweets.forEach(t => Tweet.add(parseTweet(t), topic.id));
                Topic.updateUpdateDate(topic.id, moment().utc().format());
            }
            if (blocked) return false; 
        }

        return true;
    },

    async getFreshTweets(client, topic) {
        const tweet = await Tweet.getLastByTopic(topic.id);
        const sinceID = tweet ? tweet.twitter_id : null;
        const [tweets, bloa] = await this.getTweetsForTopic(client, topic.name, sinceID, null, null);

        tweets.forEach(t => Tweet.add(parseTweet(t), topic.id));
        Topic.updateUpdateDate(topic.id, moment().utc().format());
    },

    getTweetsForTopic(client, topicName, sinceID, maxID, until) {
        return new Promise ((resolve) => {
            const twitterClient = new Twitter({
                id: client.id,
                consumer_key: client.api_key,
                consumer_secret: client.api_key_secret,
                access_token_key: client.acces_token,
                access_token_secret: client.acces_token_secret
            });

            twitterClient.get('search/tweets', {
                lang: 'en',
                since_id: sinceID,
                max_id: maxID,
                until: until,
                result_type: 'recent',
                q: topicName,
                count: 100
            }, (err, twitterData, response) => {
                const blocked = false;
                if (err) console.log(err);
                if (response.headers && response.headers["x-rate-limit-remaining"] === '0') {
                    const utcDate = response.headers["x-rate-limit-reset"];
                    const localDate = moment(utcDate * 1000).format();
                    TwitterClient.blockUserUntil(client.id, localDate);
                    blocked = true;
                }
                if (twitterData) {
                    TwitterClient.updateRequestCount(client.id, 1);
                    resolve([twitterData.statuses, blocked]);
                }
            });
        });
    }
};

export default scraper;
