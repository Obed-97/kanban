import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Task({ task, onEdit, onDelete, onDragStart }) {
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Ne pas naviguer si on clique sur un bouton
    if (e.target.closest('button')) {
      return;
    }
    navigate(`/task/${task.id}`);
  };

  return (
    <div 
      className="card task-card mb-2"
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onClick={handleCardClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="task-title mb-0 text-truncate flex-grow-1 me-2">
            {task.title}
          </h6>
          <div className="d-flex gap-1 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="btn btn-task-action btn-task-edit"
              title="Modifier"
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="btn btn-task-action btn-task-delete"
              title="Supprimer"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
        
        {task.description && (
          <p className="task-description mb-2 text-truncate">
            {task.description}
          </p>
        )}
        
        <div className="d-flex align-items-center task-date">
          <i className="bi bi-calendar3 me-1"></i>
          <small>
            {new Date(task.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </small>
        </div>
      </div>
    </div>
  );
}