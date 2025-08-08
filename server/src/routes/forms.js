import { Router } from 'express';
import { nanoid } from 'nanoid';
import Form from '../models/Form.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// List forms for current user
router.get('/', requireAuth, async (req, res) => {
  const forms = await Form.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
  res.json(forms);
});

// Create form
router.post('/', requireAuth, async (req, res) => {
  const { title, description, headerImage, questions, isPublished } = req.body;
  const form = await Form.create({
    title,
    description,
    headerImage,
    questions,
    isPublished: !!isPublished,
    createdBy: req.user.id,
    publicId: nanoid(10)
  });
  res.status(201).json(form);
});

// Get one form (owner view)
router.get('/:id', requireAuth, async (req, res) => {
  const form = await Form.findOne({ _id: req.params.id, createdBy: req.user.id });
  if (!form) return res.status(404).json({ message: 'Not found' });
  res.json(form);
});

// Update
router.put('/:id', requireAuth, async (req, res) => {
  const updates = { ...req.body };
  const form = await Form.findOneAndUpdate(
    { _id: req.params.id, createdBy: req.user.id },
    updates,
    { new: true }
  );
  if (!form) return res.status(404).json({ message: 'Not found' });
  res.json(form);
});

// Delete
router.delete('/:id', requireAuth, async (req, res) => {
  await Form.findOneAndDelete({ _id: req.params.id, createdBy: req.user.id });
  res.status(204).end();
});

// Public access by publicId (no auth, no nodemailer required)
router.get('/public/:publicId', async (req, res) => {
  const form = await Form.findOne({ publicId: req.params.publicId, isPublished: true });
  if (!form) return res.status(404).json({ message: 'Not found' });
  res.json({
    id: form._id,
    publicId: form.publicId,
    title: form.title,
    description: form.description,
    headerImage: form.headerImage,
    questions: form.questions
  });
});

export default router;


