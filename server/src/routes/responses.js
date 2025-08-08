import { Router } from 'express';
import Response from '../models/Response.js';
import Form from '../models/Form.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Public submit by publicId, no auth required
router.post('/public/:publicId', async (req, res) => {
  const form = await Form.findOne({ publicId: req.params.publicId, isPublished: true });
  if (!form) return res.status(404).json({ message: 'Form not found' });
  const { answers, submitterInfo } = req.body || {};
  const created = await Response.create({ form: form._id, answers: answers || {}, submitterInfo, submittedAt: new Date() });
  res.status(201).json({ id: created._id });
});

// Owner list responses by form id (private)
router.get('/form/:formId', requireAuth, async (req, res) => {
  const form = await Form.findOne({ _id: req.params.formId, createdBy: req.user.id });
  if (!form) return res.status(404).json({ message: 'Form not found' });
  const responses = await Response.find({ form: form._id }).sort({ createdAt: -1 });
  res.json(responses);
});

export default router;


