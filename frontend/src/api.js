const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}/api/tasks${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Cannot reach the server. It may be waking up, so try again in a few seconds.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.');
  return data;
}

export const getTasks = () => request('');
export const createTask = (task) => request('', { method: 'POST', body: JSON.stringify(task) });
export const completeTask = (id) => request(`/${id}/complete`, { method: 'PUT' });