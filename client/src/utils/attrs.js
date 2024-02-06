export function withoutClass(attrs) {
  return Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class'));
}
