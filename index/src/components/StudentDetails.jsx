import React from 'react';

export default function StudentDetails({ student, onBack }) {
  if (!student) return null;

  return (
    <div className="card details-card">
      <h2>Student Details</h2>
      <div className="details-grid">
        <div><strong>ID</strong><div className="muted">{student.id}</div></div>
        <div><strong>Name</strong><div className="muted">{student.name}</div></div>
        <div><strong>Section</strong><div className="muted">{student.section}</div></div>
        <div><strong>Marks</strong><div className="muted">{student.marks}</div></div>
        <div><strong>Grade</strong><div className="muted">{student.grade}</div></div>
      </div>
      <div style={{marginTop:12}}>
        <button className="btn" onClick={onBack}>Back</button>
      </div>
    </div>
  );
}
