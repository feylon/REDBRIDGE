import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins.js';

export const MIN_SCORE = 2;
export const MAX_SCORE = 5;

const scoreSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    value: { type: Number, required: true, min: MIN_SCORE, max: MAX_SCORE },
    date: { type: Date, default: Date.now },
    comment: { type: String, trim: true, default: '' },
  },
  { timestamps: true },
);

scoreSchema.index({ student: 1, subject: 1, date: -1 });
scoreSchema.plugin(toJSONPlugin);

export default mongoose.model('Score', scoreSchema);
