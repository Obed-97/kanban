import React from 'react';
import Column from './Column';

export default function KanbanBoard({ 
  tasks, 
  onEdit, 
  onDelete, 
  onDragStart, 
  onDragOver, 
  onDrop,
  isDraggingOver 
}) {
  const columns = [
    { id: 'todo', title: 'À faire', status: 'todo' },
    { id: 'inProgress', title: 'En cours', status: 'inProgress' },
    { id: 'done', title: 'Terminé', status: 'done' }
  ];

  return (
    <div className="row g-3">
      {columns.map(column => (
        <Column 
          key={column.id}
          title={column.title}
          tasks={tasks}
          status={column.status}
          onEdit={onEdit}
          onDelete={onDelete}
          onDragStart={onDragStart}
          onDragOver={onDragOver}
          onDrop={onDrop}
          isDraggingOver={isDraggingOver}
        />
      ))}
    </div>
  );
}