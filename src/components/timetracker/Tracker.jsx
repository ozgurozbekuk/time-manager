import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { saveToLocalStorage } from "../../utils/localStorage.js";

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
  const [projectName, setProjectName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showManualInputs, setShowManualInputs] = useState(false);
  const [manualHours, setManualHours] = useState("");
  const [manualMinutes, setManualMinutes] = useState("");
  const [manualSeconds, setManualSeconds] = useState("");

  const formatTime = (time) => String(time).padStart(2, "0");
  const uniqueProjects = [
    ...new Set(items.map((item) => item.project).filter(Boolean)),
  ];

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
        project: projectName,
      };
      setItems((prevItems) => [...prevItems, newTask]);
      setInputValue("");
      setProjectName("");
    }

    setIsRunning(false);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const handleRemoveTask = (getId) => {
    let newList = items.filter((item) => item.id !== getId);
    setItems(newList);
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

  const handleSelectProject = (project) => {
    setProjectName(project);
    setShowDropdown(false);
  };

  const handleManualClick = () => {
    if (inputValue.trim() === "") return;
    setShowManualInputs((prev) => !prev);
  };

  const handleManualAdd = () => {
    const newTask = {
      id: Date.now(),
      name: inputValue,
      time: `${formatTime(parseInt(manualHours, 10) || 0)}:${formatTime(
        parseInt(manualMinutes, 10) || 0
      )}:${formatTime(parseInt(manualSeconds, 10) || 0)}`,
      project: projectName,
    };

    setItems((prevItems) => [...prevItems, newTask]);
    setInputValue("");
    setProjectName("");
    setManualHours("");
    setManualMinutes("");
    setManualSeconds("");
    setShowManualInputs(false);
  };

  return (
    <div className="text-white border flex flex-col text-center border-gray-500 rounded-lg bg-gray-800 p-5 mt-10 h-full max-w-7xl mx-auto">
      <h1 className="font-bold text-3xl mt-5">Time Tracker</h1>
      <div className="flex flex-col md:flex-row justify-between items-center mt-5 gap-4 md:gap-0">
        <div className="flex flex-col md:flex-row items-center gap-5 w-full md:w-auto">
          <div className="flex flex-col gap-2">
            <h2>Task Name</h2>
            <input
              type="text"
              value={inputValue}
              onChange={handleChange}
              placeholder="What are you working on?"
              name="task-name"
              className="w-full md:w-[400px] rounded-md border-2 border-grayscale-700 bg-grayscale-700 px-2 py-1 text-white shadow-lg outline-none focus:border-primary-500"
            />
          </div>
          <div className="flex flex-col gap-2 relative">
            <h2>Project Name</h2>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              placeholder="Project Name"
              name="project-name"
              className="w-full md:w-[200px] rounded-md border-2 border-grayscale-700 bg-grayscale-700 px-2 py-1 text-white shadow-lg outline-none focus:border-primary-500"
            />
            {showDropdown && (
              <ul className="absolute top-full left-0 z-10 bg-white border w-full md:w-[200px] max-h-40 overflow-auto rounded shadow-lg text-black">
                {uniqueProjects
                  .filter((project) =>
                    project.toLowerCase().includes(projectName.toLowerCase())
                  )
                  .map((project, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleSelectProject(project)}
                      className="cursor-pointer px-3 py-2 hover:bg-gray-200"
                    >
                      {project}
                    </li>
                  ))}
                {projectName.trim() &&
                  !uniqueProjects.includes(projectName.trim()) && (
                    <li
                      onClick={() => setShowDropdown(false)} // sadece kapatsın
                      className="cursor-pointer px-3 py-2 text-blue-600 hover:bg-gray-200"
                    >
                      Add &quot;{projectName}&quot;
                    </li>
                  )}
              </ul>
            )}
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
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button
              onClick={handleManualClick}
              className="border border-gray-500 px-6 py-2 rounded-lg cursor-pointer hover:bg-gray-400 hover:text-black w-full md:w-auto"
            >
              Manual
            </button>
            {showManualInputs && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  value={manualHours}
                  onChange={(e) => setManualHours(e.target.value)}
                  placeholder="HH"
                  className="w-16 rounded-md border-2 border-grayscale-700 bg-grayscale-700 px-2 py-1 text-white shadow-lg outline-none focus:border-primary-500"
                />
                <span>:</span>
                <input
                  type="number"
                  value={manualMinutes}
                  onChange={(e) => setManualMinutes(e.target.value)}
                  placeholder="MM"
                  className="w-16 rounded-md border-2 border-grayscale-700 bg-grayscale-700 px-2 py-1 text-white shadow-lg outline-none focus:border-primary-500"
                />
                <span>:</span>
                <input
                  type="number"
                  value={manualSeconds}
                  onChange={(e) => setManualSeconds(e.target.value)}
                  placeholder="SS"
                  className="w-16 rounded-md border-2 border-grayscale-700 bg-grayscale-700 px-2 py-1 text-white shadow-lg outline-none focus:border-primary-500"
                />
                <button
                  onClick={handleManualAdd}
                  className="border border-gray-500 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-400 hover:text-black"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {items.length > 0 && (
        <ul className="mt-5 text-left px-2 md:px-0 max-h-80 overflow-y-auto">
          {items.map((item) => (
            <li key={item.id} className="mb-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border border-gray-500 p-2 rounded-lg gap-2">
                <div className="flex flex-col sm:flex-row sm:gap-4 w-full">
                  <h3 className="font-bold truncate sm:max-w-xs">- {item.name}</h3>
                  <h3 className="font-bold truncate sm:max-w-xs">- {item.project}</h3>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10">
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
