import express from 'express';
import { Topic, Tweet } from '../models/index.js';

const router = express.Router();

router.get('/:id/:lastId', async (req, res) => {
    try {
        const tweets = await Tweet.getByTopicAndLastId(req.params.id, req.params.lastId);
        if (tweets) {
            res.status(200).json(tweets)
        } else {
            res.status(404).json({ message: "Tweets not found" })
        }
    } catch (err) {
        res.status(500).json({ message: "Error getting tweets", error: err })
    }
});

export default router;