import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Add a comment to a note
router.post('/', async (req, res) => {
  const { noteId, content, userId } = req.body;
  if (!noteId || !content) return res.status(400).json({ error: 'Missing fields' });
  const comment = await prisma.comment.create({
    data: { noteId, content, userId },
  });
  res.json(comment);
});

// Get comments for a note
router.get('/note/:noteId', async (req, res) => {
  const comments = await prisma.comment.findMany({
    where: { noteId: req.params.noteId },
    include: { user: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(comments);
});

export default router;
