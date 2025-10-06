import { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';

const Timer = () => {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const [alarms, setAlarms] = useState([])
  const [alarmSound] = useState(() => new Audio("./alarm.wav"))
  const [alarmMessages, setAlarmMessages] = useState([]) // {id, text}

  // Chrono
  useEffect(() => {
    let interval
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prev => {
          if (prev === 59) {
            setMinutes(pm => {
              if (pm === 59) {
                setHours(ph => ph + 1)
                return 0
              }
              return pm + 1
            })
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  useEffect(() => {
    if (alarms.length === 0) return
    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds

    alarms.forEach((alarm) => {
      const alarmTotalSeconds = (alarm.hours * 3600) + (alarm.minutes * 60)
      if (totalSeconds >= alarmTotalSeconds) {
        alarmSound.currentTime = 0
        alarmSound.play().catch(() => {})
       
        const txt = `Alarm: ${String(alarm.hours).padStart(2, '0')}:${String(alarm.minutes).padStart(2, '0')}`
        setAlarmMessages(prev => [...prev, { id: `${Date.now()}-${Math.random()}`, text: txt }])
       
        setAlarms(prev => prev.filter(a => a !== alarm))
      }
    })
  }, [hours, minutes, seconds, alarms, alarmSound])

  const formatTime = (t) => String(t).padStart(2, "0")

  const handleStart = () => setIsRunning(true)
  const handleStop = () => setIsRunning(false)
  const handleReset = () => {
    setIsRunning(false)
    setHours(0); setMinutes(0); setSeconds(0)
  }

  const addAlarm = (time) => {
    handleStart()
    setAlarms(prev => [...prev, time])
  }

  const deleteAlarm = (index) => {
    setAlarms(prev => prev.filter((_, i) => i !== index))
  }

  const stopSoundAndRemoveMessage = (messageId) => {
    alarmSound.pause()
    alarmSound.currentTime = 0
    setAlarmMessages(prev => prev.filter(m => m.id !== messageId))
  }

  return (
    <div className="min-h-screen w-full bg-black/0 mt-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6 max-w-6xl mx-auto">
        
        <div className="order-2 md:order-1 col-span-1 md:col-span-2 w-full border border-gray-500 rounded-lg bg-gray-800
                        flex flex-col items-center justify-center
                        p-6 md:p-10
                        min-h-[300px] md:h-[80vh]">
          <div className="text-white font-bold mb-6 text-center leading-none
                          text-[12vw] md:text-7xl lg:text-8xl">
            <span>{formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-white text-base md:text-lg font-bold">
            <button
              className="border border-gray-500 px-5 py-2 rounded-lg cursor-pointer hover:bg-gray-400 hover:text-black transition"
              onClick={handleStart}
            >
              Start
            </button>
            <button
              className="border border-gray-500 px-5 py-2 rounded-lg cursor-pointer hover:bg-gray-400 hover:text-black transition"
              onClick={handleStop}
            >
              Stop
            </button>
            <button
              className="border border-gray-500 px-5 py-2 rounded-lg cursor-pointer hover:bg-gray-400 hover:text-black transition"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </div>

        <div className="order-1 md:order-2 col-span-1 border border-gray-500 rounded-lg bg-gray-800
                        w-full p-4 md:p-6
                        max-h-[60vh] md:max-h-[80vh] overflow-y-auto">
          <h1 className="text-2xl md:text-3xl text-white font-bold mb-4 text-center">Alarm</h1>
          <hr className="border-gray-600 mb-4" />

          <div className="flex flex-wrap justify-center gap-2 md:gap-4 text-white font-bold">
            <button
              className="border border-gray-500 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-400 hover:text-black transition"
              onClick={() => addAlarm({ hours: 0, minutes: 5 })}
            >5 Min</button>
            <button
              className="border border-gray-500 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-400 hover:text-black transition"
              onClick={() => addAlarm({ hours: 0, minutes: 15 })}
            >15 Min</button>
            <button
              className="border border-gray-500 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-400 hover:text-black transition"
              onClick={() => addAlarm({ hours: 0, minutes: 30 })}
            >30 Min</button>
            <button
              className="border border-gray-500 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-400 hover:text-black transition"
              onClick={() => addAlarm({ hours: 1, minutes: 0 })}
            >1 Hour</button>
          </div>

          <div className="mt-6 text-white">
            <ul className="space-y-3">
              {alarms.map((alarm, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between border border-gray-500 px-3 py-2 rounded-lg font-bold"
                >
                  <span>{formatTime(alarm.hours)}:{formatTime(alarm.minutes)} - Alarm</span>
                  <button
                    className="p-1 rounded hover:bg-gray-700 transition"
                    aria-label="Delete alarm"
                    onClick={() => deleteAlarm(index)}
                  >
                    <DeleteIcon className="text-red-400" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 text-white">
            <ul className="space-y-3">
              {alarmMessages.map((message) => (
                <li
                  key={message.id}
                  className="flex items-center justify-between border border-gray-500 px-3 py-2 rounded-lg"
                >
                  <span className="mr-4 font-semibold">{message.text}</span>
                  <button
                    className="border border-gray-500 px-3 py-1.5 rounded-lg cursor-pointer hover:bg-gray-400 hover:text-black transition"
                    onClick={() => stopSoundAndRemoveMessage(message.id)}
                  >
                    Stop
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
