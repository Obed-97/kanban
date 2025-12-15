import React from 'react';

export default function TaskDetail({ task, onEdit, onDelete, onBack }) {
  const statusConfig = {
    todo: {
      label: 'À faire',
      color: 'primary'
    },
    inProgress: {
      label: 'En cours',
      color: 'warning'
    },
    done: {
      label: 'Terminé',
      color: 'success'
    }
  };

  const status = statusConfig[task.status];

  return (
    <div className="row">
      <div className="col-lg-8 mx-auto">
        {/* Bouton retour */}
        <div className="mb-3">
          <button
            onClick={onBack}
            className="btn btn-link text-decoration-none p-0"
          >
            <i className="bi bi-arrow-left me-2"></i>
            Retour
          </button>
        </div>

        {/* Carte de détail sobre */}
        <div className="card">
          <div className="card-body p-4">
            {/* Titre */}
            <h2 className="h4 mb-3">{task.title}</h2>

            {/* Badge de statut coloré */}
            <div className="mb-3">
              <span className={`badge bg-${status.color}-subtle text-${status.color} border border-${status.color}`}>
                {status.label}
              </span>
            </div>

            {/* Description */}
            {task.description && (
              <div className="mb-3">
                <p className="text-muted mb-0">{task.description}</p>
              </div>
            )}

            {/* Date */}
            <div className="mb-4">
              <small className="text-muted">
                Créé le {new Date(task.createdAt).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </small>
            </div>

            {/* Boutons d'action */}
            <div className="d-flex gap-2 pt-3 border-top">
              <button
                onClick={onEdit}
                className="btn btn-outline-secondary btn-sm"
              >
                <i className="bi bi-pencil me-1"></i>
                Modifier
              </button>
              <button
                onClick={onDelete}
                className="btn btn-outline-danger btn-sm"
              >
                <i className="bi bi-trash me-1"></i>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}