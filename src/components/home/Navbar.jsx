import React, { useState } from 'react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='fixed top-5 left-1/2 -translate-x-1/2 mb-4'>
      <div className={` navbar relative bg-[#2C3639] shadow-xl transition-all duration-300 ease-in-out ${isOpen ? 'w-[300px] h-[300px]' : 'w-[80px] h-[80px]'}`}
           style={{
             borderRadius: '50%',
             transformOrigin: 'bottom center'
           }}>
        {/* Üst buton */}
        <button className={` left-1/2 -translate-x-1/2 bottom-0 p-4 rounded-full 
                          ${isOpen ? 'opacity-100 visible -translate-y-0' : 'opacity-0 invisible -translate-y-16'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#9BA4B4] hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className='text-white font-bold text-shadow-sm drop-shadow-lg'>Home</span>
        </button>

        {/* Sağ üst buton */}
        <button className={` right-0 bottom-[20%] p-4 rounded-full 
                          ${isOpen ? 'opacity-100 visible translate-x-0 translate-y-0' : 'opacity-0 invisible -translate-x-8 translate-y-8'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#9BA4B4] hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className='text-white font-bold text-shadow-sm drop-shadow-lg'>Timer</span>
        </button>

        {/* Sağ alt buton */}
        <button className={` right-[-10px] top-[20%] p-4 rounded-full
                          ${isOpen ? 'opacity-100 visible translate-x-0 translate-y-0' : 'opacity-0 invisible -translate-x-8 -translate-y-8'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#9BA4B4] hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="9" strokeWidth="2"/>
            <path d="M12 7v5l3 3" strokeWidth="2"/>
            <path d="M20 4l2 2" strokeWidth="2"/>
            <path d="M2 4l2 2" strokeWidth="2"/>
            <path d="M20 20l2 -2" strokeWidth="2"/>
            <path d="M2 20l2 -2" strokeWidth="2"/>
          </svg>
          <span className='text-white font-bold text-shadow-sm drop-shadow-lg'>Time Tracker</span>
        </button>

        {/* Sol alt buton */}
        <button className={` left-0 top-[20%] p-4 rounded-full 
                          ${isOpen ? 'opacity-100 visible translate-x-0 translate-y-0' : 'opacity-0 invisible translate-x-8 -translate-y-8'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#9BA4B4] hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
            <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
            <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
            <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
            <path d="M9 14l2 2 4-4" strokeWidth="2"/>
          </svg>
          <span className='text-white font-bold text-shadow-sm drop-shadow-lg'>Task Flow</span>
        </button>

        {/* Sol üst buton */}
        <button className={`left-0 bottom-[20%] p-4 rounded-full
                          ${isOpen ? 'opacity-100 visible translate-x-0 translate-y-0' : 'opacity-0 invisible translate-x-8 translate-y-8'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#9BA4B4] hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="9" strokeWidth="2"/>
            <path d="M12 3C9 3 8 2 7 2S5 3 5 3" strokeWidth="2"/>
            <path d="M12 8L12 12M12 16L12 12" strokeWidth="2"/>
          </svg>
          <span className='text-white font-bold text-shadow-sm drop-shadow-lg'>Pomodoro</span>
        </button>

        {/* Merkez buton (Mavi) - Altta Sabit */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={` top-0 left-1/2 -translate-x-1/2 p-4 bg-[#52D3D8] rounded-full cursor-pointer transition-all duration-300`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <line 
              x1="2" y1="12" x2="22" y2="12" 
              strokeWidth="3"
              className={`transition-all duration-300 origin-center
                ${isOpen ? 'rotate-45 translate-y-0' : 'translate-y-[-4px]'}`}
            />
            <line 
              x1="2" y1="12" x2="22" y2="12" 
              strokeWidth="3"
              className={`transition-all duration-300 origin-center
                ${isOpen ? '-rotate-45 translate-y-0' : 'translate-y-[4px]'}`}
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Navbar