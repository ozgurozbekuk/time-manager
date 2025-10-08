import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState } from "react";

export function Columns({
  column,
  tasks,
  showInput,
  addTask,
  deleteTask,
  updateTask,
}) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [priority, setPriority] = useState("low");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTask = async () => {
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const taskDescription = desc.trim() ? desc : "No description";
      const createdTask = await addTask({
        title: title.trim(),
        description: taskDescription,
        priority,
      });

      if (createdTask) {
        setTitle("");
        setDesc("");
        setPriority("low");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const { setNodeRef } = useDroppable({
    id: column.id,
  });

  // const handlePriorityChange = (event) => {
  //   setPriority(event.target.value);
  // }

  return (
    <div className="flex min-w-full flex-col h-[80vh] m-5 rounded-lg border border-gray-500 relative bg-gray-800 p-5">
      <h2 className="mb-4 font-semibold text-neutral-100">{column.title}</h2>

      {showInput && (
        <div className="flex flex-wrap items-center justify-center gap-2 mt-2 mb-4">
          <input
            type="text"
            name="title"
            placeholder="Add Title"
            className="w-full sm:flex-[1_1_160px] min-w-0 rounded-md border-2 border-gray-700 bg-gray-700 px-2 py-1 text-white shadow-lg outline-none focus:border-primary-500"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />

          <input
            type="text"
            name="desc"
            placeholder="Add Description"
            className="w-full sm:flex-[2_1_260px] min-w-0 rounded-md border-2 border-gray-700 bg-gray-700 px-2 py-1 text-white shadow-lg outline-none focus:border-primary-500"
            onChange={(e) => setDesc(e.target.value)}
            value={desc}
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full sm:flex-[0_0_110px] min-w-0 rounded-md border-2 border-gray-700 bg-gray-700 px-2 py-1 text-white shadow-lg outline-none focus:border-primary-500"
          >
            <option value="low">Low</option>
            <option value="mid">Mid</option>
            <option value="high">High</option>
          </select>

          <button
            className="w-full sm:flex-[0_0_44px] rounded-md bg-gradient-to-r from-primary-500 to-primary-700 py-2 font-semibold text-white cursor-pointer hover:opacity-50 disabled:from-gray-700 disabled:to-gray-700 disabled:text-white disabled:opacity-50"
            onClick={handleAddTask}
            disabled={isSubmitting || !title.trim()}
          >
            <AddCircleOutlineIcon />
          </button>
        </div>
      )}

      <div
        ref={setNodeRef}
        className="flex flex-1 overflow-y-auto flex-col gap-4"
      >
        {tasks.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            deleteTask={deleteTask}
            updateTask={updateTask}
          />
        ))}
      </div>
    </div>
  );
}
