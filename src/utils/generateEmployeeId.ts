export const generateEmployeeId = (
  existingIds: string[]
): string => {
  const year = new Date().getFullYear();
  const prefix = `EMP-${year}-`;

  const sequences = existingIds
    .filter(id => id && id.startsWith(prefix))
    .map(id => {
      const seq = parseInt(id.replace(prefix, ''), 10);
      return isNaN(seq) ? 0 : seq;
    });

  const nextSeq = sequences.length > 0
    ? Math.max(...sequences) + 1
    : 1;
  return `${prefix}${String(nextSeq).padStart(4, '0')}`;
};


export const isEmployeeIdTaken = (
  id: string,
  existingIds: string[]
): boolean => {
  return existingIds
    .map(e => e.toLowerCase())
    .includes(id.toLowerCase());
};


export const formatEmployeeId = (input: string): string => {
  return input.trim().toUpperCase();
};