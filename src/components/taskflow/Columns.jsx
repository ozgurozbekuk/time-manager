import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard  from './TaskCard';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useState } from 'react';
import { AddTask } from '@mui/icons-material';



export function Columns({ column, tasks,showInput,addTask,deleteTask,updateTask }) {
  const [title,setTitle] = useState("");
  const [desc,setDesc] = useState("");
  const [priority, setPriority] = useState("low");
  
 
  const handleAddTask = () => {
    if(!title.trim()) return;
    const taskDescription = desc.trim() ? desc : "No description";
    addTask({
      id: Date.now().toString(),
      title,
      description : taskDescription,
      status:"TODO",
      priority,
    })
    setTitle("");
    setDesc("");
    setPriority("low")
  }

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  

  // const handlePriorityChange = (event) => {
  //   setPriority(event.target.value);
  // }

  return (
    <div className="flex w-100 flex-col h-[80vh] mt-5 rounded-lg relative bg-gray-800 p-4">
      <h2 className="mb-4 font-semibold text-neutral-100">{column.title}</h2>
      {showInput && 
      <div className='flex items-center justify-center gap-2 mt-2 mb-4'>
        <input type="text" name='title' placeholder="Add Title" className="w-26 rounded-md border-2 border-grayscale-700 bg-grayscale-700 px-2 py-1 text-white shadow-lg outline-none  focus:border-primary-500 " onChange={(e) => setTitle(e.target.value)} value={title}/>
        <input type="text" name='title' placeholder="Add Description" className="w-35 rounded-md border-2 border-grayscale-700 bg-grayscale-700 px-2 py-1 text-white shadow-lg outline-none  focus:border-primary-500" onChange={(e) => setDesc(e.target.value)} value={desc} />
        <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-2 block w-20 mb-2  rounded-md border-2 border-grayscale-700 bg-grayscale-700 bg-gray-500 px-2 py-1 text-white shadow-lg outline-none focus:border-primary-500"
          >
            <option value="low">Low</option>
            <option value="mid">Mid</option>
            <option value="high">High</option>
        </select>
        <button className='w-10 rounded-md bg-gradient-to-r from-primary-500 to-primary-700  py-2 font-semibold text-white cursor-pointer hover:opacity-50 disabled:from-grayscale-700 disabled:to-grayscale-700 disabled:text-white disabled:opacity-50' onClick={handleAddTask}>
          <AddCircleOutlineIcon/>
        </button>
      </div>
      }
      <div ref={setNodeRef} className="flex flex-1 overflow-y-auto flex-col gap-4">
        {tasks.map((task) => {
          return <TaskCard key={task.id} task={task} deleteTask={deleteTask} updateTask={updateTask}/>;
        })}
      </div>
    </div>
  );
}

