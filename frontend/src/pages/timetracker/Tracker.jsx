import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Trash2, CirclePlus, Pencil, Check, X } from "lucide-react";

/* ---------- Helpers ---------- */
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
const mapTrackerTask = (task) => {
  const source = task?.source ?? (task?.manual ? "manual" : "timer");
  return {
    id: task?._id ?? task?.id ?? Date.now(),
    name: task?.taskName ?? task?.name ?? "",
    project: task?.projectName ?? task?.project ?? "",
    start: task?.start ?? null,
    end: task?.end ?? null,
    durationSec:
      typeof task?.durationSec === "number" ? task.durationSec : null,
    isRunning: Boolean(task?.isRunning),
    source,
    manual: source === "manual",
  };
};
const computeDurationSec = (item) => {
  if (!item) return 0;
  if (item.isRunning && item.start) {
    const diffMs = Date.now() - new Date(item.start).getTime();
    return Math.max(0, Math.floor(diffMs / 1000));
  }
  if (typeof item.durationSec === "number") return Math.max(0, item.durationSec);
  if (item.start && item.end) {
    const diffMs = new Date(item.end).getTime() - new Date(item.start).getTime();
    return Math.max(0, Math.floor(diffMs / 1000));
  }
  return 0;
};
const formatManualRange = (start, end) => {
  if (!start || !end) return "";
  const opts = { hour: "2-digit", minute: "2-digit" };
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "";
  }
  return `${startDate.toLocaleTimeString([], opts)}–${endDate.toLocaleTimeString([], opts)}`;
};
const DEFAULT_PROJECT_NAME = "General";

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

  /* Items */
  const [items, setItems] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);

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

  const resetTimer = () => {
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  const syncTimerFromStart = (startIso) => {
    if (!startIso) {
      resetTimer();
      return;
    }
    const startDate = new Date(startIso);
    if (Number.isNaN(startDate.getTime())) {
      resetTimer();
      return;
    }
    const diffSec = Math.max(
      0,
      Math.floor((Date.now() - startDate.getTime()) / 1000)
    );
    setHours(Math.floor(diffSec / 3600));
    setMinutes(Math.floor((diffSec % 3600) / 60));
    setSeconds(diffSec % 60);
  };

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

  /* Fetch tasks */
  useEffect(() => {
    const controller = new AbortController();
    const loadTasks = async () => {
      try {
        const { data } = await axios.get("/api/tracker", {
          signal: controller.signal,
        });
        const mapped = Array.isArray(data) ? data.map(mapTrackerTask) : [];
        setItems(mapped);
        const running = mapped.find((task) => task.isRunning);
        if (running) {
          setActiveTaskId(running.id);
          setIsRunning(true);
          syncTimerFromStart(running.start);
          setInputValue(running.name);
          setProjectName(running.project);
        } else {
          setActiveTaskId(null);
          setIsRunning(false);
          resetTimer();
        }
      } catch (error) {
        if (error?.code === "ERR_CANCELED") return;
        toast.error(
          error?.response?.data?.error ?? "Failed to load tracker entries."
        );
      }
    };
    loadTasks();
    return () => controller.abort();
  }, []);

  /* Start/Stop */
  const handleStart = async () => {
    if (!inputValue.trim()) {
      toast.error("Please enter a task name.");
      return;
    }
    if (activeTaskId) {
      toast.error("A task is already running.");
      return;
    }
    try {
      const payload = {
        taskName: inputValue.trim(),
        projectName: projectName.trim() || DEFAULT_PROJECT_NAME,
      };
      const { data } = await axios.post("/api/tracker/start", payload);
      const newTask = mapTrackerTask(data);
      setItems((prev) => [
        newTask,
        ...prev.filter((item) => item.id !== newTask.id),
      ]);
      setActiveTaskId(newTask.id);
      setIsRunning(true);
      syncTimerFromStart(newTask.start);
    } catch (error) {
      toast.error(
        error?.response?.data?.error ?? "Failed to start tracker task."
      );
    }
  };

  const handleStop = async () => {
    if (!activeTaskId) {
      toast.error("No running task to stop.");
      return;
    }
    try {
      const { data } = await axios.patch(
        `/api/tracker/stop/${activeTaskId}`
      );
      const updated = mapTrackerTask(data);
      setItems((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      setIsRunning(false);
      setActiveTaskId(null);
      resetTimer();
      setInputValue("");
      setProjectName("");
    } catch (error) {
      toast.error(
        error?.response?.data?.error ?? "Failed to stop tracker task."
      );
    }
  };

  /* List actions */
  const handleRemoveTask = async (id) => {
    try {
      await axios.delete(`/api/tracker/delete/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (id === activeTaskId) {
        setActiveTaskId(null);
        setIsRunning(false);
        resetTimer();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.error ?? "Failed to delete tracker task."
      );
    }
  };

  const handleEditStart = (item) => {
    setEditingId(item.id);
    setEditName(item.name || "");
    setEditProject(item.project || "");
    setEditTime(secondsToHMS(computeDurationSec(item)));
  };

  const handleEditSave = async (id) => {
    const norm = normalizeTimeInput(editTime);
    if (!norm) {
      toast.error("Please enter time as HH:MM or HH:MM:SS.");
      return;
    }
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const durationSec = timeStrToSeconds(norm);
    const startDate = item.start ? new Date(item.start) : new Date();
    const endDate = new Date(startDate.getTime() + durationSec * 1000);

    const finalName =
      editName.trim() ||
      (typeof item.name === "string" ? item.name.trim() : "");
    if (!finalName) {
      toast.error("Task name cannot be empty.");
      return;
    }
    const finalProject =
      editProject.trim() ||
      (typeof item.project === "string" ? item.project.trim() : "") ||
      DEFAULT_PROJECT_NAME;

    try {
      const payload = {
        taskName: finalName,
        projectName: finalProject,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      };
      const { data } = await axios.patch(
        `/api/tracker/update/${id}`,
        payload
      );
      const updated = mapTrackerTask(data);
      setItems((prev) =>
        prev.map((i) => (i.id === updated.id ? updated : i))
      );
      setEditingId(null);
      setEditName("");
      setEditProject("");
      setEditTime("");
    } catch (error) {
      toast.error(
        error?.response?.data?.error ?? "Failed to update tracker task."
      );
    }
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

  const handleManualAdd = async () => {
    setManualError("");
    const name = manualName.trim();
    if (!name) {
      setManualError("Please enter a task name.");
      return;
    }
    const startSec = timeStrToSeconds(manualStart);
    const endSec = timeStrToSeconds(manualEnd);
    if (Number.isNaN(startSec) || Number.isNaN(endSec)) {
      setManualError("Start/End must be in HH:MM format (e.g., 09:30).");
      return;
    }
    let duration = endSec - startSec;
    if (duration <= 0) {
      duration += 24 * 3600; // cross-midnight support
    }
    if (duration <= 0) {
      setManualError("Duration must be greater than 0.");
      return;
    }

    const [startHours = 0, startMinutes = 0] = manualStart
      .split(":")
      .map((n) => parseInt(n, 10));
    const [endHours = 0, endMinutes = 0] = manualEnd
      .split(":")
      .map((n) => parseInt(n, 10));
    const startDate = new Date();
    startDate.setSeconds(0, 0);
    startDate.setHours(startHours, startMinutes, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(endHours, endMinutes, 0, 0);
    if (endDate <= startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    try {
      const payload = {
        taskName: name,
        projectName: manualProject.trim() || DEFAULT_PROJECT_NAME,
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      };
      const { data } = await axios.post("/api/tracker/manuel", payload);
      const newTask = mapTrackerTask(data);
      setItems((prev) => [
        newTask,
        ...prev.filter((item) => item.id !== newTask.id),
      ]);
      setIsManualOpen(false);
      setManualError("");
    } catch (error) {
      setManualError(
        error?.response?.data?.error ?? "Failed to add manual tracker entry."
      );
    }
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
                      <span className="text-lg tabular-nums">
                        {secondsToHMS(computeDurationSec(item))}
                      </span>
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
                        ? `(${formatManualRange(item.start, item.end)})`
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
