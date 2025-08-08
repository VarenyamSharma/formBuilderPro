import mongoose from 'mongoose';

const ResponseSchema = new mongoose.Schema(
  {
    form: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true, index: true },
    answers: { type: mongoose.Schema.Types.Mixed, default: {} },
    submitterInfo: { type: mongoose.Schema.Types.Mixed },
    submittedAt: { type: Date, default: Date.now }
  },
  { timestamps: true, toJSON: { virtuals: true, versionKey: false, transform: (_doc, ret) => { ret.id = ret._id; delete ret._id; return ret; } } }
);

export default mongoose.model('Response', ResponseSchema);


