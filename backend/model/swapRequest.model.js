import mongoose from 'mongoose';

const { Schema, model, Types } = mongoose;


const SwapRequestSchema = new Schema({
    requester: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiver: {
        type: Types.ObjectId,
        ref: 'User',
        required: true,
    },
    requesterSlot: {
        type: Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    receiverSlot: {
        type: Types.ObjectId,
        ref: 'Event',
        required: true,
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
        default: 'PENDING',
    },
}, { timestamps: true });

const SwapRequest = model('SwapRequest', SwapRequestSchema);

export default SwapRequest;
