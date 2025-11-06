import express from 'express';
import auth from '../middleware/auth.js';
import mongoose from 'mongoose';

import Event from '../model/event.model.js';
import SwapRequest from '../model/swapRequest.model.js';

const router = express.Router();

router.get('/swappable-slots', auth, async (req, res) => {
    try {
        const slots = await Event.find({
            owner: { $ne: req.user.id }, // Not the user's own slots
            status: 'SWAPPABLE', // Must be swappable
        }).populate('owner', 'name'); // Show who owns it

        res.json(slots);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


router.post('/swap-request', auth, async (req, res) => {
    const { mySlotId, theirSlotId } = req.body;
    const requesterId = req.user.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Find and validate both slots *within the transaction*
        const mySlot = await Event.findOne({
            _id: mySlotId,
            owner: requesterId,
            status: 'SWAPPABLE',
        }).session(session);

        const theirSlot = await Event.findOne({
            _id: theirSlotId,
            owner: { $ne: requesterId }, // Cannot swap with yourself
            status: 'SWAPPABLE',
        }).session(session);

        // If either slot is invalid or not swappable, abort
        if (!mySlot || !theirSlot) {
            throw new Error('One or both slots are not available for swapping.');
        }

        // 2. Update status of both slots to SWAP_PENDING
        mySlot.status = 'SWAP_PENDING';
        theirSlot.status = 'SWAP_PENDING';

        await mySlot.save({ session });
        await theirSlot.save({ session });

        // 3. Create the new SwapRequest
        const swapRequest = new SwapRequest({
            requester: requesterId,
            receiver: theirSlot.owner,
            requesterSlot: mySlotId,
            receiverSlot: theirSlotId,
            status: 'PENDING',
        });

        await swapRequest.save({ session });

        // 4. Commit the transaction
        await session.commitTransaction();
        res.status(201).json(swapRequest);

    } catch (err) {
        // If anything fails, abort the transaction
        await session.abortTransaction();
        console.error(err.message);
        res.status(400).json({ msg: err.message || 'Server Error' });
    } finally {
        // Always end the session
        session.endSession();
    }
});


router.post('/swap-response/:requestId', auth, async (req, res) => {
    const { acceptance } = req.body; // true or false
    const { requestId } = req.params;
    const receiverId = req.user.id;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // 1. Find the request. Must be PENDING and belong to the user.
        const swapRequest = await SwapRequest.findOne({
            _id: requestId,
            receiver: receiverId,
            status: 'PENDING',
        }).session(session);

        if (!swapRequest) {
            throw new Error('Swap request not found, already handled, or you are not authorized.');
        }

        // 2. Find the two slots involved
        const requesterSlot = await Event.findById(swapRequest.requesterSlot).session(session);
        const receiverSlot = await Event.findById(swapRequest.receiverSlot).session(session);

        if (!requesterSlot || !receiverSlot) {
            throw new Error('One or both slots no longer exist.');
        }

        if (acceptance === true) {
            // --- ACCEPTANCE LOGIC ---

            // 1. Update request status
            swapRequest.status = 'ACCEPTED';

            // 2. Update slot statuses back to BUSY
            requesterSlot.status = 'BUSY';
            receiverSlot.status = 'BUSY';

            // 3. Exchange owners (the core swap)
            const originalRequesterId = requesterSlot.owner;
            requesterSlot.owner = receiverSlot.owner; // Belongs to receiver now
            receiverSlot.owner = originalRequesterId; // Belongs to requester now

        } else {
            // --- REJECTION LOGIC ---

            // 1. Update request status
            swapRequest.status = 'REJECTED';

            // 2. Set both slots back to SWAPPABLE
            requesterSlot.status = 'SWAPPABLE';
            receiverSlot.status = 'SWAPPABLE';
        }

        // 3. Save all updated documents
        await swapRequest.save({ session });
        await requesterSlot.save({ session });
        await receiverSlot.save({ session });

        // 4. Commit the transaction
        await session.commitTransaction();
        res.json(swapRequest);

    } catch (err) {
        await session.abortTransaction();
        console.error(err.message);
        res.status(400).json({ msg: err.message || 'Server Error' });
    } finally {
        session.endSession();
    }
});


router.get('/swap-requests/incoming', auth, async (req, res) => {
    try {
        const requests = await SwapRequest.find({
            receiver: req.user.id,
            status: 'PENDING'
        })
            .populate('requester', 'name')
            .populate('requesterSlot', 'title startTime endTime')
            .populate('receiverSlot', 'title startTime endTime');

        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/swap-requests/outgoing', auth, async (req, res) => {
    try {
        const requests = await SwapRequest.find({
            requester: req.user.id
        })
            .populate('receiver', 'name')
            .populate('requesterSlot', 'title startTime endTime')
            .populate('receiverSlot', 'title startTime endTime')
            .sort({ createdAt: -1 }); // Show newest first

        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
