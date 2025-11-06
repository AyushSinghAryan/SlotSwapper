import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import 'dotenv/config'; 

import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import swapRoutes from './routes/swap.js';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1); // Exit process with failure
    }
};

const app = express();


connectDB();

// Init Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json({ extended: false })); // Body parser

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api', swapRoutes); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
