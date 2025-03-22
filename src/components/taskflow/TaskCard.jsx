import React, { useState } from 'react'
import { useDraggable } from '@dnd-kit/core';
import DeleteIcon from '@mui/icons-material/Delete';
import { TaskAlt } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';


const getPriorityColor = (priority) => {
  switch (priority) {
    case 'low':
      return 'bg-green-500';
    case 'mid':
      return 'bg-yellow-500';
    case 'high':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
};



const TaskCard = ({ task,deleteTask}) => {
    

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
      });

      const style = transform
      ? {
          transform: `translate(${transform.x}px, ${transform.y}px)`,
          position: isDragging ? 'fixed' : 'relative',
              zIndex: isDragging ? 1000 : 'auto',
        }
      : undefined;
    

    

  return (
    <div className="flex flex-col  rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md z-500"
    style={style}>
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className='cursor-grab'
    >
      <h3 className="font-medium text-neutral-100">{task.title}</h3>
      <p className="mt-2 text-sm text-neutral-400">{task.description ? task.description : 'No description'}</p>
      </div>
      <div className="flex justify-between items-center mt-2">
        <div className={`w-4 h-4 rounded-full ${getPriorityColor(task.priority)}`}></div>
        <div className="flex gap-2">
          <EditIcon className="text-white cursor-pointer hover:opacity-50" />
          <DeleteIcon className="text-white cursor-pointer hover:opacity-50" onClick={() => deleteTask(task.id)} style={{ pointerEvents: isDragging ? 'none' : 'auto' }}/>
        </div>
      </div>
    
    </div>
  )
}

export default TaskCard
