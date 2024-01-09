export function toJSONPlugin(schema) {
  schema.set('toJSON', {
    virtuals: true,
    transform: (_doc, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  });
}
