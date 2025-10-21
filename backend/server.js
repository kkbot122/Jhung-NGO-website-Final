import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

import authRoutes from './routes/auth.js';
import campaignRoutes from './routes/campaigns.js';
import volunteerRoutes from './routes/volunteers.js';
import donationRoutes from './routes/donations.js';
import userRoutes from './routes/user.js';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Apply JSON and URL-encoded parsers to ALL routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Now all routes can handle both JSON and form data
app.use('/auth', authRoutes);
app.use('/campaigns', campaignRoutes);
app.use('/volunteers', volunteerRoutes);
app.use('/donations', donationRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => res.send({ ok: true }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));