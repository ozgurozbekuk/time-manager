import React, { useState } from 'react'
import { TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTaskIcon from '@mui/icons-material/AddTask';

const TodoCard = () => {

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

function deleteTask(index) {
  const updatedTasks = newTask.filter((task, i) => i !== index);
  setNewTask(updatedTasks);
  setCount(count-1)
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
    <div className='relative taskCard'>
                <h3 className='text-3xl text-center'>To Do</h3><hr/>
                <div className="flex justify-start ml-3">
                    <TextField id="standard-basic" label="Add Task" variant="standard" onChange={handleInput} value={inputValue}/>
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="border w-[20%] border-gray-400 p-2 rounded bg-white ml-10 mt-3 w-[30%]"
                        >
                        <option value="Low">Low</option>
                        <option value="Mid">Meidum</option>
                        <option value="High">High</option>
                    </select>
                </div>
                
                <ul className="ml-3 w-full mt-5 ">
                    {/* <li className="grid grid-cols-[3fr_70px_70px_70px] font-semibold border-b pb-2 mb-2 text-left">
                      <span>Task</span>
                      <span>Date</span>
                      <span>Priority</span>
                      <span>Action</span>
                    </li> */}

                    {/* Task List */}
                    {newTask.map((task, index) => (
                      <li 
                        className="grid grid-cols-[3fr_70px_70px_50px] mr-10 justify-start border-b py-3 cursor-pointer"
                        key={index}
                      >
                        <p className="truncate">{task.text}</p>
                        <span className="text-gray-500">{task.date}</span>
                        <span className={`${getPriorityColor(task.priority)} font-semibold`}>
                          {task.priority}
                        </span>
                        <button className="text-black-800 cursor-pointer hover:text-black-400" onClick={() => deleteTask(index)}>
                          <DeleteIcon className='text-red-400' />
                        </button>
                      </li>
                    ))}
                  </ul>
                <button className='flex flex-col items-center absolute bottom-1 left-1/2 transform -translate-x-1/2 cursor-pointer ' onClick={addNewTask}>
                    <AddTaskIcon className='text-8xl hover:text-blue-400'/>
                    <span className='text-2xl'>Add Task</span>
                </button>
            </div>
  )
}

export default TodoCard
