const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth.middleware');
const Project = require('../models/project.model');
const User = require('../models/user.model');

const router = express.Router();

// Validation middleware
const validateProject = [
  body('title').trim().notEmpty(),
  body('description').optional().trim()
];

// Get all projects for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user._id })
      .populate('tasks')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

// Create a new project
router.post('/', auth, validateProject, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user can add more projects
    if (!req.user.canAddProject()) {
      return res.status(400).json({ message: 'Maximum project limit reached (4)' });
    }

    const project = new Project({
      ...req.body,
      owner: req.user._id
    });

    await project.save();

    // Add project to user's projects array
    req.user.projects.push(project._id);
    await req.user.save();

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error creating project' });
  }
});

// Get a specific project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user._id
    }).populate('tasks');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project' });
  }
});

// Update a project
router.put('/:id', auth, validateProject, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $set: req.body },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error updating project' });
  }
});

// Delete a project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Remove project from user's projects array
    req.user.projects = req.user.projects.filter(
      p => p.toString() !== req.params.id
    );
    await req.user.save();

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting project' });
  }
});

module.exports = router; 