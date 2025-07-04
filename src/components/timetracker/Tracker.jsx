import React, { useEffect } from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';



const Tracker = () => {

  const [hours, setHours] = React.useState(0)
  const [minutes, setMinutes] = React.useState(0)
  const [seconds, setSeconds] = React.useState(0)
  const [isRunning, setIsRunning] = React.useState(false);
  const [textTask, setTextTask] = React.useState(false);
  const [inputValue,setInputValue] = React.useState("");
  const [Items, setItems] = React.useState([]);
  const [startButton, setStartButton] = React.useState(false);

  const formatTime = (time) => String(time).padStart(2, "0");


  const handleStart = () => {
      setTextTask(false);
      setStartButton(!setStartButton)
      if(!startButton && inputValue.trim() !== "") {
      const newTask = {
          id: Date.now(),
          name: inputValue,
          time: `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`,
        };
        setItems([...Items, newTask]);
        setInputValue("");
  }}
  useEffect(() => {
          let interval;
          if(isRunning) {
              interval = setInterval(() => {
                  setSeconds(prevSeconds => {
                      if(prevSeconds === 59){
                          setMinutes(prevMinutes => {
                              if(prevMinutes === 59){
                                  setHours(prevHours => prevHours + 1)
                                  return 0;
                              }
                              return prevMinutes + 1
                          })
                          return 0;
                      }
                      return prevSeconds + 1
                  })
              },1000)
          }else {
              clearInterval(interval)
          }
          return () => clearInterval(interval);
      },[isRunning])


      const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        
        if(value > 0) {
          setTextTask(true);
        }else {
          setTextTask(false);
        }

      }

  return (
    <div className='text-white border flex flex-col text-center border-gray-500 rounded-lg bg-gray-800 p-5 mt-10 h-full'>
      <h1 className='font-bold text-3xl mt-5'>Time Tracker</h1>
      <div className='flex justify-between items-center mt-5'>
        <div className='flex items-center gap-3'>
          <input type="text" value={inputValue} onChange={handleChange} placeholder='What are you working on?' name="task-name" id="" className='w-[300px] rounded-md border-2 border-grayscale-700 bg-grayscale-700 px-2 py-1 text-white shadow-lg outline-none  focus:border-primary-500 ' />
        </div>
      <div className='flex items-center gap-5'>
        <span className='mr-10'>{formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}</span>
        <button disabled={!textTask} className='border border-gray-500 px-6 py-2 rounded-lg cursor-pointer hover:bg-gray-400 hover:text-black' onClick={handleStart}>Start</button>
        <button className='border border-gray-500 px-6 py-2 rounded-lg cursor-pointer hover:bg-gray-400 hover:text-black'>Manuel</button>
      </div>
      </div>
      
    </div>
  )
}
export default Tracker