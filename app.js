import { scheduleJob } from 'node-schedule';
import { getTwitts } from './src/twitter_client/services/twitterFetch.js'

class Server {
    constructor() {
        this.initJobs();
    }

    initJobs() {
        scheduleJob('*/15 * * * * ', () => {
            getTwitts();
        })
        getTwitts();
    }
}

new Server();
