import React, { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';

const Timer = () => {
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(0)
    const [isRunning, setIsRunning] = useState(false)

    const [alarms,setAlarms] = useState([])

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

    useEffect(() => {
        if (alarms.length > 0) {
            const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

            alarms.forEach((alarm) => {
                const alarmTotalSeconds = (alarm.hours * 3600) + (alarm.minutes * 60);

                if (totalSeconds >= alarmTotalSeconds) {
                    alert(`Alarm: ${alarm.hours} hour(s) and ${alarm.minutes} minute(s) reached!`);
                    setAlarms((prevAlarms) => prevAlarms.filter((a) => a !== alarm)); //remove alarm
                }
            });
        }
    }, [hours, minutes, seconds, alarms]);

    const formatTime = (time) => String(time).padStart(2, "0");

    const handleStart = () => {
        setIsRunning(true)
    }
    const handleStop = () => {
        setIsRunning(false)
    }

    const handleReset = () => {
        setIsRunning(false)
        setHours(0)
        setMinutes(0)
        setSeconds(0)
    }

    const addAlarm = (time) => {
        
            setAlarms((prevAlarms) => [...prevAlarms, time]);
        
    }

    const deleteAlarm = (index) => {
        const newAlarms = alarms.filter((alarm,i) => i != index)
        setAlarms(newAlarms)
    }

  return (
    <div className="grid min-h-screen h-[100vh] grid-cols-3 grid-rows-1">
        <div className='w-[90%] h-[80vh] col-span-2 px-10 border border-gray-500  my-10 rounded-lg flex flex-col items-center justify-center bg-gray-800'>
            <div className='text-white text-9xl font-bold mb-6'>
                <span>{formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}</span>
            </div>
            <div className='flex space-x-10 text-white text-lg font-bold'>
                <button className='border border-gray-500 px-6 py-2 rounded-lg cursor-pointer hover:bg-gray-400 hover:text-black' onClick={handleStart}>
                    Start
                </button>
                <button className='border border-gray-500 px-6 py-2 rounded-lg cursor-pointer hover:bg-gray-400 hover:text-black' onClick={handleStop}>
                    Stop
                </button>
                <button className='border border-gray-500 px-6 py-2 rounded-lg cursor-pointer hover:bg-gray-400 hover:text-black' onClick={handleReset}>
                    Reset
                </button>
            </div>
        </div>
        <div className="bg-gray-800 col-span-1 border border-gray-500 mx-auto my-10 rounded-lg flex flex-col items-center justify-start w-full h-[80vh]">
            <div>
                <h1 className='text-3xl text-white font-bold justify-start my-5'>Alarm</h1><hr/>
                <div className="flex justify-around mt-4 gap-4">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
            onClick={()=>addAlarm({ hours: 0, minutes: 0.1 })}
          >
            15 Min
          </button>
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
            onClick={()=>addAlarm({ hours: 0, minutes: 30 })}
          >
            30 Min
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
            onClick={()=>addAlarm({ hours: 1, minutes: 0 })}
          >
            1 Hour
          </button>
        </div>
        <div className="mt-6 text-white">
                    <ul className="list-disc pl-5">
                        {alarms.map((alarm, index) => (
                            <li key={index}>
                                {formatTime(alarm.hours)}:{formatTime(alarm.minutes)} - Alarm
                                <button className="text-black-800 cursor-pointer hover:text-black-400" onClick={() => deleteAlarm(index)} >
                                    <DeleteIcon className='text-red-400' />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Timer
