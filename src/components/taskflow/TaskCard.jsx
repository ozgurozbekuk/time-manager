import React from 'react'
import { useDraggable } from '@dnd-kit/core';
import DeleteIcon from '@mui/icons-material/Delete';

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
      className="cursor-grab rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md z-500"
      style={style}
    >
      <h3 className="font-medium text-neutral-100">{task.title}</h3>
      <p className="mt-2 text-sm text-neutral-400">{task.description}</p>
      <DeleteIcon className='text-white mt-2 hover:opacity-50 disabled:from-grayscale-700 disabled:to-grayscale-700 disabled:text-white disabled:opacity-50'/>
    </div>
  )
}

export default TaskCard
