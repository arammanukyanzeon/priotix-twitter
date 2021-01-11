import Twitter from 'twitter';
import _ from 'lodash';
import moment from 'moment';

import {
    Topic,
    Tweet,
    TwitterClient,
    FinishDates,
} from '../models/index.js';

const getAvailableDates = () => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
        days.push(
            moment().subtract(i, 'days').format("YYYY-MM-DD")
        );
    }

    return days;
};

const getTweetsForTopic = (client, topicName, sinceID, maxID, until) => {
    return new Promise ((resolve) => {
        const twitterClint = new Twitter({
            id: client.id,
            consumer_key: client.api_key,
            consumer_secret: client.api_key_secret,
            access_token_key: client.acces_token,
            access_token_secret: client.acces_token_secret
        });
    
        twitterClint.get('search/tweets', {
            lang: 'en',
            since_id: sinceID,
            max_id: maxID,
            until: until,
            result_type: 'recent',
            q: topicName,
            count: 100
        }, (err, twitterData) => {
            if (err) console.log(err);
            if (twitterData) {
                TwitterClient.updateRequestCount(twitterClint.options.id, 1);
                resolve(twitterData.statuses);
            }
        });
    });
};

const insertTweets = (tweets, topicID) => {
    tweets.forEach(tweet => {
        let data = {};
        data.created_at = new Date(tweet.created_at);
        data.twitter_id = tweet.id_str;
        data.lang = tweet.lang;
        data.text = tweet.text;
        Tweet.add(data, topicID);
    });
    Topic.updateUpdateDate(topicID, moment().utc().format());
};

export async function getTwitts() {
    const [clients, topic] = await Promise.all([TwitterClient.getAll(), Topic.getToScrap()]);
    
    if (clients.length === 0) return;
    const minReqCount = Math.min(...clients.map(c => c.requests_count));
    const client = clients.find(c => c.requests_count === minReqCount);
    if(!client) {
        console.log("Clients does not exist");
        return;
    }

    // Get tweets from last 7 days
    const finishDates = await FinishDates.get(topic.id);
    const availableDates = getAvailableDates();
    const dates = _.difference(availableDates, finishDates);
    for (let date of dates) {
        const tweet = await Tweet.getFirstByTopic(topic.id, date);
        const maxID = tweet ? tweet.twitter_id : null;
        const tweets = await getTweetsForTopic(client, topic.name, null, maxID, date);
        if (tweets.length === 0) {
            FinishDates.add({finish_date: date, topic_id: topic.id});
        } else {
            insertTweets(tweets, topic.id);
        }
    }

    // Get fresh tweets
    const tweet = await Tweet.getLastByTopic(topic.id);
    const sinceID = tweet ? tweet.twitter_id : null;
    const tweets = await getTweetsForTopic(client, topic.name, sinceID, null, null);
    insertTweets(tweets, topic.id);
}
