import Twitter from 'twitter';
import { getAllTwiterClients } from "../model/twitter_client.model.js";
import { getAllTopics, updateTopicUpdateDate } from "../../topics/model/topics.js";
import moment from 'moment';
import { updateRequestCount, addTweets, getTweetsSinceID } from '../model/twitter_client.model.js'

export async function getTwitts() {
    const [clients, topics] = await Promise.all([getAllTwiterClients(), getAllTopics()]);
    if (clients.length === 0) return;
    if (topics.length === 0) return;
    const minReqCount = Math.min(...clients.map(c => c.requests_count));
    const client = clients.find(c => c.requests_count === minReqCount);
    const minUpdateDate = Math.min(...topics.map(t => moment(t.last_update)));
    const topic = topics.find(t => moment(t.last_update).isSame(moment(minUpdateDate)));
    const twitterClint = new Twitter({
        id: client.id,
        consumer_key: client.api_key,
        consumer_secret: client.api_key_secret,
        access_token_key: client.acces_token,
        access_token_secret: client.acces_token_secret
    });
    const [tweet] = await getTweetsSinceID(topic.id);
    let sinceID;
    if (!tweet) sinceID = 1;
    else sinceID = Number(tweet.twitter_id) || 1;
    twitterClint.get('search/tweets', { lang: 'en', since_id: `${sinceID}`, result_type: 'recent', q: `#${topic.name}`, count: 100 }, function (err, data, response) {
        const twitterData = data;
        if (twitterData) {
            if (twitterData.statuses.length) updateRequestCount(twitterClint.options.id, twitterData.statuses.length);
            twitterData.statuses.forEach(tweet => {
                let data = {};
                data.created_at = new Date(tweet.created_at);
                data.twitter_id = Number(tweet.id_str);
                data.lang = tweet.lang;
                data.text = tweet.text;
                addTweets(data, topic.id);
                updateTopicUpdateDate(topic.id, moment().utc().format());
            })
        }
    });
}