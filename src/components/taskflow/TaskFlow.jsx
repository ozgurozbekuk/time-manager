import React, { useState } from 'react'
import {BadgePlus} from 'lucide-react';
import { TextField} from '@mui/material';

const TaskFlow = () => {
    const [inputValue,setInputValue] = useState('')
    const [newTask,setNewTask] = useState([]);
    const [priority, setPriority] = useState("Low");
    const [count,setCount] = useState(1)

    function handleInput(e) {
        setInputValue(e.target.value)
    }

    function addNewTask() {
        if (inputValue.trim() !== "") {
            const anewTask = {
                count:count,
                text: inputValue,
                date: new Date().toLocaleTimeString("en-EN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }),
                priority,
              };
            setNewTask([...newTask, anewTask]); 
            setInputValue("");
            setPriority("Low");
            setCount(count + 1)
          }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
          case "High":
            return "text-red-500"; 
          case "Mid":
            return "text-yellow-500"; 
          case "Low":
          default:
            return "text-green-500"; 
        }
      };


  return (
    <div className='w-full h-screen'>
        <div className='flex justify-center items-center'>
            <h1 className='text-3xl text-[#52D3D8] mb-0'>
                Task Flow
            </h1>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-10 items-start'>
            <div className='taskCard'>
                <h3 className='text-3xl text-center'>To Do</h3><hr/>
                {/* <input type="text" className='w-50 ml-1 text-left border border-gray-400 p-2 rounded mt-3' onChange={handleInput} value={inputValue} /> */}
                <div className="flex items-center justify-start">
                    <TextField id="standard-basic" label="Add Task" variant="standard" onChange={handleInput} value={inputValue}/>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="border border-gray-400 p-2 rounded bg-white ml-10 w-[30%]"
                        >
                        <option value="Low">Low</option>
                        <option value="Mid">Meidum</option>
                        <option value="High">High</option>
                    </select>
                </div>
                
                <ul className='ml-3'>
                    {newTask.map((task,index) =>(
                        <li className='m-2 flex items-center justify-between' key={index}><span className=''>{task.count}</span><p className='ml-0'>{task.text}</p><span>{task.date}</span><span className={`${getPriorityColor(task.priority)}`}>{task.priority}</span></li>
                    ))}
                </ul>
                <button className='mt-30 cursor-pointer ml-30' onClick={addNewTask}>
                    <span className='text-2xl'>Add Task</span>
                    <BadgePlus className='w-15 h-15'/>
                </button>
            </div>
            <div className='taskCard'><h3 className='text-3xl text-center'>Doing</h3><hr/></div>
            <div className='taskCard'><h3 className='text-3xl'>Done</h3><hr/></div>
        </div>
    </div>
    
  )
}

export default TaskFlow
