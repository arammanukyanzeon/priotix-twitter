import express from 'express';
import { Topic } from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        await Topic.add(req.body);
        res.status(200).json({ message: "Topic Added" });
    } catch (err) {
        res.status(500).json({ message: "Error adding topic", error: err })
    }
});

router.get('/', async (req, res) => {
    try {
        const topic = await Topic.getActive();

        if (topic) {
            res.status(200).json(topic)
        } else {
            res.status(404).json({ message: "Topic not found" })
        }
    } catch (err) {
        res.status(500).json({ message: "Error getting topics", error: err })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Topic.delete(req.params.id);
        res.status(200).json({ message: "Topic deleted" });
    } catch (err) {
        res.status(500).json({ message: "Error deleting topic", error: err })
    }
});

export default router;