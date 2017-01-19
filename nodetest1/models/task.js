var mongoose = require('mongoose');

module.exports = mongoose.model('Task',{
	id: String,
	username: String,
	taskName: String,
	content: String,
  group: [String],
	status: String,
	assignedTo: String,
	creator: String,
	date: Date,
	priority: String,
	color: String
});
