import React from 'react'
import { Paperclip,Rocket, ChartNetwork,Brain,NotebookPen,CalendarClock } from "lucide-react";

const Info = () => {
  return (
    <div className='min-h-screen p-8 relative z-0 mt-5'> 
      <div className='text-center mb-12'>
        <h1 className='text-4xl font-bold text-white mb-4'>Save Your Time</h1>
        <p className='text-gray-300 text-lg'>Stay productive with one app.</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto'>
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

        
        <div className='infoCard'> 
          <h2 className='text-2xl font-semibold text-[#52D3D8] mb-4'>Pomodoro</h2>
          <div className='space-y-4 text-gray-300'>
            <div className='flex items-center justify-between'>
              {/* <span></span>
              <span className='text-[#52D3D8]'>2 saat 30 dk</span> */}
            </div>
            <div className='flex items-center justify-between'>
              {/* <span>Tamamlanan Görevler</span>
              <span className='text-[#52D3D8]'>12</span> */}
            </div>
            <div className='flex items-center justify-between'>
              {/* <span>Verimlilik Skoru</span>
              <span className='text-[#52D3D8]'>85%</span> */}
            </div>
          </div>
        </div>
        <div className='infoCard'> 
          <h2 className='text-2xl font-semibold text-[#52D3D8] mb-4'>Timer</h2>
          <div className='space-y-4 text-gray-300'>
            <div className='flex items-center justify-between'>
              {/* <span>Günlük Odaklanma</span>
              <span className='text-[#52D3D8]'>2 saat 30 dk</span> */}
            </div>
            <div className='flex items-center justify-between'>
              {/* <span>Tamamlanan Görevler</span>
              <span className='text-[#52D3D8]'>12</span> */}
            </div>
            <div className='flex items-center justify-between'>
              {/* <span>Verimlilik Skoru</span>
              <span className='text-[#52D3D8]'>85%</span> */}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Info