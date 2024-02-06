const months = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'];

export function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export function toInputDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
}

export function fullName(person) {
  if (!person) return '—';
  return [person.lastName, person.firstName, person.fatherName].filter(Boolean).join(' ') || person.userName || '—';
}

export function shortName(person) {
  if (!person) return '—';
  const name = [person.lastName, person.firstName].filter(Boolean).join(' ');
  return name || person.userName || '—';
}

export function initials(person) {
  const source = [person?.firstName, person?.lastName].filter(Boolean);
  if (source.length) return source.map((part) => part[0]).join('').toUpperCase();
  return (person?.userName || '?').slice(0, 2).toUpperCase();
}

export function scoreTone(value) {
  if (value == null) return 'empty';
  if (value >= 4.5) return 'excellent';
  if (value >= 3.5) return 'good';
  if (value >= 2.5) return 'average';
  return 'poor';
}

export function plural(count, word) {
  return `${count} ta ${word}`;
}
