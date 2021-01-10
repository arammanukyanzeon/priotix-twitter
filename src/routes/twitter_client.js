import express from 'express';
import { TwitterClient } from '../models/index.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        await TwitterClient.add(req.body);
        res.status(200).json({ message: "Client Added" });
    } catch (err) {
        res.status(500).json({ message: "Error adding client", error: err.message })
    }
});

router.get('/', async (req, res) => {
    try {
        const post = await TwitterClient.getAll();

        if (post) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: "Clients not found" })
        }
    } catch (err) {
        res.status(500).json({ message: "Error getting clients", error: err })
    }
});

export default router;