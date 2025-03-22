import React, { useState } from 'react'
import { useDraggable } from '@dnd-kit/core';
import DeleteIcon from '@mui/icons-material/Delete';
import { TaskAlt } from '@mui/icons-material';
import EditIcon from '@mui/icons-material/Edit';

const TaskCard = ({ task}) => {
    

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
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="flex flex-col cursor-grab rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md z-500"
      style={style}
    >
      <h3 className="font-medium text-neutral-100">{task.title}</h3>
      <p className="mt-2 text-sm text-neutral-400">{task.description}</p>
      <div className='flex justify-between items-center'>
      <div className='flex gap-1 items-center justify-center mt-2'>
          <span className='w-[20px] h-[20px] rounded-full bg-red-500 '></span>
          <span className='w-[15px] h-[15px]  rounded-full bg-red-500 '></span>
          <span className='w-[10px] h-[10px]  rounded-full bg-red-500 '></span>
          <span className='w-[5px] h-[5px]  rounded-full bg-red-500 '></span>
        </div>
        <div className='flex gap-2'>
        <EditIcon className='text-white mt-2 cursor-pointer hover:opacity-50 disabled:from-grayscale-700 disabled:to-grayscale-700 disabled:text-white disabled:opacity-50'/>
        <DeleteIcon className='text-white mt-2 cursor-pointer hover:opacity-50 disabled:from-grayscale-700 disabled:to-grayscale-700 disabled:text-white disabled:opacity-50'/>
        </div>
      </div>
    </div>
  )
}

export default TaskCard
