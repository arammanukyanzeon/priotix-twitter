import express from 'express';
import bodyParser from 'body-parser';
import { scheduleJob } from 'node-schedule';
import { getTwitts } from './src/services/scraper.js';

import topicRoutes from './src/routes/topic.js';
import tweetRoutes from './src/routes/tweet.js';
import twitterClientRoutes from './src/routes/twitter_client.js';

const port = 8080;

class Server {
    constructor() {
        this.initJobs();
        this.app = express();
        this.config();
    }

    initJobs() {
        scheduleJob('* * * * *', () => {
            getTwitts();
        });
    }

    config() {
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());

        this.app.listen(port, () => {
            console.log(`App listening at http://localhost:${port}`)
        });

        this.app.use('/topic', topicRoutes);
        this.app.use('/tweet', tweetRoutes);
        this.app.use('/twitter-client', twitterClientRoutes);

    }
}

let server = new Server();
export default server.app;

