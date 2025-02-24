import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './components/home/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='w-full h-screen m-0 p-0'>
      <Home/>
    </div>
      
    </>
  )
}

export default App
