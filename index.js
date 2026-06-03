import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.routes.js';
import clientRoutes from './routes/client.routes.js';
import socialRoutes from './routes/social.routes.js';
import serviceRoutes from './routes/service.routes.js';
import publicRoutes from './routes/public.routes.js';
import { syncDB } from './models/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/socials', socialRoutes);
app.use('/api/service', serviceRoutes);
app.use('/api/public', publicRoutes);

app.get('/', (req, res) => {
  res.send('Social Tree API is running...');
});

syncDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
