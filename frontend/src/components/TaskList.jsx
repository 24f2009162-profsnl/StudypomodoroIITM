import TaskItem from './TaskItem.jsx';

export default function TaskList({ tasks, tab, onComplete, fmt }) {
  if (!tasks.length) {
    return (
      <p className="hint">
        {tab === 'pending'
          ? 'Nothing waiting. Add a task above, or enjoy the quiet.'
          : 'No finished tasks yet. Your first one is a good day to start.'}
      </p>
    );
  }
  return (
    <ul className="list">
      {tasks.map((t) => <TaskItem key={t._id} task={t} onComplete={onComplete} fmt={fmt} />)}
    </ul>
  );
}