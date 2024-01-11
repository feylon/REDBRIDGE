import mongoose from 'mongoose';
import { toJSONPlugin } from './plugins.js';

const studentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    fatherName: { type: String, trim: true, default: '' },
    birthDate: { type: Date, default: null },
    grade: { type: mongoose.Schema.Types.ObjectId, ref: 'Grade', required: true, index: true },
    activeDate: { type: Date, default: null },
  },
  { timestamps: true },
);

studentSchema.virtual('fullName').get(function fullName() {
  return [this.lastName, this.firstName, this.fatherName].filter(Boolean).join(' ');
});

studentSchema.virtual('isActive').get(function isActive() {
  return Boolean(this.activeDate && this.activeDate.getTime() >= Date.now());
});

studentSchema.plugin(toJSONPlugin);

export default mongoose.model('Student', studentSchema);
