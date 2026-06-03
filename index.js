import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

import authRoutes from './routes/auth.routes.js';
import clientRoutes from './routes/client.routes.js';
import socialRoutes from './routes/social.routes.js';
import publicRoutes from './routes/public.routes.js';
import { syncDB } from './models/index.js';

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/socials', socialRoutes);
app.use('/api/public', publicRoutes);

app.get('/', (req, res) => {
  res.send('Social Tree API is running...');
});

syncDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
