import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins.js';

const subjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true, index: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    hoursPerWeek: { type: Number, min: 0, max: 40, default: 0 },
  },
  { timestamps: true },
);

subjectSchema.index({ grade: 1, name: 1 }, { unique: true });
subjectSchema.plugin(toJSONPlugin);

export default mongoose.model('Subject', subjectSchema);
