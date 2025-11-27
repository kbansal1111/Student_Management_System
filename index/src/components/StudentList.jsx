import React from 'react';
import SearchBar from './SearchBar';

export default function StudentList({
  students,
  allStudentsCount,
  onLoad,
  onAdd,
  onEdit,
  onDelete,
  onView,
  search,
  onSearchChange,
  sectionFilter,
  onSectionFilterChange,
  sortBy,
  onSortByChange,
  onExport,
  pageSize,
  onPageSizeChange,
  page,
  setPage,
  totalPages
}) {
  const sections = ['All', 'A', 'B', 'C', 'D'];

  return (
    <div className="card list-card">
      <div className="list-header">
        <div>
          <h2>Students</h2>
          <p className="muted small">Showing {allStudentsCount} result(s)</p>
        </div>

        <div className="controls-top">
          <button onClick={onLoad} className="btn ghost">Reload</button>
          <button onClick={onAdd} className="btn primary">+ Add Student</button>
        </div>
      </div>

      <div className="toolbar">
        <SearchBar value={search} onChange={onSearchChange} placeholder="Search by name or ID..." />

        <div className="filters">
          <label className="small">Section</label>
          <select value={sectionFilter} onChange={e => onSectionFilterChange(e.target.value)}>
            {sections.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <label className="small">Sort</label>
          <select value={sortBy} onChange={e => onSortByChange(e.target.value)}>
            <option value="id">ID</option>
            <option value="name">Name (A → Z)</option>
            <option value="marks">Marks (High → Low)</option>
            <option value="grade">Grade</option>
          </select>

          <button onClick={onExport} className="btn outline">Export CSV</button>
        </div>
      </div>

      {students.length === 0 ? (
        <p className="muted">No students to show. Use Reload or Add student.</p>
      ) : (
        <div className="table-wrap">
          <table className="student-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Section</th>
                <th>Marks</th>
                <th>Grade</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.section}</td>
                  <td>{s.marks}</td>
                  <td><span className={`grade-badge grade-${String(s.grade).replace('+','plus')}`}>{s.grade}</span></td>
                  <td className="actions-col">
                    <button className="btn small" onClick={() => onView(s.id)}>View</button>
                    <button className="btn small" onClick={() => onEdit(s)}>Edit</button>
                    <button className="btn small danger" onClick={() => onDelete(s.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="pager">
        <div className="page-controls">
          <label>Page size</label>
          <select value={pageSize} onChange={e => onPageSizeChange(Number(e.target.value))}>
            {[5, 10, 20].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>

        <div className="pagination">
          <button className="btn ghost" onClick={() => setPage(1)} disabled={page === 1}>First</button>
          <button className="btn ghost" onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}>Prev</button>
          <span className="page-indicator">Page {page} / {totalPages}</span>
          <button className="btn ghost" onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}>Next</button>
          <button className="btn ghost" onClick={() => setPage(totalPages)} disabled={page === totalPages}>Last</button>
        </div>
      </div>
    </div>
  );
}
