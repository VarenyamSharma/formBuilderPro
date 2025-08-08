import express from 'express';
import Form from '../models/Form.js';
import Submission from '../models/Submission.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all forms
router.get('/', async (req, res) => {
  try {
    const forms = await Form.find({ isPublished: true })
      .select('title description headerImage createdAt')
      .sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new form
router.post('/', async (req, res) => {
  try {
    const formData = {
      ...req.body,
      questions: req.body.questions?.map(q => ({
        ...q,
        id: q.id || uuidv4()
      })) || []
    };

    const form = new Form(formData);
    const savedForm = await form.save();
    res.status(201).json(savedForm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get form by ID
router.get('/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update form
router.put('/:id', async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        questions: req.body.questions?.map(q => ({
          ...q,
          id: q.id || uuidv4()
        })) || []
      },
      { new: true, runValidators: true }
    );
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    res.json(form);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete form
router.delete('/:id', async (req, res) => {
  try {
    const form = await Form.findByIdAndDelete(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    // Also delete all submissions for this form
    await Submission.deleteMany({ formId: req.params.id });
    
    res.json({ message: 'Form deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Submit form response
router.post('/:id/submit', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }

    if (!form.isPublished) {
      return res.status(400).json({ message: 'Form is not published' });
    }

    const submission = new Submission({
      formId: req.params.id,
      submitterEmail: req.body.submitterEmail,
      answers: req.body.answers,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    const savedSubmission = await submission.save();
    res.status(201).json({ 
      message: 'Form submitted successfully',
      submissionId: savedSubmission._id
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get form submissions
router.get('/:id/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find({ formId: req.params.id })
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Publish/unpublish form
router.patch('/:id/publish', async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      { isPublished: req.body.isPublished },
      { new: true }
    );
    
    if (!form) {
      return res.status(404).json({ message: 'Form not found' });
    }
    
    res.json(form);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;