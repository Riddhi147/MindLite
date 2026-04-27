import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import { exec } from 'child_process';

import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
  res.json({ message: "MindLite Node.js backend running" });
});

app.post('/register', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await prisma.users.create({
      data: { email, password, role }
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: "Email already exists or invalid data" });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user || user.password !== password) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  res.json({ id: user.id, email: user.email, role: user.role });
});

app.post('/score', async (req, res) => {
  const { id, game, score } = req.body;
  const newScore = await prisma.scores.create({
    data: { id, game, score, created_at: new Date() }
  });
  res.json(newScore);
});

app.get('/scores/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const scores = await prisma.scores.findMany({ where: { id } });
  res.json(scores);
});

// For ML Prediction: We can bridge this to a python script using child_process
app.post('/predict/manual', (req, res) => {
    // A simple mock for now until we link python-shell
    res.json({ cognitive_score: 85, risk: "Normal" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
