import React, { useState } from 'react'
import { Columns } from './Columns';
import {DndContext} from '@dnd-kit/core';

const COLUMNS = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'DONE', title: 'Done' },
];

const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Research Project',
    description: 'Gather requirements and create initial documentation',
    status: 'TODO',
    priority: 'low',
  },
  {
    id: '2',
    title: 'Design System',
    description: 'Create component library and design tokens',
    status: 'TODO',
    priority: 'low',
  },
  {
    id: '3',
    title: 'API Integration',
    description: 'Implement REST API endpoints',
    status: 'IN_PROGRESS',
    priority: 'low',
  },
  {
    id: '4',
    title: 'Testing',
    description: 'Write unit tests for core functionality',
    status: 'DONE',
    priority: 'low',
  },
];

const TaskFlow = () => {

  const [tasks, setTasks] = useState(INITIAL_TASKS);



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


  return (
    <div className="p-8">
      <div className="flex gap-8 items-center justify-center">
        <DndContext onDragEnd={handleDragEnd} >
          {COLUMNS.map((column) => {
            return (
              <Columns
                key={column.id}
                column={column}
                tasks={tasks.filter((task) => task.status === column.id)}
                showInput={column.id === 'TODO'} 
              />
            );
          })}
        </DndContext>
      </div>
    </div>
    
  )
}

export default TaskFlow
