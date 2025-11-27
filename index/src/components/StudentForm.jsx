import React, { useEffect, useState } from 'react';
import { computeGrade } from '../utils/helpers';

export default function StudentForm({ initial, onCancel, onSave }) {
  const [name, setName] = useState(initial?.name || '');
  const [section, setSection] = useState(initial?.section || 'A');
  const [marks, setMarks] = useState(initial?.marks ?? '');
  const [grade, setGrade] = useState(initial?.grade || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setName(initial?.name || '');
    setSection(initial?.section || 'A');
    setMarks(initial?.marks ?? '');
    setGrade(initial?.grade || '');
    setErrors({});
  }, [initial]);

  useEffect(() => {
    // auto compute grade when marks change (only if user hasn't typed grade manually)
    if (marks !== '') {
      setGrade(computeGrade(Number(marks)));
    }
  }, [marks]);

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!section.trim()) e.section = 'Section is required';
    if (marks === '' || Number.isNaN(Number(marks))) e.marks = 'Valid marks required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function submit(e) {
    e.preventDefault();
    if (!validate()) return;
    const payload = { name: name.trim(), section: section.trim(), marks: Number(marks), grade: grade || computeGrade(Number(marks)) };
    onSave(payload);
  }

  return (
    <div className="card form-card">
      <h2>{initial ? 'Edit Student' : 'Add Student'}</h2>
      <form onSubmit={submit} className="student-form">
        <div className="form-row">
          <label>Name</label>
          <input value={name} onChange={e => setName(e.target.value)} />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>

        <div className="form-row">
          <label>Section</label>
          <input value={section} onChange={e => setSection(e.target.value)} />
          {errors.section && <div className="error">{errors.section}</div>}
        </div>

        <div className="form-row">
          <label>Marks</label>
          <input type="number" value={marks} onChange={e => setMarks(e.target.value)} />
          {errors.marks && <div className="error">{errors.marks}</div>}
        </div>

        <div className="form-row">
          <label>Grade (auto)</label>
          <input value={grade} onChange={e => setGrade(e.target.value)} />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn primary">Save</button>
          <button type="button" className="btn" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
