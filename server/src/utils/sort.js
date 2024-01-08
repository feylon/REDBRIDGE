export const byName = { lastName: 1, firstName: 1 };

export function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
