import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

export const ROLES = Object.freeze({
  ADMIN: 'admin',
  TEACHER: 'teacher',
  PARENT: 'parent',
});

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, default: '' },
    lastName: { type: String, trim: true, default: '' },
    fatherName: { type: String, trim: true, default: '' },
    phone: { type: String, trim: true, default: '' },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
      index: true,
    },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  },
);

userSchema.virtual('fullName').get(function fullName() {
  return [this.lastName, this.firstName, this.fatherName].filter(Boolean).join(' ');
});

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
