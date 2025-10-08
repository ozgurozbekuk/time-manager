import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { Columns } from "./Columns";
import { DndContext } from "@dnd-kit/core";

const COLUMNS = [
  { id: "TODO", title: "To Do" },
  { id: "IN_PROGRESS", title: "In Progress" },
  { id: "DONE", title: "Done" },
];

const STATUS_MAP = {
  todo: "TODO",
  "in-progress": "IN_PROGRESS",
  in_progress: "IN_PROGRESS",
  inprogress: "IN_PROGRESS",
  doing: "IN_PROGRESS",
  done: "DONE",
};

const BACKEND_STATUS_MAP = {
  TODO: "todo",
  IN_PROGRESS: "doing",
  DONE: "done",
};

const PRIORITY_MAP = {
  1: "low",
  2: "mid",
  3: "high",
  low: "low",
  mid: "mid",
  medium: "mid",
  high: "high",
};

const BACKEND_PRIORITY_MAP = {
  low: 1,
  mid: 2,
  high: 3,
};

const normalizeTask = (task) => {
  if (!task) return null;

  const priorityKey =
    typeof task.priority === "number"
      ? task.priority
      : String(task.priority || "").toLowerCase();
  const statusKey = String(task.status || "").toLowerCase();

  return {
    id: task._id || task.id,
    title: task.title || "Untitled task",
    description: task.description?.trim()
      ? task.description
      : "No description",
    status: STATUS_MAP[statusKey] || "TODO",
    priority: PRIORITY_MAP[priorityKey] || "mid",
    dueDate: task.dueDate ?? null,
  };
};

