import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['categorize', 'cloze', 'comprehension']
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  image: String,
  required: {
    type: Boolean,
    default: false
  },
  // Categorize-specific fields
  categories: [{
    id: String,
    name: String
  }],
  items: [{
    id: String,
    text: String,
    correctCategory: String
  }],
  // Cloze-specific fields
  text: String,
  blanks: [{
    id: String,
    correctAnswer: String,
    position: Number
  }],
  // Comprehension-specific fields
  passage: String,
  subQuestions: [{
    id: String,
    type: {
      type: String,
      enum: ['multiple-choice', 'short-answer', 'true-false']
    },
    question: String,
    options: [String],
    correctAnswer: String
  }]
});

const formSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  headerImage: String,
  questions: [questionSchema],
  isPublished: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: String,
    default: 'anonymous'
  },
  settings: {
    allowMultipleSubmissions: {
      type: Boolean,
      default: true
    },
    showProgressBar: {
      type: Boolean,
      default: true
    },
    collectEmail: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Index for better query performance
formSchema.index({ createdBy: 1, createdAt: -1 });
formSchema.index({ isPublished: 1 });

export default mongoose.model('Form', formSchema);