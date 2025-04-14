import { useState } from 'react'
import './App.css'
import Home from './components/home/Home'
import TaskFlow from './components/taskflow/TaskFlow'
import Timer from './components/timer/Timer'
import Tracker from './components/timetracker/Tracker'

function App() {

  return (
    <>
    <div className='w-full h-screen m-0 p-0'>
      {/* <Home/> */}
      <TaskFlow/> 
      {/* <Timer/> */}
      {/* <Tracker/> */}
    </div>
      
    </>
  )
}

export default App
