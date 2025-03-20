import React, { useState } from 'react'
import TodoCard from './TodoCard';
import DoingCard from './DoingCard';
import DoneCard from './DoneCard';
import {DndContext} from '@dnd-kit/core';




const TaskFlow = () => {
    

  return (
    <div className='w-full h-screen'>
        <div className='flex justify-center items-center'>
            <h1 className='text-3xl text-[#52D3D8] mb-0'>
                Task Flow
            </h1>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-10 items-start'>
        <DndContext>
            <TodoCard />
            <DoingCard/>
            <DoneCard/>
          </DndContext>
        </div>
    </div>
    
  )
}

export default TaskFlow
