const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }]
}, {
  timestamps: true
});

// Method to check if project can add more tasks
projectSchema.methods.canAddTask = function() {
  return this.tasks.length < 100; // Setting a reasonable limit
};

const Project = mongoose.model('Project', projectSchema);

module.exports = Project; 