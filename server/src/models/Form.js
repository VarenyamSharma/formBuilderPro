import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, enum: ['categorize', 'cloze', 'comprehension'], required: true },
    title: { type: String, required: true },
    image: { type: String },
    data: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { _id: false }
);

const FormSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    headerImage: { type: String },
    questions: { type: [QuestionSchema], default: [] },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isPublished: { type: Boolean, default: false },
    publicId: { type: String, unique: true, index: true }
  },
  { timestamps: true, toJSON: { virtuals: true, versionKey: false, transform: (_doc, ret) => { ret.id = ret._id; delete ret._id; return ret; } } }
);

export default mongoose.model('Form', FormSchema);


