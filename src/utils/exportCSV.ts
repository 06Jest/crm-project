export const exportToCSV = (
  data: Record<string, any>[],
  filename: string
): void => {
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);

  const csvRows = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        const str = String(value ?? '');
          return str.includes(',') || str.includes('\n')
          ? `"${str.replace(/"/g,'""')}"`
          : str;
      }).join(',')
    ),
  ];

  const blob = new Blob([csvRows.join('\n')], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `${filename}_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}