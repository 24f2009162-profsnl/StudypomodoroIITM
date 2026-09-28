import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      validate: {
        validator: (value) => value && value.trim().length > 0,
        message: 'Title is required',
      },
    },
    courseName: {
      type: String,
      required: [true, 'Course name is required'],
      trim: true,
      validate: {
        validator: (value) => value && value.trim().length > 0,
        message: 'Course name is required',
      },
    },
    topicName: {
      type: String,
      required: [true, 'Topic name is required'],
      trim: true,
      validate: {
        validator: (value) => value && value.trim().length > 0,
        message: 'Topic name is required',
      },
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: 'Priority must be Low, Medium, or High',
      },
      default: 'Medium',
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
      min: [1, 'Duration must be between 1 and 600 minutes'],
      max: [600, 'Duration must be between 1 and 600 minutes'],
      validate: {
        validator: (value) => Number.isInteger(value),
        message: 'Duration must be a whole number of minutes',
      },
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
