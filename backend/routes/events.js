import express from 'express';
import auth from '../middleware/auth.js';
import { check, validationResult } from 'express-validator';

import Event from '../model/event.model.js';

const router = express.Router();


router.post(
    '/',
    [
        auth,
        [
            check('title', 'Title is required').not().isEmpty(),
            check('startTime', 'Start time is required').isISO8601().toDate(),
            check('endTime', 'End time is required').isISO8601().toDate(),
        ],
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, startTime, endTime } = req.body;

        try {
            const newEvent = new Event({
                title,
                startTime,
                endTime,
                owner: req.user.id,
                status: 'BUSY', // Default
            });

            const event = await newEvent.save();
            res.json(event);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    }
);


router.get('/', auth, async (req, res) => {
    try {
        const events = await Event.find({ owner: req.user.id }).sort({ startTime: 1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.put('/:id', auth, async (req, res) => {
    const { title, startTime, endTime, status } = req.body;

    const eventFields = {};
    if (title) eventFields.title = title;
    if (startTime) eventFields.startTime = startTime;
    if (endTime) eventFields.endTime = endTime;

    // Only allow valid status transitions
    if (status && ['BUSY', 'SWAPPABLE'].includes(status)) {
        eventFields.status = status;
    }

    try {
        let event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        // Ensure user owns the event
        if (event.owner.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        // Don't allow updates if a swap is pending
        if (event.status === 'SWAP_PENDING') {
            return res.status(400).json({ msg: 'Cannot update event with a pending swap' });
        }

        event = await Event.findByIdAndUpdate(
            req.params.id,
            { $set: eventFields },
            { new: true }
        );

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


export default router;
