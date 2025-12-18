import React from 'react';
import Column from './Column';

export default function KanbanBoard({ 
  tasks, 
  allTasks,
  searchTerm,
  statusFilter,
  onResetFilters,
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

  // Déterminer si des filtres sont actifs
  const hasActiveFilters = searchTerm !== '' || statusFilter !== 'all';

  // Vérifier s'il y a des résultats dans les colonnes visibles
  const hasVisibleTasks = columns.some(column => 
    tasks.filter(task => task.status === column.status).length > 0
  );

  return (
    <>
      {/* Message si aucun résultat avec filtres actifs */}
      {hasActiveFilters && !hasVisibleTasks && (
        <div className="text-center py-5 mb-4">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <h3 className="mt-3 text-muted">Aucune tâche trouvée</h3>
          <p className="text-muted">
            Essayez de modifier vos critères de recherche ou de filtrage
          </p>
          <button
            onClick={onResetFilters}
            className="btn btn-outline-secondary btn-sm"
          >
            <i className="bi bi-arrow-counterclockwise me-1"></i>
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* Colonnes Kanban */}
      <div className="row g-3">
        {columns.map(column => (
          <Column 
            key={column.id}
            title={column.title}
            tasks={tasks}
            allTasks={allTasks}
            status={column.status}
            hasActiveFilters={hasActiveFilters}
            onEdit={onEdit}
            onDelete={onDelete}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            isDraggingOver={isDraggingOver}
          />
        ))}
      </div>
    </>
  );
}