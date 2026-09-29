import { useEffect, useState } from 'react';
import { getTasks, createTask, completeTask } from './api.js';
import AddTaskForm from './components/AddTaskForm.jsx';
import TaskList from './components/TaskList.jsx';

const QUOTES = [
  'One page at a time is still reading.',
  'Ten quiet minutes beat one panicked hour.',
  'Start small. Future you will notice.',
  'Rest is part of the plan too.',
];
const BOOKS = [
  [6, 54, 26, 'var(--lilac)', 30, 0, 25], [16, 40, 30, 'var(--sea)', 24, -9, -30],
  [28, 62, 22, 'var(--sun)', 34, -4, 35], [41, 46, 28, 'var(--rose)', 28, -15, -20],
  [55, 58, 24, 'var(--sea)', 32, -7, 30], [68, 44, 30, 'var(--lilac)', 26, -12, -35],
  [80, 60, 22, 'var(--sun)', 36, -2, 20], [91, 48, 26, 'var(--rose)', 29, -18, -25],
];
const fmt = (m) => (m >= 60 ? `${Math.floor(m / 60)}h ${m % 60 ? `${m % 60}m` : ''}` : `${m} min`);

function Book() {
  return (
    <svg viewBox="0 0 40 52" aria-hidden="true">
      <rect x="4" y="2" width="32" height="48" rx="4" fill="currentColor" />
      <rect x="9" y="2" width="4" height="48" fill="#fff" opacity=".4" />
      <rect x="18" y="12" width="14" height="3" rx="1.5" fill="#fff" opacity=".7" />
      <rect x="18" y="19" width="9" height="3" rx="1.5" fill="#fff" opacity=".5" />
    </svg>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('pending');
  const [q, setQ] = useState(0);

  const load = async () => {
    setLoading(true);
    setError('');
    try { setTasks(await getTasks()); } catch (e) { setError(e.message); }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);
  useEffect(() => {
    const t = setInterval(() => setQ((n) => (n + 1) % QUOTES.length), 7000);
    return () => clearInterval(t);
  }, []);

  const onAdd = async (data) => {
    const t = await createTask(data);
    setTasks((p) => [t, ...p]);
    setTab('pending');
  };
  const onComplete = async (id) => {
    const t = await completeTask(id);
    setTasks((p) => p.map((x) => (x._id === id ? t : x)));
  };

  const pending = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);
  const pct = tasks.length ? Math.round((done.length / tasks.length) * 100) : 0;
  const left = pending.reduce((s, t) => s + t.duration, 0);
  const C = 2 * Math.PI * 34;
  const msg = !tasks.length ? 'Your shelf is empty. Add the first book.'
    : pct === 100 ? 'Shelf cleared. Take a proper break.'
    : pct >= 50 ? 'More than halfway. Keep this rhythm.'
    : done.length ? 'Good start. The next one is easier.'
    : `${fmt(left)} of study is waiting for you.`;

  return (
    <>
      <div className="bg" aria-hidden="true">
        <i className="blob b1" /><i className="blob b2" />
        {BOOKS.map(([x, y, w, c, d, dl, r], i) => (
          <span key={i} className="book" style={{ left: `${x}%`, width: w, '--c': c, '--d': `${d}s`, '--dl': `${dl}s`, '--r': `${r}deg`, '--y': y }}>
            <Book />
          </span>
        ))}
      </div>
      <main className="wrap">
        <header className="hero">
          <h1>Every page you finish counts.</h1>
          <p key={q} className="quote">{QUOTES[q]}</p>
          <div className="glance">
            <svg viewBox="0 0 80 80" className="ring" role="img" aria-label={`${pct}% of tasks completed`}>
              <circle cx="40" cy="40" r="34" className="track" />
              <circle cx="40" cy="40" r="34" className="fill" strokeDasharray={C} strokeDashoffset={C * (1 - pct / 100)} />
              <text x="40" y="46" textAnchor="middle">{pct}%</text>
            </svg>
            <p>{msg}</p>
          </div>
        </header>

        <AddTaskForm onAdd={onAdd} />

        <div className="tabs" role="tablist">
          <button role="tab" aria-selected={tab === 'pending'} className={tab === 'pending' ? 'on' : ''} onClick={() => setTab('pending')}>
            To do <b>{pending.length}</b>
          </button>
          <button role="tab" aria-selected={tab === 'completed'} className={tab === 'completed' ? 'on' : ''} onClick={() => setTab('completed')}>
            Finished <b>{done.length}</b>
          </button>
        </div>

        {error && (
          <div className="banner" role="alert">
            {error} <button onClick={load}>Try again</button>
          </div>
        )}
        {loading ? <p className="hint">Opening your shelf...</p> : (
          <TaskList tasks={tab === 'pending' ? pending : done} tab={tab} onComplete={onComplete} fmt={fmt} />
        )}
      </main>
    </>
  );
}