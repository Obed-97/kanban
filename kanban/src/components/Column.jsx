import React from 'react';
import Task from './Task';

export default function Column({ 
  title, 
  tasks, 
  status, 
  onEdit, 
  onDelete, 
  onDragStart, 
  onDragOver, 
  onDrop,
  isDraggingOver 
}) {
  const filteredTasks = tasks.filter(task => task.status === status);
  
  return (
    <div className="col-md-4 col-12 mb-3">
      <div className={`card h-100 column-${status}`}>
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fs-6">{title}</h5>
            <span className="badge bg-light text-dark border">
              {filteredTasks.length}
            </span>
          </div>
        </div>
        <div 
          className="card-body"
          onDragOver={onDragOver}
          onDrop={(e) => onDrop(e, status)}
          style={{ 
            minHeight: '400px',
            backgroundColor: isDraggingOver === status ? 'rgba(0, 0, 0, 0.02)' : 'transparent',
            transition: 'background-color 0.2s ease'
          }}
        >
          {filteredTasks.length === 0 ? (
            <p className="empty-state small">
              {isDraggingOver === status ? 'Déposer ici' : 'Aucune tâche'}
            </p>
          ) : (
            filteredTasks.map(task => (
              <Task 
                key={task.id} 
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onDragStart={onDragStart}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}