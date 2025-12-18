import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Task({ task, onEdit, onDelete, onDragStart }) {
  const navigate = useNavigate();

  
  const handleCardClick = (e) => {
    
    if (e.target.closest('button')) {
      return;
    }
    
    console.log('Navigation vers détails de la tâche:', task.id);
    navigate(`/task/${task.id}`);
  };

  
  const handleEdit = (e) => {
    e.stopPropagation(); 
    console.log('Modification de la tâche:', task.id, task);
    onEdit(task); 
  };

 
  const handleDelete = (e) => {
    e.stopPropagation(); 
    console.log('Suppression de la tâche:', task.id);
    onDelete(task.id); 
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
              onClick={handleEdit}
              className="btn btn-task-action btn-task-edit"
              title="Modifier"
              type="button"
            >
              <i className="bi bi-pencil"></i>
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-task-action btn-task-delete"
              title="Supprimer"
              type="button"
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