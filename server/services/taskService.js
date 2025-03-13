const Task = require("../models/Task");

exports.createTask = async (task) => {
	const newTask = new Task(task);
	try {
		const savedTask = await newTask.save();
		return savedTask;
	} catch (err) {
		throw new Error(err.message);
	}
};

exports.getAll = async (res) => {
	return await Task.find().sort({ createdAt: -1 });
};

exports.getTask = async (taskId) => {
    return await Task.findById(taskId)
}

exports.updateTaskInfo = async(req) => {
    const {id} = req.params 
    const updatedData = req.body;

    const task = await Task.findById(id)
    if(!task) return null;

    Object.keys(updatedData).forEach((key) => {
        if(updatedData[key] !== undefined){
            task[key] = updatedData[key];
        }
    })

	return await task.save()
}

exports.delete = async(taskId) =>{
    const task = await Task.findByIdAndDelete(taskId)

    if(!task) return null

    return task
}