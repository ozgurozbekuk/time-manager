import { useState } from "react";
import React from 'react';

export default function Tracker() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");

  const addTask = () => {
    if (taskName.trim() === "") return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        name: taskName,
        timeInSeconds: 0,
        isRunning: false,
        startTime: null,
      },
    ]);
    setTaskName("");
  };

  const startTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, isRunning: true, startTime: Date.now() }
          : { ...task, isRunning: false, startTime: null }
      )
    );
  };

  const stopTask = (id) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === id && task.isRunning) {
          const now = Date.now();
          const elapsed = Math.floor((now - task.startTime) / 1000);
          return {
            ...task,
            isRunning: false,
            timeInSeconds: task.timeInSeconds + elapsed,
            startTime: null,
          };
        }
        return task;
      })
    );
  };

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Task Tracker</h1>

      <div className="flex space-x-2">
        <input
          type="text"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          placeholder="Yeni görev"
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={addTask}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Ekle
        </button>
      </div>

      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center border p-4 rounded"
          >
            <div>
              <h2 className="font-semibold">{task.name}</h2>
              <p className="text-sm text-gray-600">
                Süre: {formatTime(task.timeInSeconds)}
              </p>
            </div>
            <div>
              {task.isRunning ? (
                <button
                  onClick={() => stopTask(task.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Durdur
                </button>
              ) : (
                <button
                  onClick={() => startTask(task.id)}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Başlat
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
