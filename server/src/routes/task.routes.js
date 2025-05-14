const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth.middleware');
const Task = require('../models/task.model');
const Project = require('../models/project.model');
const router = express.Router();

// Validation middleware
const validateTask = [
  body('title').trim().notEmpty(),
  body('description').optional().trim(),
  body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'COMPLETED'])
];

// Get all tasks for a project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const tasks = await Task.find({ project: req.params.projectId })
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});

// Create a new task
router.post('/', auth, validateTask, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findOne({
      _id: req.body.project,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.canAddTask()) {
      return res.status(400).json({ message: 'Maximum task limit reached for this project' });
    }

    const task = new Task({
      ...req.body,
      createdBy: req.user._id
    });

    await task.save();

    // Add task to project's tasks array
    project.tasks.push(task._id);
    await project.save();

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task' });
  }
});

// Get a specific task
router.get('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify project ownership
    const project = await Project.findOne({
      _id: task.project,
      owner: req.user._id
    });

    if (!project) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task' });
  }
});

// Update a task
router.put('/:id', auth, validateTask, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify project ownership
    const project = await Project.findOne({
      _id: task.project,
      owner: req.user._id
    });

    if (!project) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update task
    Object.assign(task, req.body);
    if (req.body.status) {
      task.updateStatus(req.body.status);
    }
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' });
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Verify project ownership
    const project = await Project.findOne({
      _id: task.project,
      owner: req.user._id
    });

    if (!project) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Use deleteOne instead of remove
    await Task.deleteOne({ _id: req.params.id });

    // Remove task from project's tasks array
    project.tasks = project.tasks.filter(
      t => t.toString() !== req.params.id
    );
    await project.save();

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
});

module.exports = router; 