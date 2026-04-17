import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { PDFDocument } from 'pdf-lib';

const router = express.Router();
const prisma = new PrismaClient();

const upload = multer({
  limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
  storage: multer.memoryStorage(),
});

// Upload a note (PDF)
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { title, module_code, school, note_type, description, userId } = req.body;
    if (!req.file) return res.status(400).json({ error: 'PDF file required' });
    // Compress PDF (basic: just re-save with pdf-lib)
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const compressed = await pdfDoc.save();
    const note = await prisma.note.create({
      data: {
        title,
        moduleCode: module_code,
        school,
        noteType: note_type,
        description,
        fileName: req.file.originalname,
        fileData: Buffer.from(compressed),
        userId,
      },
    });
    res.json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all notes
router.get('/', async (req, res) => {
  const notes = await prisma.note.findMany({
    include: { user: true, comments: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(notes);
});

// Get a single note
router.get('/:id', async (req, res) => {
  const note = await prisma.note.findUnique({
    where: { id: req.params.id },
    include: { user: true, comments: true },
  });
  if (!note) return res.status(404).json({ error: 'Note not found' });
  res.json(note);
});

export default router;
