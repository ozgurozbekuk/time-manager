
import Tracker from "../models/tracker.model.js";

export const startTracker = async (req,res) =>{
    try {
       const userId = req.user._id;
       const isRunning = await Tracker.findOne({userId,isRunning:true}) 
       if(isRunning){
        return res.status(400).json({error:"Already started!"})
       }

       const {projectName,taskName} = req.body;

       const newTask = new Tracker({
        user:req.user._id,
        projectName:projectName,
        taskName:taskName,
        start:new Date(),
        isRunning:true
       })

       await newTask.save()

       res.status(200).json(newTask)
    } catch (error) {
        console.log("Start tracker error: ",error)
        res.status(500).json({error:"Internal server error!"})
    }
}

export const stopTracker =async (req,res) =>{
    try {
        const userId = req.user._id;
        const {id} = req.params

        const task =await Tracker.findOne({_id:id,user:userId})
        if(!task){
            res.status(404).json({error:"Task not found"})
        }
        if(!task.isRunning){
            res.status(409).json({error:"Tracker already stopped!"})
        }

        task.end = new Date()
        await task.save()

        res.status(200).json(task)

    } catch (error) {
        console.log("Stop tracker error: ",error)
        res.status(500).json({error:"Interval server error"})
    }
}

export const manuelTracker =async (req,res) =>{
    try {
        const userId = req.user._id
        const {projectName,taskName,start,end} = req.body;

        if(!start || !end || !projectName || !taskName ){
            return res.status(400).json({error:"All field required!"})
        }

        const s = new Date(start);
        const e = new Date(end);

        if(!(e>s)){
            return res.status(400).json({error:"End must be after start!"})
        }

        const newTask = new Tracker({
            user:userId,
            projectName:projectName,
            taskName:taskName,
            start:s,
            end:e,
            isRunning:false,
            source:"manual",
        })

        await newTask.save()
        res.status(200).json(newTask)
    } catch (error) {
        console.log("Manuel tracker error: ",error)
        res.status(500).json({error:"Internal server error!"})
    }
}

export const updateTracker =async (req,res) =>{
    try {
        const userId = req.user._id;
        const { id } = req.params;

        const {projectName,taskName,start,end} = req.body;

        const s =new Date(start);
        const e = new Date(end);
        if(!(e>s)){
            return res.status(400).json({error:"End must be after start!"})
        }

        const task =await Tracker.findOne({ _id: id, user: userId });
        if(!task){
            return res.status(404).json({error:"Task not found!"})
        }

        if(projectName) task.projectName = projectName.trim()
        if(taskName) task.taskName = taskName.trim();
        if(s) task.start = s;
        if(e){
            task.e=e;
            task.isRunning=false
        }
        await task.save
        res.status(200).json(task)

    } catch (error) {
        console.log("Updated tracker task error: ",error)
        res.status(500).json({error:"Internal server error!"})
    }
}

export const deleteTracker =async (req,res) =>{
    try {
        const userId = req.user._id;
        const {id} = req.params
        const deletedTask =await Tracker.findOneAndDelete({_id:id,user:userId})

        if(!deletedTask) {
            return res.status(404).json({error:"Task not found"})
        }

        res.status(200).json({message:"Task deleted successfully"})


    } catch (error) {
        console.log("Delete tracker error: ",error)
        res.status(500).json({error:"Interval server error!"})
    }
}