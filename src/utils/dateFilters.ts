export type DateRange = '7d' | '30d' | '90d' | '180d' | '365d' | 'all';

export interface DateBounds {
  start: Date | null;
  end: Date;
  label: string;
}

export const getDateBounds = (range: DateRange): DateBounds => {
  const end = new Date();
  const start = new Date();

  switch (range) {
    case '7d':
      start.setDate(start.getDate() - 7);
      return { start, end, label: 'Last 7 days' };
    case '30d':
      start.setDate(start.getDate() - 30);
      return { start, end, label: 'Last 30 days' };
    case '90d':
      start.setDate(start.getDate() - 90);
      return { start, end, label: 'Last 90 days' };
    case '180d':
      start.setDate(start.getDate() - 180);
      return { start, end, label: 'Last 6 months' };
    case '365d':
      start.setDate(start.getDate() - 365);
      return { start, end, label: 'Last 12 months' };
    case 'all':
    default:
      return { start: null, end, label: 'All time' };
  }
};

export const filterByDateRange = <T extends {created_at?: string}>(
  items: T[],
  bounds: DateBounds
): T[] => {
  if (!bounds.start) return items;
  return items.filter((item) => {
    if(!item.created_at) return false;;
    const date = new Date(item.created_at);
    return date >= bounds.start! && date <= bounds.end;
  });
};

export const groupByMonth = <T extends { created_at?: string }> (
  items: T[]
): Record<string, number> => {
  const groups: Record<string, number> = {};
  items.forEach((item) => {
    if (!item.created_at) return;;
    const key = new Date(item.created_at).
    toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
    groups[key] = (groups[key] || 0) + 1;
  });
  return groups;
};

export const formatCurrency = (value: number): string => 
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'Php',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
