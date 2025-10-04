import React from 'react'
import {TimerOff, AlarmClock,Paperclip,Rocket, ChartNetwork,Brain,NotebookPen,CalendarClock,Focus,Slice,Hourglass } from "lucide-react";
import { Link } from 'react-router';
import { useAuthStore } from '../../store/authUser';

const Info = () => {

  const {user} = useAuthStore()
  return (
    <div className='min-h-screen p-8 relative z-0 mt-5'> 
      <div className='text-center mb-8'>
        <h1 className='text-4xl font-bold text-white mb-4'>Save Your Time</h1>
        <p className='text-gray-300 text-lg'>Stay productive with one app.</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto'>
        <Link to={user ? '/task' : "/login"}>
        <div className='infoCard'>
          <h2 className='text-2xl font-semibold text-[#52D3D8] mb-4'>Task Flow</h2>
          <ul className='space-y-4 text-gray-300'>
            <li className='flex items-center'>
            <Brain className='w-5 h-5 mr-2'/>
              Focus your task.
            </li>
            <li className='flex items-center'>
            <NotebookPen className='w-5 h-5 mr-2'/>
              Stay organized.
            </li>
            <li className='flex items-center'>
                <Paperclip className='w-5 h-5 mr-2'/>
              Drag, drop, and get things done.
            </li>
          </ul>
        </div>
        </Link>
        <Link to={user ? '/tracker' : "/login"}>
        <div className='infoCard'>
          <h2 className='text-2xl font-semibold text-[#52D3D8] mb-4'>Time Tracker</h2>
          <ul className='space-y-4 text-gray-300'>
            <li className='flex items-center'>
            <CalendarClock className='w-5 h-5 mr-2'/>
              Track your time.
            </li>
            <li className='flex items-center'>
              <Rocket className='w-5 h-5 mr-2'/>
              Boost your productivity.
            </li>
            <li className='flex items-center'>
            <ChartNetwork className='w-5 h-5 mr-2'/>
              Know where your time goes.
            </li>
          </ul>
        </div>
      </Link>
        <Link to={'/pomodoro'}>
        <div className='infoCard'> 
          <h2 className='text-2xl font-semibold text-[#52D3D8] mb-4'>Pomodoro</h2>
         <ul className='space-y-4 text-gray-300'>
            <li className='flex items-center'>
            <Focus className='w-5 h-5 mr-2'/>
              Work with focus. Rest with purpose.
            </li>
            <li className='flex items-center'>
              <Slice className='w-5 h-5 mr-2'/>
              Beat procrastination, one Pomodoro at a time.
            </li>
            <li className='flex items-center'>
            <Hourglass className='w-5 h-5 mr-2'/>
              Stay sharp for 25, recharge in 5.
            </li>
          </ul>
        </div>
        </Link>
        <Link to={'/timer'}>
        <div className='infoCard'> 
          <h2 className='text-2xl font-semibold text-[#52D3D8] mb-4'>Timer</h2>
          <ul className='space-y-4 text-gray-300'>
            <li className='flex items-center'>
            <AlarmClock className='w-5 h-5 mr-2'/>
              Set your time. Let it flow. Hear the bell.
            </li>
            <li className='flex items-center'>
              <TimerOff  className='w-5 h-5 mr-2'/>
              Stay in the zone — stop when it's time.
            </li>
            <li className='flex items-center'>
            <Hourglass className='w-5 h-5 mr-2'/>
              Time counts up — the alarm keeps you on point.
            </li>
          </ul>
        </div>
        </Link>
      </div>
    </div>
  )
}

export default Info