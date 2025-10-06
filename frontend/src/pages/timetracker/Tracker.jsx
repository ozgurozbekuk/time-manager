import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Trash2, CirclePlus, Pencil, Check, X } from "lucide-react";
import {
  saveToLocalStorage,
  getFromLocalStorage,
} from "../../utils/localStorage.js";

/* ---------- Helpers (English only) ---------- */
const pad = (n) => String(n).padStart(2, "0");
const formatHMS = (h, m, s) => `${pad(h)}:${pad(m)}:${pad(s)}`;
const secondsToHMS = (total) => {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return formatHMS(h, m, s);
};
const timeStrToSeconds = (t) => {
  // Accepts "HH:MM" or "HH:MM:SS"
  if (!t || typeof t !== "string") return NaN;
  const parts = t.split(":").map((x) => parseInt(x, 10));
  if (parts.some((x) => Number.isNaN(x) || x < 0)) return NaN;
  const [hh = 0, mm = 0, ss = 0] = parts;
  if (mm > 59 || ss > 59) return NaN;
  return hh * 3600 + mm * 60 + ss;
};
const normalizeTimeInput = (t) => {
  // Convert "H:M" or "H:M:S" into "HH:MM:SS"
  const secs = timeStrToSeconds(t);
  if (Number.isNaN(secs)) return "";
  return secondsToHMS(secs);
};

