import React, { useEffect, useMemo, useState } from 'react';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import StudentDetails from './components/StudentDetails';
import * as service from './services/studentService';
import { computeGrade, downloadCSV } from './utils/helpers';

export default function App() {
  const [students, setStudents] = useState([]);
  const [mode, setMode] = useState('list'); // list | add | edit | details
  const [selected, setSelected] = useState(null);
  // UI features
  const [search, setSearch] = useState('');
  const [sectionFilter, setSectionFilter] = useState('All');
  const [sortBy, setSortBy] = useState('id'); // id | name | marks | grade
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Load students from server
  async function loadStudents() {
    try {
      const data = await service.getStudents();
      // ensure grade exists (auto compute if missing or placeholder)
      const enriched = data.map(s => ({ ...s, grade: s.grade ?? computeGrade(Number(s.marks)) }));
      setStudents(enriched);
    } catch (err) {
      alert('Failed to load students. Make sure JSON Server is running.');
    }
  }

  useEffect(() => {
    // initial load
    loadStudents();
  }, []);

  // Create
  async function handleSaveCreate(student) {
    try {
      // compute grade if not provided
      const toSend = { ...student, grade: student.grade || computeGrade(Number(student.marks)) };
      await service.addStudent(toSend);
      await loadStudents();
      setMode('list');
    } catch (err) {
      alert('Failed to add student.');
    }
  }

  // Edit
  function handleEdit(student) {
    setSelected(student);
    setMode('edit');
  }

  async function handleSaveEdit(studentData) {
    try {
      const patch = { ...studentData, grade: studentData.grade || computeGrade(Number(studentData.marks)) };
      await service.updateStudent(selected.id, patch);
      await loadStudents();
      setMode('list');
      setSelected(null);
    } catch (err) {
      alert('Failed to update student.');
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this student?')) return;
    try {
      await service.deleteStudent(id);
      await loadStudents();
    } catch (err) {
      alert('Failed to delete.');
    }
  }

  async function handleView(id) {
    try {
      const s = await service.getStudent(id);
      setSelected(s);
      setMode('details');
    } catch (err) {
      alert('Failed to load details.');
    }
  }

  // Filtering, searching, sorting and pagination
  const filtered = useMemo(() => {
    let list = [...students];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => String(s.name).toLowerCase().includes(q) || String(s.id).includes(q));
    }
    if (sectionFilter !== 'All') {
      list = list.filter(s => String(s.section) === sectionFilter);
    }
    // sort
    list.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'marks') return Number(b.marks) - Number(a.marks);
      if (sortBy === 'grade') return a.grade.localeCompare(b.grade);
      return Number(a.id) - Number(b.id);
    });
    return list;
  }, [students, search, sectionFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  function handleExportCSV() {
    // export the currently filtered list (not only current page)
    downloadCSV('students_export.csv', filtered);
  }

  return (
    <div className="app-root">
      <header className="header">
        <h1>Student Result Management</h1>
        <p className="sub"></p>
      </header>

      <main>
        {mode === 'list' && (
          <StudentList
            students={pageItems}
            allStudentsCount={filtered.length}
            page={page}
            totalPages={totalPages}
            pageSize={pageSize}
            onPageSizeChange={size => { setPageSize(size); setPage(1); }}
            setPage={setPage}
            onLoad={loadStudents}
            onAdd={() => setMode('add')}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            search={search}
            onSearchChange={val => { setSearch(val); setPage(1); }}
            sectionFilter={sectionFilter}
            onSectionFilterChange={val => { setSectionFilter(val); setPage(1); }}
            sortBy={sortBy}
            onSortByChange={val => setSortBy(val)}
            onExport={handleExportCSV}
          />
        )}

        {mode === 'add' && (
          <StudentForm
            onCancel={() => setMode('list')}
            onSave={handleSaveCreate}
          />
        )}

        {mode === 'edit' && (
          <StudentForm
            initial={selected}
            onCancel={() => { setMode('list'); setSelected(null); }}
            onSave={handleSaveEdit}
          />
        )}

        {mode === 'details' && (
          <StudentDetails student={selected} onBack={() => setMode('list')} />
        )}
      </main>

      <footer className="footer"></footer>
    </div>
  );
}
