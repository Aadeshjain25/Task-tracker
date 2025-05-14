const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['TODO', 'IN_PROGRESS', 'COMPLETED'],
    default: 'TODO'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Method to mark task as completed
taskSchema.methods.complete = function() {
  this.status = 'COMPLETED';
  this.completedAt = new Date();
};

// Method to update task status
taskSchema.methods.updateStatus = function(newStatus) {
  if (newStatus === 'COMPLETED') {
    this.completedAt = new Date();
  } else {
    this.completedAt = undefined;
  }
  this.status = newStatus;
};

const Task = mongoose.model('Task', taskSchema);

module.exports = Task; 