const Tracker = () => {
  /* Timer */
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  /* Top controls */
  const [inputValue, setInputValue] = useState("");
  const [projectName, setProjectName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  /* Items + storage */
  const [items, setItems] = useState(() => {
    const stored = getFromLocalStorage("taskList");
    return Array.isArray(stored) ? stored : [];
  });

  /* Inline edit */
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editProject, setEditProject] = useState("");
  const [editTime, setEditTime] = useState("");

  /* Manual add modal */
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualProject, setManualProject] = useState("");
  const [manualStart, setManualStart] = useState("09:00");
  const [manualEnd, setManualEnd] = useState("10:00");
  const [manualError, setManualError] = useState("");

  const uniqueProjects = useMemo(
    () => [...new Set(items.map((i) => i.project).filter(Boolean))],
    [items]
  );

  /* Tick */
  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev === 59) {
            setMinutes((pm) => {
              if (pm === 59) {
                setHours((ph) => ph + 1);
                return 0;
              }
              return pm + 1;
            });
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  /* Persist list */
  useEffect(() => {
    saveToLocalStorage("taskList", items);
  }, [items]);

  /* Start/Stop */
  const handleStart = () => {
    if (!inputValue.trim())
      return toast.error(manualError || "Please enter a task name.");
    setIsRunning(true);
  };

  const handleStop = () => {
    if (inputValue.trim()) {
      const newTask = {
        id: Date.now(),
        name: inputValue.trim(),
        project: projectName.trim(),
        time: formatHMS(hours, minutes, seconds),
      };
      setItems((prev) => [newTask, ...prev]);
      setInputValue("");
      setProjectName("");
    }
    setIsRunning(false);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  /* List actions */
  const handleRemoveTask = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleEditStart = (item) => {
    setEditingId(item.id);
    setEditName(item.name || "");
    setEditProject(item.project || "");
    setEditTime(item.time || "00:00:00");
  };

  const handleEditSave = (id) => {
    const norm = normalizeTimeInput(editTime);
    if (!norm) {
      // simple guard; you can also show a toast
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              name: editName.trim(),
              project: editProject.trim(),
              time: norm,
            }
          : i
      )
    );
    setEditingId(null);
    setEditName("");
    setEditProject("");
    setEditTime("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditName("");
    setEditProject("");
    setEditTime("");
  };

  const handleSelectProject = (project) => {
    setProjectName(project);
    setShowDropdown(false);
  };

  /* Manual modal */
  const openManual = () => {
    setManualName(inputValue || "");
    setManualProject(projectName || "");
    setManualStart("09:00");
    setManualEnd("10:00");
    setManualError("");
    setIsManualOpen(true);
  };
  const closeManual = () => setIsManualOpen(false);

  const handleManualAdd = () => {
    const name = manualName.trim();
    if (!name) {
      setManualError("Please enter a task name.");
      return;
    }
    const startSec = timeStrToSeconds(manualStart);
    const endSec = timeStrToSeconds(manualEnd);
    if (isNaN(startSec) || isNaN(endSec)) {
      setManualError("Start/End must be in HH:MM format (e.g., 09:30).");
      return;
    }
    let duration = endSec - startSec;
    if (duration < 0) duration += 24 * 3600; // cross-midnight support
    if (duration <= 0) {
      setManualError("Duration must be greater than 0.");
      return;
    }
    const newTask = {
      id: Date.now(),
      name,
      project: manualProject.trim(),
      time: secondsToHMS(duration),
      start: manualStart,
      end: manualEnd,
      manual: true,
    };
    setItems((prev) => [newTask, ...prev]);
    setIsManualOpen(false);
  };

  return (
    <div className="text-white border border-gray-500 rounded-lg bg-gray-800 p-5 mt-10 max-w-7xl mx-auto">
      <h1 className="font-bold text-3xl mt-1 md:mt-5 text-center">
        Time Tracker
      </h1>

      <div
        className="mt-5 grid gap-4
                      grid-cols-1
                      md:grid-cols-[minmax(260px,420px)_minmax(180px,240px)_auto_auto_auto] items-end"
      >
        {/* Task name */}
        <div className="flex flex-col gap-2">
          <label className="text-sm">Task Name</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What are you working on?"
            className="w-full rounded-md border-2 border-grayscale-700 bg-grayscale-700 px-3 py-2 text-white shadow-lg outline-none focus:border-primary-500"
          />
        </div>

        {/* Project + dropdown (anchored) */}
        <div className="flex flex-col gap-2 relative">
          <label className="text-sm">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 160)}
            placeholder="Project"
            className="w-full rounded-md border-2 border-grayscale-700 bg-grayscale-700 px-3 py-2 text-white shadow-lg outline-none focus:border-primary-500"
          />
          {showDropdown && (
            <ul
              role="listbox"
              className="
      absolute top-full left-0 mt-1 w-full max-h-56 overflow-auto
      rounded-md border border-gray-600 bg-gray-800 text-white shadow-xl
      z-20
    "
            >
              {uniqueProjects
                .filter((project) =>
                  project.toLowerCase().includes(projectName.toLowerCase())
                )
                .map((project, idx) => (
                  <li
                    key={idx}
                    onMouseDown={() => handleSelectProject(project)}
                    className="cursor-pointer px-3 py-2 hover:bg-gray-200"
                  >
                    {project}
                  </li>
                ))}
              {projectName.trim() &&
                !uniqueProjects.includes(projectName.trim()) && (
                  <li
                    onMouseDown={() => setShowDropdown(false)}
                    className="cursor-pointer px-3 py-2 text-blue-600 hover:bg-gray-200"
                  >
                    Add “{projectName}”
                  </li>
                )}
            </ul>
          )}
        </div>

        {/* Timer display */}
        <div className="flex items-end md:items-center">
          <span className="font-bold text-lg md:text-xl tabular-nums">
            {pad(hours)}:{pad(minutes)}:{pad(seconds)}
          </span>
        </div>

        {/* Start/Stop */}
        <div className="flex">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="w-full md:w-auto border border-gray-500 px-5 py-2 rounded-lg hover:bg-gray-400 hover:text-black transition"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="w-full md:w-auto border border-red-500 px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
            >
              Stop
            </button>
          )}
        </div>

        {/* Manual add */}
        <div className="flex">
          <button
            onClick={openManual}
            className="w-full md:w-auto flex items-center justify-center gap-2 border border-gray-500 px-6 py-2 rounded-lg hover:bg-gray-400 hover:text-black transition"
          >
            <CirclePlus size={18} /> Manual
          </button>
        </div>
      </div>

      {/* Items list */}
      {items.length > 0 && (
        <ul className="mt-6 space-y-3 max-h-96 overflow-y-auto">
          {items.map((item) => {
            const isEditing = editingId === item.id;
            return (
              <li
                key={item.id}
                className="border border-gray-500 rounded-lg p-3"
              >
                {/* Row uses a responsive grid to keep columns aligned on tablets */}
                <div
                  className="grid gap-3 items-center
                                grid-cols-1
                                md:grid-cols-[minmax(240px,1fr)_minmax(180px,1fr)_auto_auto]"
                >
                  {/* Name */}
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 text-sm text-gray-300">
                      Task:
                    </span>
                    {isEditing ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full rounded-md border border-gray-600 bg-gray-700 px-2 py-1 text-white outline-none"
                        autoFocus
                      />
                    ) : (
                      <span className="font-semibold truncate">
                        {item.name}
                      </span>
                    )}
                  </div>

                  {/* Project */}
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 text-sm text-gray-300">
                      Project:
                    </span>
                    {isEditing ? (
                      <input
                        value={editProject}
                        onChange={(e) => setEditProject(e.target.value)}
                        className="w-full rounded-md border border-gray-600 bg-gray-700 px-2 py-1 text-white outline-none"
                      />
                    ) : (
                      <span className="font-semibold truncate">
                        {item.project || "-"}
                      </span>
                    )}
                  </div>

                  {/* Time (editable) */}
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 text-sm text-gray-300">
                      Time:
                    </span>
                    {isEditing ? (
                      <input
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        onBlur={() => {
                          // normalize on blur (if valid)
                          const norm = normalizeTimeInput(editTime);
                          if (norm) setEditTime(norm);
                        }}
                        placeholder="HH:MM or HH:MM:SS"
                        className="w-36 rounded-md border border-gray-600 bg-gray-700 px-2 py-1 text-white outline-none tabular-nums"
                      />
                    ) : (
                      <span className="text-lg tabular-nums">{item.time}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-start md:justify-end gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleEditSave(item.id)}
                          className="flex items-center gap-1 border border-emerald-500 text-emerald-200 px-3 py-1.5 rounded hover:bg-emerald-500 hover:text-white transition"
                          title="Save"
                        >
                          <Check size={18} />
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="flex items-center gap-1 border border-gray-500 px-3 py-1.5 rounded hover:bg-gray-500 hover:text-white transition"
                          title="Cancel"
                        >
                          <X size={18} />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditStart(item)}
                          className="flex items-center gap-1 border border-gray-500 px-3 py-1.5 rounded hover:bg-gray-500 hover:text-white transition"
                          title="Edit"
                        >
                          <Pencil size={18} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleRemoveTask(item.id)}
                          className="p-2 rounded hover:bg-gray-700 transition"
                          title="Delete"
                        >
                          <Trash2 className="text-amber-300" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Manual info (optional line below on narrow screens) */}
                  {item.manual && (
                    <div className="md:col-span-4 text-xs text-gray-300">
                      Added manually{" "}
                      {item.start && item.end
                        ? `(${item.start}–${item.end})`
                        : ""}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Manual Add Modal */}
      {isManualOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-lg rounded-xl border border-gray-600 bg-gray-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Add Manual Entry</h2>
              <button
                onClick={closeManual}
                className="p-2 rounded hover:bg-gray-700"
                aria-label="Close"
              >
                <X />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block mb-1 text-sm">Task Name</label>
                <input
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="e.g., API integration"
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-1 text-sm">Project</label>
                <input
                  value={manualProject}
                  onChange={(e) => setManualProject(e.target.value)}
                  placeholder="Optional"
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">Start</label>
                <input
                  type="time"
                  value={manualStart}
                  onChange={(e) => setManualStart(e.target.value)}
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm">End</label>
                <input
                  type="time"
                  value={manualEnd}
                  onChange={(e) => setManualEnd(e.target.value)}
                  className="w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white outline-none"
                />
              </div>
            </div>

            {manualError && (
              <p className="text-red-300 mt-3 text-sm">{manualError}</p>
            )}

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={closeManual}
                className="border border-gray-500 px-4 py-2 rounded-lg hover:bg-gray-500 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleManualAdd}
                className="flex items-center gap-2 border border-emerald-500 bg-emerald-600 px-4 py-2 rounded-lg hover:bg-emerald-500 transition"
              >
                <CirclePlus size={18} />
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tracker;