const TaskFlow = () => {
  const [tasks, setTasks] = useState([]);
  const tasksRef = useRef([]);

  const applyTasksUpdate = useCallback((updater) => {
    setTasks((prevTasks) => {
      const nextTasks =
        typeof updater === "function" ? updater(prevTasks) : updater;
      tasksRef.current = nextTasks;
      return nextTasks;
    });
  }, []);

  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const fetchTasksFromDb = useCallback(async (signal) => {
    const response = await axios.get("/api/tasks", { signal });
    const data = Array.isArray(response.data) ? response.data : [];

    return data
      .map(normalizeTask)
      .filter((task) => task && task.id);
  }, []);

  const addTask = useCallback(
    async ({
      title,
      description,
      priority,
      status = "TODO",
      dueDate = null,
    }) => {
      const normalizedStatus =
        STATUS_MAP[String(status || "").toLowerCase()] || "TODO";
      const normalizedPriority =
        PRIORITY_MAP[
          typeof priority === "number"
            ? priority
            : String(priority || "").toLowerCase()
        ] || "mid";

      try {
        const payload = {
          title: title?.trim() || "Untitled task",
          description: description?.trim() || "No description",
          priority: BACKEND_PRIORITY_MAP[normalizedPriority] ?? 2,
          status: BACKEND_STATUS_MAP[normalizedStatus] ?? "todo",
          dueDate,
        };

        const response = await axios.post("/api/tasks/createtask", payload);
        const createdTask = normalizeTask(response.data);

        if (createdTask?.id) {
          applyTasksUpdate((prevTasks) => {
            const existingIndex = prevTasks.findIndex(
              (task) => task.id === createdTask.id
            );

            if (existingIndex !== -1) {
              const updatedTasks = [...prevTasks];
              updatedTasks[existingIndex] = createdTask;
              return updatedTasks;
            }

            return [...prevTasks, createdTask];
          });
        }

        return createdTask;
      } catch (error) {
        console.error("Failed to add task:", error);
        return null;
      }
    },
    [applyTasksUpdate]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      try {
        await axios.delete(`/api/tasks/delete/${taskId}`);
        applyTasksUpdate((prevTasks) =>
          prevTasks.filter((task) => task.id !== taskId)
        );
      } catch (error) {
        console.error("Failed to delete task:", error);
      }
    },
    [applyTasksUpdate]
  );

  const updateTask = useCallback(
    async (taskId, updatedFields = {}) => {
      const existingTask = tasksRef.current.find((task) => task.id === taskId);
      if (!existingTask) {
        return null;
      }

      const resolvedPriority =
        updatedFields.priority !== undefined
          ? PRIORITY_MAP[
              typeof updatedFields.priority === "number"
                ? updatedFields.priority
                : String(updatedFields.priority || "").toLowerCase()
            ] || existingTask.priority
          : existingTask.priority;

      const resolvedStatus =
        updatedFields.status !== undefined
          ? STATUS_MAP[String(updatedFields.status || "").toLowerCase()] ||
            existingTask.status
          : existingTask.status;

      const backendPriority =
        BACKEND_PRIORITY_MAP[resolvedPriority] ??
        BACKEND_PRIORITY_MAP[existingTask.priority] ??
        BACKEND_PRIORITY_MAP.mid;
      const backendStatus =
        BACKEND_STATUS_MAP[resolvedStatus] ??
        BACKEND_STATUS_MAP[existingTask.status] ??
        BACKEND_STATUS_MAP.TODO;

      const payload = {
        title: updatedFields.title ?? existingTask.title,
        description: updatedFields.description ?? existingTask.description,
        priority: backendPriority,
        status: backendStatus,
        dueDate: updatedFields.dueDate ?? existingTask.dueDate,
      };

      try {
        const response = await axios.patch(
          `/api/tasks/update/${taskId}`,
          payload
        );
        const updatedTask = normalizeTask(response.data);

        if (updatedTask?.id) {
          applyTasksUpdate((prevTasks) =>
            prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
          );
        }

        return updatedTask;
      } catch (error) {
        console.error("Failed to update task:", error);
        return null;
      }
    },
    [applyTasksUpdate]
  );

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;

      if (!over) return;

      const taskId = active.id;
      const newStatus = over.id;

      const existingTask = tasksRef.current.find((task) => task.id === taskId);
      if (!existingTask || existingTask.status === newStatus) {
        return;
      }

      const previousStatus = existingTask.status;

      applyTasksUpdate((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        )
      );

      updateTask(taskId, { status: newStatus }).then((updated) => {
        if (!updated) {
          applyTasksUpdate((prevTasks) =>
            prevTasks.map((task) =>
              task.id === taskId ? { ...task, status: previousStatus } : task
            )
          );
        }
      });
    },
    [applyTasksUpdate, updateTask]
  );

  const tasksByStatus = useMemo(() => {
    const mapping = COLUMNS.reduce((acc, { id }) => {
      acc[id] = [];
      return acc;
    }, {});

    for (const task of tasks) {
      const targetStatus =
        task.status && Object.prototype.hasOwnProperty.call(mapping, task.status)
          ? task.status
          : "TODO";
      mapping[targetStatus].push(task);
    }

    return mapping;
  }, [tasks]);

  const handleColumnAddTask = useCallback(
    (columnId, taskInput) => addTask({ ...taskInput, status: columnId }),
    [addTask]
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchTasksFromDb(controller.signal)
      .then((fetchedTasks) => {
        applyTasksUpdate(Array.isArray(fetchedTasks) ? fetchedTasks : []);
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          console.error("Failed to fetch tasks from database:", error);
        }
      });

    return () => controller.abort();
  }, [applyTasksUpdate, fetchTasksFromDb]);

  return (
    <div className="p-8 mt-5">
      <h1 className="text-white font-bold text-center text-3xl">Task Flow</h1>
      <div className="flex grid grid-cols-1 md:grid-cols-3 items-center justify-around gap-8">
        <DndContext onDragEnd={handleDragEnd}>
          {COLUMNS.map((column) => (
            <Columns
              key={column.id}
              column={column}
              addTask={(taskInput) => handleColumnAddTask(column.id, taskInput)}
              deleteTask={deleteTask}
              updateTask={updateTask}
              tasks={tasksByStatus[column.id] || []}
              showInput={column.id === "TODO"}
              // updateTaskPriority={updateTaskPriority}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
};

export default TaskFlow;
