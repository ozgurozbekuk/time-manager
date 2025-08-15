/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import DeleteIcon from '@mui/icons-material/Delete';
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

const TaskCard = ({ task, deleteTask, updateTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDesc, setEditedDesc] = useState(task.description || '');
  const [editedPriority, setEditedPriority] = useState(task.priority);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    disabled: isEditing,
  });

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        position: isDragging ? 'fixed' : 'relative',
        zIndex: isDragging ? 1000 : 'auto',
      }
    : undefined;

  const handleSave = () => {
    updateTask(task.id, {
      title: editedTitle,
      description: editedDesc.trim() === '' ? 'No description' : editedDesc,
      priority: editedPriority,
    });
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md"
      style={style}>

     
      {!isEditing && (
        <div ref={setNodeRef} {...listeners} {...attributes} className="cursor-grab">
          <h3 className="font-medium text-neutral-100">{task.title}</h3>
          <p className="mt-2 text-sm text-neutral-400">{task.description || 'No description'}</p>
        </div>
      )}

    
      {isEditing && (
        <div className="mt-2">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="rounded-md border-2 border-grayscale-700 bg-grayscale-700 px-2 py-1 text-white shadow-lg outline-none  focus:border-primary-500"
          />
          <textarea
            value={editedDesc}
            onChange={(e) => setEditedDesc(e.target.value)}
            className="w-full rounded-md border-2 border-grayscale-700 bg-grayscale-700 px-2 py-1 text-white mt-5 shadow-lg outline-none  focus:border-primary-500"
          />
          <select 
            value={editedPriority} 
            onChange={(e) => setEditedPriority(e.target.value)} 
            className="w-full mt-2 block w-20 mb-2  rounded-md border-2 border-grayscale-700 bg-grayscale-700 bg-gray-500 px-2 py-1 text-white shadow-lg outline-none focus:border-primary-500">
            <option value="low">Low</option>
            <option value="mid">Mid</option>
            <option value="high">High</option>
          </select>
          <button onClick={handleSave} className="mt-2 bg-blue-500 cursor-pointer px-4 py-2 rounded text-white">
            Save
          </button>
          <button onClick={() => setIsEditing(false)} className="mt-2 ml-2 cursor-pointer bg-gray-500 px-4 py-2 rounded text-white">
            Cancel
          </button>
        </div>
      )}

      
      {!isEditing && (
        <div className="flex justify-between items-center mt-2">
          <div className={`w-4 h-4 rounded-full ${getPriorityColor(task.priority)}`}></div>
          <div className="flex gap-2">
            <EditIcon className="text-white cursor-pointer hover:opacity-50" 
              onClick={() => setIsEditing(true)} />
            <DeleteIcon className="text-white cursor-pointer hover:opacity-50"
              onClick={() => deleteTask(task.id)}
              style={{ pointerEvents: isDragging ? 'none' : 'auto' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
