const BASE = 'http://localhost:3001/students';

export async function getStudents() {
  const res = await fetch(BASE);
  return res.json();
}

export async function getStudent(id) {
  const res = await fetch(`${BASE}/${id}`);
  return res.json();
}

export async function addStudent(student) {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  return res.json();
}

export async function updateStudent(id, student) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student),
  });
  return res.json();
}

export async function deleteStudent(id) {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  return res.ok;
}
