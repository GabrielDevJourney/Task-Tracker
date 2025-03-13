const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Loads environment variables from .env file

const taskRoutes = require("./routes/taskRoutes");
const app = express();

// Middleware this facilitates secure outside of origin requests and data transfer 
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/tasks", taskRoutes);

// Connect to MongoDB Atlas setup in .env
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		serverSelectionTimeoutMS: 15000,
	})
	.then(() => console.log("Connected to MongoDB Atlas"))
	.catch((err) => {
		console.error("Could not connect to MongoDB Atlas", err);
		// Print more detailed error info
		console.error("Error details:", JSON.stringify(err, null, 2));
	});


// Basic test route
app.get("/", (req, res) => {
	res.send("Task Tracker API is running");
});

// Start server on 
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
