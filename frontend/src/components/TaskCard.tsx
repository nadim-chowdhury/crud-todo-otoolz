// "use client";

// import React from "react";
// import { Draggable } from "react-beautiful-dnd";

// interface TaskCardProps {
//   taskId: string;
//   content: string;
//   index: number;
// }

// const TaskCard: React.FC<TaskCardProps> = ({ taskId, content, index }) => {
//   return (
//     <Draggable draggableId={taskId} index={index}>
//       {(provided) => (
//         <div
//           ref={provided.innerRef}
//           {...provided.draggableProps}
//           {...provided.dragHandleProps}
//           className="bg-white p-4 rounded-md border"
//           style={{
//             ...provided.draggableProps.style,
//           }}
//         >
//           {content}
//         </div>
//       )}
//     </Draggable>
//   );
// };

// export default TaskCard;
