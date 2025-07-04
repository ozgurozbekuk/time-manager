import React, { useEffect, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Trash2 } from "lucide-react";
import {
  saveToLocalStorage,
  getFromLocalStorage,
} from "../../utils/localStorage.js";

const Tracker = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem("taskList");
    return stored ? JSON.parse(stored) : [];
  });

  const formatTime = (time) => String(time).padStart(2, "0");

  const handleStart = () => {
    if (inputValue.trim() === "") return;
    setIsRunning(true);
  };

  const handleStop = () => {
    if (inputValue.trim() !== "") {
      const newTask = {
        id: Date.now(),
        name: inputValue,
        time: `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(
          seconds
        )}`,
      };
      setItems((prevItems) => [...prevItems, newTask]);
      setInputValue("");
    }

    setIsRunning(false);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const handleRemoveTask = (getId) => {
    let newList = items.filter((item) => item.id !== getId);
    setItems(newList);
    console.log(items);
  };

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 59) {
            setMinutes((prevMinutes) => {
              if (prevMinutes === 59) {
                setHours((prevHours) => prevHours + 1);
                return 0;
              }
              return prevMinutes + 1;
            });
            return 0;
          }
          return prevSeconds + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    saveToLocalStorage("taskList", items);
  }, [items]);

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
  };

  return (
    <div className="text-white border flex flex-col text-center border-gray-500 rounded-lg bg-gray-800 p-5 mt-10 h-full max-w-5xl mx-auto">
      <h1 className="font-bold text-3xl mt-5">Time Tracker</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mt-5 gap-4 md:gap-0">
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            placeholder="What are you working on?"
            name="task-name"
            className="w-full md:w-[300px] rounded-md border-2 border-grayscale-700 bg-grayscale-700 px-2 py-1 text-white shadow-lg outline-none focus:border-primary-500"
          />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-5 w-full md:w-auto">
          <span className="font-bold mr-0 md:mr-3 text-lg md:text-xl">
            {formatTime(hours)}:{formatTime(minutes)}:{formatTime(seconds)}
          </span>
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="border border-gray-500 px-5 py-2 rounded-lg cursor-pointer hover:bg-gray-400 hover:text-black w-full md:w-auto"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="border border-red-500 px-6 py-2 rounded-lg cursor-pointer bg-red-500 text-white hover:bg-red-600 w-full md:w-auto"
            >
              Stop
            </button>
          )}
          <button className="border border-gray-500 px-6 py-2 rounded-lg cursor-pointer hover:bg-gray-400 hover:text-black w-full md:w-auto">
            Manuel
          </button>
        </div>
      </div>
      {items.length > 0 && (
        <ul className="mt-5 text-left px-2 md:px-0 max-h-80 overflow-y-auto">
          {items.map((item) => (
            <li key={item.id} className="mb-2 flex flex-col">
              <div className="flex justify-between items-center border border-gray-500 p-2 rounded-lg">
                <h3 className="font-bold truncate max-w-[70vw] md:max-w-xs">
                  - {item.name}
                </h3>
                <div className="flex items-center gap-6 md:gap-10">
                  <span className="text-lg">{item.time}</span>
                  <span>
                    <Trash2
                      onClick={() => handleRemoveTask(item.id)}
                      className="cursor-pointer hover:text-amber-300"
                    />
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Tracker;
