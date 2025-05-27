import React from 'react';
import { useState } from 'react'
import './App.css'
import Home from './components/home/Home'
import TaskFlow from './components/taskflow/TaskFlow'
import Timer from './components/timer/Timer'
import Tracker from './components/timetracker/Tracker'
import Navigo from './components/home/Navigo'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {

  return (
    <>
    <div className='w-full h-screen m-0 p-0'>
    <Router> 
      <Navigo/>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/task" element={<TaskFlow />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/timer" element={<Timer />} />
      </Routes>
    </Router>
    </div>
      
    </>
  )
}

export default App
