import { useState } from 'react';

const EMPTY = { title: '', courseName: '', topicName: '', priority: 'Medium', duration: '' };
const QUICK = [15, 25, 45, 60];

function validate(f) {
  const e = {};
  if (!f.title.trim()) e.title = 'Give this task a name';
  else if (f.title.trim().length > 100) e.title = 'Keep it under 100 characters';
  if (!f.courseName.trim()) e.courseName = 'Which course is this for?';
  else if (f.courseName.trim().length > 60) e.courseName = 'Keep it under 60 characters';
  if (!f.topicName.trim()) e.topicName = 'What topic will you cover?';
  else if (f.topicName.trim().length > 80) e.topicName = 'Keep it under 80 characters';
  const d = Number(f.duration);
  if (f.duration === '' || !Number.isInteger(d) || d < 1 || d > 600) e.duration = 'Enter whole minutes from 1 to 600';
  return e;
}

export default function AddTaskForm({ onAdd }) {
  const [f, setF] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [busy, setBusy] = useState(false);

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const submit = async (ev) => {
    ev.preventDefault();
    const e = validate(f);
    setErrors(e);
    setServerError('');
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      await onAdd({
        title: f.title.trim(), courseName: f.courseName.trim(), topicName: f.topicName.trim(),
        priority: f.priority, duration: Number(f.duration),
      });
      setF(EMPTY);
    } catch (err) {
      setServerError(err.message);
    }
    setBusy(false);
  };

  const field = (k, label, ph) => (
    <label className="fld">
      <span>{label}</span>
      <input value={f[k]} placeholder={ph} onChange={(e) => set(k, e.target.value)} aria-invalid={!!errors[k]} />
      {errors[k] && <em role="alert">{errors[k]}</em>}
    </label>
  );

  return (
    <form className="panel" onSubmit={submit} noValidate>
      <h2>What will you study next?</h2>
      <div className="grid">
        {field('title', 'Task', 'Solve practice set')}
        {field('courseName', 'Course', 'DBMS')}
        {field('topicName', 'Topic', 'Normalization')}
      </div>
      <div className="grid two">
        <div className="fld">
          <span>How important is it?</span>
          <div className="seg" role="radiogroup" aria-label="Priority">
            {['Low', 'Medium', 'High'].map((p) => (
              <button type="button" key={p} role="radio" aria-checked={f.priority === p}
                className={`${p.toLowerCase()} ${f.priority === p ? 'on' : ''}`} onClick={() => set('priority', p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <label className="fld">
          <span>Minutes</span>
          <input type="number" min="1" max="600" value={f.duration} placeholder="45"
            onChange={(e) => set('duration', e.target.value)} aria-invalid={!!errors.duration} />
          <div className="chips">
            {QUICK.map((m) => (
              <button type="button" key={m} className={Number(f.duration) === m ? 'on' : ''} onClick={() => set('duration', String(m))}>{m}</button>
            ))}
          </div>
          {errors.duration && <em role="alert">{errors.duration}</em>}
        </label>
      </div>
      {serverError && <p className="banner" role="alert">{serverError}</p>}
      <button className="cta" disabled={busy}>{busy ? 'Adding...' : 'Add to my shelf'}</button>
    </form>
  );
}