import React, { useState, useEffect } from "react";

const Pomodoro = () => {
  const options = {
    "25min": { work: 25 * 60, break: 5 * 60 },
    "1hour": { work: 60 * 60, break: 15 * 60 },
    "2hours": { work: 120 * 60, break: 30 * 60 },
  };

  const [selectedOption, setSelectedOption] = useState("25min");
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(options["25min"].work);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      if (!isBreak) {
        // Work finished → start break
        setIsBreak(true);
        setTimeLeft(options[selectedOption].break);
      } else {
        // Break finished → stop timer
        setIsRunning(false);
        setIsBreak(false);
        setTimeLeft(options[selectedOption].work);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isBreak, selectedOption]);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleStartPause = () => setIsRunning(!isRunning);

  const handleReset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(options[selectedOption].work);
  };

  const handleOptionChange = (opt) => {
    setSelectedOption(opt);
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(options[opt].work);
  };

  const breakDuration = options[selectedOption].break / 60;

  return (
    <div className="flex flex-col min-h-screen h-[100vh] items-center mt-10 rounded-lg mx-auto max-w-5xl border border-gray-500  justify-center bg-gray-800 text-white px-4">
      <h1 className="text-4xl font-bold mb-6">Pomodoro Timer</h1>
      <div className="flex gap-4 mb-6">
        {Object.keys(options).map((opt) => (
          <button
            key={opt}
            onClick={() => handleOptionChange(opt)}
            className={`px-4 py-2 rounded-lg font-semibold shadow cursor-pointer ${
              selectedOption === opt
                ? "bg-gray-600 text-white"
                : "bg-white text-black border border-gray-200"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="text-6xl font-mono mb-4">
        {formatTime(timeLeft)}
      </div>
      <p className="mb-2 text-md text-gray-300">
          Break duration: {breakDuration} min
      </p>
      <p className="mb-4 text-xl">
        {isBreak ? "Break Time 🧘‍♂️" : "Focus Time 🚀"}
      </p>

      <div className="flex gap-4">
        <button
          onClick={handleStartPause}
          className="px-6 py-2 bg-green-500 cursor-pointer hover:bg-green-600 text-white font-semibold rounded-lg shadow"
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-red-500 cursor-pointer hover:bg-red-600 text-white font-semibold rounded-lg shadow"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default Pomodoro;
