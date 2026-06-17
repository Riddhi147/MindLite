import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

const upload = multer({
  dest: "uploads/"
});

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"))
);

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "MindLite Backend"
  });
});

app.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await prisma.users.create({
      data: {
        email,
        password,
        role
      }
    });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: "Registration failed"
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.users.findUnique({
      where: { email }
    });

    if (!user || user.password !== password) {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }

    res.json({
      id: user.id,
      email: user.email,
      role: user.role
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Server error"
    });
  }
});

app.post("/score", async (req, res) => {
  try {
    const { user_id, game, score } = req.body;

    const newScore = await prisma.scores.create({
      data: {
        user_id,
        game,
        score,
        created_at: new Date()
      }
    });

    res.json(newScore);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to save score"
    });
  }
});

app.get("/scores/:userId", async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    const scores = await prisma.scores.findMany({
      where: {
        user_id: userId
      },
      orderBy: {
        created_at: "desc"
      }
    });

    res.json(scores);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch scores"
    });
  }
});

app.post("/predict/manual", async (req, res) => {
  res.json({
    cognitive_score: 85,
    risk: "Normal"
  });
});

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});