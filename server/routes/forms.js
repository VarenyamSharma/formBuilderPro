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

    // Calculate score
    let totalScore = 0;
    let totalPossibleScore = 0;

    req.body.answers.forEach(answer => {
      const question = form.questions.find(q => q.id === answer.questionId);
      if (!question) return;

      switch (question.type) {
        case 'categorize':
          if (question.items && answer.categorizations) {
            const itemScore = 100 / question.items.length;
            totalPossibleScore += 100;
            
            answer.categorizations.forEach(cat => {
              const item = question.items.find(i => i.id === cat.itemId);
              if (item && item.correctCategory === cat.categoryId) {
                totalScore += itemScore;
              }
            });
          }
          break;

        case 'cloze':
          if (question.blanks && answer.blankAnswers) {
            const blankScore = 100 / question.blanks.length;
            totalPossibleScore += 100;
            
            answer.blankAnswers.forEach(blankAnswer => {
              const blank = question.blanks.find(b => b.id === blankAnswer.blankId);
              if (blank && blank.correctAnswer.toLowerCase().trim() === blankAnswer.answer.toLowerCase().trim()) {
                totalScore += blankScore;
              }
            });
          }
          break;

        case 'comprehension':
          if (question.subQuestions && answer.subAnswers) {
            const subQuestionScore = 100 / question.subQuestions.length;
            totalPossibleScore += 100;
            
            answer.subAnswers.forEach(subAnswer => {
              const subQuestion = question.subQuestions.find(sq => sq.id === subAnswer.subQuestionId);
              if (subQuestion && subQuestion.correctAnswer.toLowerCase().trim() === subAnswer.answer.toLowerCase().trim()) {
                totalScore += subQuestionScore;
              }
            });
          }
          break;
      }
    });

    const finalScore = totalPossibleScore > 0 ? Math.round((totalScore / totalPossibleScore) * 100) : 0;

    const submission = new Submission({
      formId: req.params.id,
      submitterEmail: req.body.submitterEmail,
      answers: req.body.answers,
      score: finalScore,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    const savedSubmission = await submission.save();
    res.status(201).json({ 
      message: 'Form submitted successfully',
      submissionId: savedSubmission._id,
      score: finalScore
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

// Get single submission
router.get('/:formId/submissions/:submissionId', async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    res.json(submission);
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