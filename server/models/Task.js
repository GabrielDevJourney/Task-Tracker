const mongoose = require("mongoose");

// Define the schema for our tasks
const TaskSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		trim: true,
	},
    description: {
        type : String,
        required : false,
        trim : true,
    },
	completed: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Create and export the model
module.exports = mongoose.model("Task", TaskSchema);
