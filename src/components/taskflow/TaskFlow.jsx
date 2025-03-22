import React, { useState } from 'react'
import { Columns } from './Columns';
import {DndContext} from '@dnd-kit/core';

const COLUMNS = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'DONE', title: 'Done' },
];

const INITIAL_TASKS = [
  
];

const TaskFlow = () => {

  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const addTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks,newTask])
  }

  const deleteTask = (taskId) => {
    setTasks((prevTasks) =>prevTasks.filter((task) => task.id !== taskId))
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    setTasks(() =>
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
            }
          : task,
      ),
    );
  }

  // const updateTaskPriority = (taskId,newPriority) => {
  //     setTasks((prevTasks) =>
  //     prevTasks.map((task) => task.id === taskId ? {...task,priority: newPriority} : task ))
      
  // }


  return (
    <div className="p-8">
      <h1 className='text-white font-bold text-center text-3xl'>Task Flow</h1>
      <div className="flex gap-8 items-center justify-center">
        <DndContext onDragEnd={handleDragEnd} >
          {COLUMNS.map((column) => {
            return (
              <Columns
                key={column.id}
                column={column}
                addTask={addTask}
                deleteTask={deleteTask}
                tasks={tasks.filter((task) => task.status === column.id)}
                showInput={column.id === 'TODO'} 
                // updateTaskPriority={updateTaskPriority}
              />
            );
          })}
        </DndContext>
      </div>
    </div>
    
  )
}

export default TaskFlow
