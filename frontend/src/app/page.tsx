"use client";

import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import {
  fetchTasks,
  createTask,
  updateTaskById,
  deleteTaskById,
} from "@/utils/apiClient";
import { FiEdit, FiTrash2 } from "react-icons/fi"; // Add these icon imports
import Modal from "@/components/Modal"; // Assuming you have a modal component or create one as shown below

interface Task {
  id: string;
  content: string;
  description: string;
}

interface Column {
  id: string;
  title: string;
  items: Task[];
}

interface TaskList {
  [key: string]: Column;
}

interface APITask {
  _id: string;
  title: string;
  description: string;
  status: string;
}

const Home = () => {
  const [columns, setColumns] = useState<TaskList>({
    "To Do": { id: "To Do", title: "To Do", items: [] },
    "In Progress": { id: "In Progress", title: "In Progress", items: [] },
    Done: { id: "Done", title: "Done", items: [] },
  });
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<APITask | null>(null);
  const [newTask, setNewTask] = useState({ title: "", description: "" });

  // Fetch initial tasks when component mounts
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const tasks: APITask[] = await fetchTasks();
        const updatedColumns: TaskList = {
          "To Do": { id: "To Do", title: "To Do", items: [] },
          "In Progress": { id: "In Progress", title: "In Progress", items: [] },
          Done: { id: "Done", title: "Done", items: [] },
        };

        tasks.forEach((task: APITask) => {
          // Map task status to corresponding columns
          if (updatedColumns[task.status]) {
            updatedColumns[task.status].items.push({
              id: task._id,
              content: task.title,
              description: task.description,
            });
          }
        });

        setColumns(updatedColumns);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    loadTasks();
  }, []);

  // Handle Drag and Drop
  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      console.log("No destination provided");
      return;
    }

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = Array.from(sourceColumn.items);
      const destItems = Array.from(destColumn.items);

      // Remove the dragged item from the source column
      const [removed] = sourceItems.splice(source.index, 1);
      // Add the dragged item to the destination column at the correct index
      destItems.splice(destination.index, 0, removed);

      // Update state immutably
      const updatedColumns = {
        ...columns,
        [source.droppableId]: { ...sourceColumn, items: sourceItems },
        [destination.droppableId]: { ...destColumn, items: destItems },
      };

      setColumns(updatedColumns);

      // Update task status in backend
      try {
        await updateTaskById(removed.id, {
          title: removed.content,
          description: removed.description,
          status: destination.droppableId,
        });
      } catch (error) {
        console.error("Error updating task:", error);
      }
    } else {
      // Handle reordering within the same column
      const column = columns[source.droppableId];
      const copiedItems = Array.from(column.items);
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);

      setColumns((prevColumns) => ({
        ...prevColumns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      }));
    }
  };

  // Handle task creation
  const handleTaskCreate = async () => {
    if (!newTask.title) return;
    try {
      const createdTask = await createTask(newTask);
      setColumns((prev) => ({
        ...prev,
        "To Do": {
          ...prev["To Do"],
          items: [
            ...prev["To Do"].items,
            {
              id: createdTask._id,
              content: createdTask.title,
              description: createdTask.description,
            },
          ],
        },
      }));
      setShowModal(false);
      setNewTask({ title: "", description: "" });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Handle task edit
  const handleTaskEdit = (task: APITask) => {
    setEditingTask(task);
    setNewTask({ title: task.title, description: task.description });
    setShowModal(true);
  };

  const handleTaskUpdate = async () => {
    if (editingTask && newTask.title) {
      try {
        await updateTaskById(editingTask._id, {
          ...newTask,
          status: editingTask.status,
        });
        setColumns((prev) => {
          const updatedColumn = prev[editingTask.status];
          const updatedItems = updatedColumn.items.map((item) =>
            item.id === editingTask._id
              ? {
                  ...item,
                  content: newTask.title,
                  description: newTask.description,
                }
              : item
          );

          return {
            ...prev,
            [editingTask.status]: { ...updatedColumn, items: updatedItems },
          };
        });
        setShowModal(false);
        setEditingTask(null);
        setNewTask({ title: "", description: "" });
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  // Handle task deletion
  const handleTaskDelete = async (taskId: string, status: string) => {
    try {
      await deleteTaskById(taskId);
      setColumns((prev) => {
        const updatedItems = prev[status].items.filter(
          (item) => item.id !== taskId
        );
        return {
          ...prev,
          [status]: { ...prev[status], items: updatedItems },
        };
      });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between p-8">
        <h1 className="text-3xl font-bold capitalize">Task MGT</h1>

        <button
          onClick={() => setShowModal(true)}
          className="mb-4 p-2 bg-blue-500 text-white rounded"
        >
          Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex justify-center gap-6 px-8">
          {Object.entries(columns).map(([columnId, column]) => (
            <Droppable
              droppableId={columnId}
              key={columnId}
              direction="vertical"
            >
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="bg-blue-50 rounded-lg w-full h-[75vh] overflow-y-scroll p-4 border flex flex-col space-y-4"
                >
                  <h2 className="text-xl font-semibold mb-4">{column.title}</h2>
                  {column.items.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white p-4 mb-2 rounded-md border flex justify-between items-center"
                          style={{ ...provided.draggableProps.style }}
                        >
                          <div>
                            <div className="font-semibold">{task.content}</div>
                            <div className="text-sm text-gray-500">
                              {task.description}
                            </div>
                          </div>
                          <div className="flex">
                            <button
                              onClick={() =>
                                handleTaskEdit({
                                  _id: task.id,
                                  title: task.content,
                                  description: task.description,
                                  status: columnId,
                                })
                              }
                              className="p-2 rounded-full hover:bg-blue-100"
                            >
                              <FiEdit className="text-blue-500" />
                            </button>
                            <button
                              onClick={() =>
                                handleTaskDelete(task.id, columnId)
                              }
                              className="p-2 rounded-full hover:bg-red-100"
                            >
                              <FiTrash2 className="text-red-500" />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {showModal && (
        <Modal
          title={editingTask ? "Edit Task" : "Create Task"}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
            setNewTask({ title: "", description: "" });
          }}
          onSave={editingTask ? handleTaskUpdate : handleTaskCreate}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full border border-gray-300 rounded p-2"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Home;
