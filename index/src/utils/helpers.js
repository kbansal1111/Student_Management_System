export function computeGrade(marks) {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B';
  if (marks >= 60) return 'C';
  if (marks >= 50) return 'D';
  return 'F';
}

export function downloadCSV(filename, rows) {
  if (!rows || !rows.length) return;
  const header = Object.keys(rows[0]);
  const csv = [header.join(',')].concat(
    rows.map(r =>
      header.map(h => {
        const v = r[h] ?? '';
        return `"${String(v).replace(/"/g, '""')}"`;
      }).join(','))
  ).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
