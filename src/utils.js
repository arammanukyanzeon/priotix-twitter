import moment from 'moment';
import _ from 'lodash';

// Get last 7 days
export const getAvailableDates = () => {
    const days = [];

    for (let i = 6; i >= 0; i--) {
        days.push(
            moment().subtract(i, 'days').format("YYYY-MM-DD")
        );
    }

    return days;
};

export const parseTweet = (tweet) => ({
    created_at: tweet.created_at,
    twitter_id: tweet.id_str,
    lang: tweet.lang,
    text: tweet.text,
});

export const getClientForScraping = (clients) => {
    const filtered = clients.filter((cl) => cl.limit > cl.requests_count);

    
            const minReqCount = Math.min(...clients.map(c => c.requests_count));
            const client = clients.find(c => c.requests_count === minReqCount);

    return _.minBy(filtered, (cl) => (
        (moment(cl.expire_date) - moment()) / (cl.limit - cl.requests_count)
    ));
};
