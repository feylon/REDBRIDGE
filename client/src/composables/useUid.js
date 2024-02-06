let counter = 0;

export function useUid(prefix = 'field') {
  counter += 1;
  return `${prefix}-${counter}`;
}
