import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins.js';

const gradeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    curator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    room: { type: String, trim: true, default: '' },
  },
  { timestamps: true },
);

gradeSchema.plugin(toJSONPlugin);

export default mongoose.model('Grade', gradeSchema);
