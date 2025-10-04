import './App.css'
import Home from './pages/home/Home'
import TaskFlow from './pages/taskflow/TaskFlow'
import Timer from './pages/timer/Timer'
import Tracker from './pages/timetracker/Tracker'
import Navigo from './components/navbar/Navigo'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Pomodoro from './pages/pomodoro/Pomodoro';
import ScrollToTop from './components/scrolltotop/ScrollToTop';
 

function App() {

  return (
    <>
    <div className='w-full h-screen m-0 p-0'>
    <Router> 
      <ScrollToTop/>
      <Navigo/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/task" element={<TaskFlow />} />
        <Route path="/tracker" element={<Tracker />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/pomodoro" element={<Pomodoro />} />
      </Routes>
    </Router>
    </div>
      
    </>
  )
}

export default App
