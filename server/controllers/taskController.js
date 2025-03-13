const taskService = require("../services/taskService")

exports.createTask = async (req, res) => {
	try {
		const newTask = await taskService.createTask(req.body);
		res.status(201).json(newTask);
	} catch (err) {
		res.status(400).json({ message: err.message });
	}
};

exports.getAll = async (req,res) => {
    try{
        const tasks = await taskService.getAll()
        res.status(200).json(tasks)
    }catch{
        res.status(500).json({ message: err.message });
    }
}

exports.getTask = async(req, res) => {
    try{
        const task = await taskService.getTask(req.params.id)

        if(!task) return res.status(404).json({message : "Task not found"})

        res.status(200).json(task)
    }catch(err){
        res.status(500).json({message: err.message})
    }
}

exports.updateTaskInfo = async(req,res) => {
    try{
        const updatedTask = await taskService.updateTaskInfo(req)

        if (!updatedTask) return res.status(404).json({ message: "Task not found" });

        res.json(updatedTask);
    }catch(err){
        res.status(400).json({ message: err.message });
    }
}

exports.delete = async (req,res) => {
    try{
        const task = await taskService.delete(req.params.id)
        if(!task) return res.status(404).json({message : "Task not found"})
        
        res.json(task)
    }catch(err){
        res.status(400).json({message : err.message})
    }
}
