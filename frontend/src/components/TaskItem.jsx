import { useState } from 'react';

const hue = (s) => [...s.toLowerCase()].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);
const COLORS = ['#7fc4a8', '#b9aee6', '#f2d67e', '#f0a3a3', '#8fc9e8'];

export default function TaskItem({ task, onComplete, fmt }) {
  const [burst, setBurst] = useState(false);
  const [err, setErr] = useState('');

  const finish = async () => {
    setErr('');
    setBurst(true);
    await new Promise((r) => setTimeout(r, 650));
    try {
      await onComplete(task._id);
    } catch (e) {
      setBurst(false);
      setErr(e.message);
    }
  };

  return (
    <li className={`task ${task.priority.toLowerCase()} ${task.completed ? 'done' : ''}`}>
      <div className="info">
        <h3>{task.title}</h3>
        <div className="meta">
          <span className="tag" style={{ '--h': hue(task.courseName) }}>{task.courseName}</span>
          <span className="topic">{task.topicName}</span>
          <span className="time">{fmt(task.duration)}</span>
          <span className="prio">{task.priority}</span>
        </div>
        {err && <em role="alert">{err}</em>}
      </div>
      {task.completed ? (
        <span className="check" aria-label="Completed">&#10003;</span>
      ) : (
        <button className="finish" onClick={finish} disabled={burst}>
          {burst ? 'Nice!' : 'Mark complete'}
        </button>
      )}
      {burst && (
        <span className="burst" aria-hidden="true">
          {Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            return <i key={i} style={{ '--x': `${Math.cos(a) * (60 + (i % 3) * 22)}px`, '--y': `${Math.sin(a) * (44 + (i % 3) * 16)}px`, background: COLORS[i % COLORS.length] }} />;
          })}
        </span>
      )}
    </li>
  );
}