import express from 'express';
import mongoose from 'mongoose';
import Task from '../models/Task.js';

const router = express.Router();

const validateRequiredText = (fieldName, value) => {
  if (typeof value !== 'string' || value.trim() === '') {
    return `${fieldName} is required`;
  }

  if (value.trim().length > 100 && fieldName === 'title') {
    return 'Title must be 1-100 characters';
  }

  if (value.trim().length > 60 && fieldName === 'courseName') {
    return 'Course name must be 1-60 characters';
  }

  if (value.trim().length > 80 && fieldName === 'topicName') {
    return 'Topic name must be 1-80 characters';
  }

  return null;
};

const validateDuration = (value) => {
  if (value === undefined || value === null || value === '') {
    return 'Duration is required';
  }

  const numericValue = Number(value);

  if (!Number.isInteger(numericValue) || numericValue < 1 || numericValue > 600) {
    return 'Duration must be a whole number between 1 and 600 minutes';
  }

  return null;
};

router.post('/', async (req, res) => {
  try {
    const { title, courseName, topicName, priority, duration } = req.body || {};

    const titleError = validateRequiredText('title', title);
    if (titleError) {
      return res.status(400).json({ error: titleError });
    }

    const courseError = validateRequiredText('courseName', courseName);
    if (courseError) {
      return res.status(400).json({ error: courseError });
    }

    const topicError = validateRequiredText('topicName', topicName);
    if (topicError) {
      return res.status(400).json({ error: topicError });
    }

    const durationError = validateDuration(duration);
    if (durationError) {
      return res.status(400).json({ error: durationError });
    }

    const normalizedPriority = priority === undefined ? 'Medium' : priority;
    if (!['Low', 'Medium', 'High'].includes(normalizedPriority)) {
      return res.status(400).json({ error: 'Priority must be Low, Medium, or High' });
    }

    const task = await Task.create({
      title: title.trim(),
      courseName: courseName.trim(),
      topicName: topicName.trim(),
      priority: normalizedPriority,
      duration: Number(duration),
    });

    return res.status(201).json(task);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const message = Object.values(error.errors)[0]?.message || 'Invalid task data';
      return res.status(400).json({ error: message });
    }

    return res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { status, priority } = req.query;

    if (status && !['pending', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Use pending or completed.' });
    }

    if (priority && !['Low', 'Medium', 'High'].includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority. Use Low, Medium, or High.' });
    }

    const filter = {};

    if (status === 'pending') {
      filter.completed = false;
    }

    if (status === 'completed') {
      filter.completed = true;
    }

    if (priority) {
      filter.priority = priority;
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1, _id: -1 });
    return res.status(200).json(tasks);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id/complete', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid task id' });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (task.completed) {
      return res.status(409).json({ error: 'Task is already completed' });
    }

    task.completed = true;
    task.completedAt = new Date();
    await task.save();

    return res.status(200).json(task);
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
