import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    required: true,
    enum: ['categorize', 'cloze', 'comprehension']
  },
  // Categorize answers
  categorizations: [{
    itemId: String,
    categoryId: String
  }],
  // Cloze answers
  blankAnswers: [{
    blankId: String,
    answer: String
  }],
  // Comprehension answers
  subAnswers: [{
    subQuestionId: String,
    answer: String
  }]
});

const submissionSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  submitterEmail: {
    type: String,
    validate: {
      validator: function(email) {
        return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Invalid email format'
    }
  },
  answers: [answerSchema],
  completedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: String,
  userAgent: String,
  score: {
    type: Number,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Index for better query performance
submissionSchema.index({ formId: 1, createdAt: -1 });
submissionSchema.index({ submitterEmail: 1 });

export default mongoose.model('Submission', submissionSchema);