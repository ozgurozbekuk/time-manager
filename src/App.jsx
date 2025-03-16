import { useState } from 'react'
import './App.css'
import Home from './components/home/Home'
import TaskFlow from './components/taskflow/TaskFlow'
import Timer from './components/timer/Timer'

function App() {

  return (
    <>
    <div className='w-full h-screen m-0 p-0'>
      {/* <Home/> */}
      {/* <TaskFlow/>  */}
      <Timer/>
    </div>
      
    </>
  )
}

export default App
