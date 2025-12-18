import React from 'react';

export default function SearchFilter({ 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  taskCount 
}) {
  return (
    <div className="card mb-4">
      <div className="card-body p-3">
        <div className="row g-3 align-items-center">
          {/* Barre de recherche */}
          <div className="col-md-7 col-lg-8">
            <div className="input-group">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Rechercher une tâche..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => onSearchChange('')}
                  title="Effacer la recherche"
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>
          </div>

          {/* Filtre par statut */}
          <div className="col-md-5 col-lg-4">
            <div className="d-flex align-items-center gap-2">
              <select
                className="form-select flex-grow-1"
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="todo">À faire</option>
                <option value="inProgress">En cours</option>
                <option value="done">Terminé</option>
              </select>
              
              {/* Compteur de résultats */}
              <small className="text-muted text-nowrap">
                <i className="bi bi-funnel me-1"></i>
                <strong>{taskCount}</strong>
              </small>
            </div>
          </div>
        </div>

        {/* Message si recherche active */}
        {(searchTerm || statusFilter !== 'all') && (
          <div className="mt-3 pt-3 border-top">
            <div className="d-flex align-items-center justify-content-between">
              <small className="text-muted">
                {searchTerm && (
                  <span>
                    <i className="bi bi-search me-1"></i>
                    Recherche : <strong>"{searchTerm}"</strong>
                  </span>
                )}
                {searchTerm && statusFilter !== 'all' && <span className="mx-2">•</span>}
                {statusFilter !== 'all' && (
                  <span>
                    <i className="bi bi-filter me-1"></i>
                    Statut : <strong>
                      {statusFilter === 'todo' && 'À faire'}
                      {statusFilter === 'inProgress' && 'En cours'}
                      {statusFilter === 'done' && 'Terminé'}
                    </strong>
                  </span>
                )}
              </small>
              <button
                className="btn btn-link btn-sm text-decoration-none p-0"
                onClick={() => {
                  onSearchChange('');
                  onStatusFilterChange('all');
                }}
              >
                <i className="bi bi-x-circle me-1"></i>
                Réinitialiser
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}