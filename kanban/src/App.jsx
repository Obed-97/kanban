import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import KanbanBoard from './components/KanbanBoard';
import TaskForm from './components/TaskForm';
import TaskDetail from './components/TaskDetail';
import SearchFilter from './components/SearchFilter';
import * as taskService from './services/taskService';
import logoUrl from './assets/kanban_logo.svg';


const isSameId = (id1, id2) => {
  return String(id1) === String(id2);
};


const filterTasks = (tasks, searchTerm, statusFilter) => {
  return tasks.filter(task => {
    
    const matchesSearch = !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
};

// Composant principal App
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(null);
  
  // États pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      console.log('📋 Tâches chargées:', data);
      setTasks(data);
      return data;
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
      alert('Erreur lors du chargement. Vérifiez que json-server est démarré.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      console.log('➕ Création tâche:', taskData);
      await taskService.createTask(taskData);
      await loadTasks();
    } catch (error) {
      console.error('❌ Erreur création:', error);
      throw error;
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      console.log('✏️ Mise à jour tâche ID:', taskId, taskData);
      
      // Récupérer la tâche actuelle
      const currentTask = await taskService.getTaskById(taskId);
      
      if (!currentTask) {
        throw new Error('Tâche introuvable sur le serveur');
      }

      // Créer l'objet complet à envoyer
      const updatedTaskData = {
        id: currentTask.id,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        createdAt: currentTask.createdAt
      };

      // Mettre à jour sur le serveur
      await taskService.updateTask(taskId, updatedTaskData);
      
      // Recharger toutes les tâches
      await loadTasks();
    } catch (error) {
      console.error('❌ Erreur mise à jour:', error);
      alert('Erreur lors de la mise à jour : ' + error.message);
      throw error;
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      return;
    }

    try {
      console.log('🗑️ Suppression tâche ID:', taskId);
      await taskService.deleteTask(taskId);
      
      // Recharger toutes les tâches
      await loadTasks();
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
      alert('Erreur lors de la suppression : ' + error.message);
      throw error;
    }
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.5';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const columnElement = e.currentTarget.closest('.card-body');
    if (columnElement) {
      const columnStatus = columnElement.parentElement.className.match(/column-(\w+)/)?.[1];
      if (columnStatus) setIsDraggingOver(columnStatus);
    }
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    setIsDraggingOver(null);
    
    if (draggedTask && draggedTask.status !== newStatus) {
      const updatedTask = { 
        ...draggedTask, 
        status: newStatus 
      };
      
      // Mise à jour optimiste (utiliser isSameId pour la comparaison)
      setTasks(tasks.map(task => 
        isSameId(task.id, draggedTask.id) ? updatedTask : task
      ));
      
      try {
        await taskService.updateTask(draggedTask.id, updatedTask);
        console.log('✅ Drag & drop réussi');
      } catch (error) {
        console.error('❌ Erreur drag & drop:', error);
        alert('Erreur lors du déplacement de la tâche');
        await loadTasks();
      }
    }
    
    setDraggedTask(null);
    document.querySelectorAll('[draggable="true"]').forEach(el => el.style.opacity = '1');
  };

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <header className="mb-5">
        <div className="text-center mb-4">
            <img src={logoUrl} alt="Logo" width={300} />
          <p className="text-muted">Gérez vos tâches efficacement</p>
        </div>
      </header>

      <main>
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                tasks={tasks}
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                onDelete={handleDeleteTask} 
                onDragStart={handleDragStart} 
                onDragOver={handleDragOver} 
                onDrop={handleDrop} 
                isDraggingOver={isDraggingOver} 
              />
            } 
          />
          <Route 
            path="/new" 
            element={<NewPage onCreateTask={handleCreateTask} />} 
          />
          <Route 
            path="/edit/:id" 
            element={<EditPage onUpdateTask={handleUpdateTask} />} 
          />
          <Route 
            path="/task/:id" 
            element={<DetailPage tasks={tasks} onDelete={handleDeleteTask} />} 
          />
        </Routes>
      </main>
    </div>
  );
}

// Page d'accueil
function HomePage({ 
  tasks, 
  searchTerm, 
  onSearchChange, 
  statusFilter, 
  onStatusFilterChange,
  onDelete, 
  onDragStart, 
  onDragOver, 
  onDrop, 
  isDraggingOver 
}) {
  const navigate = useNavigate();

  // Filtrer les tâches selon la recherche et le statut
  const filteredTasks = filterTasks(tasks, searchTerm, statusFilter);

  const handleDelete = async (taskId) => {
    try {
      await onDelete(taskId);
    } catch (error) {
      console.error('❌ Erreur HomePage.handleDelete:', error);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button onClick={() => navigate('/new')} className="btn btn-primary btn-create-task">
          <i className="bi bi-plus-circle me-2"></i>
          Nouvelle tâche
        </button>
        
        <div className="text-muted">
          <i className="bi bi-kanban me-2"></i>
          <strong>{tasks.length}</strong> tâche{tasks.length > 1 ? 's' : ''} au total
        </div>
      </div>

      {/* Composant de recherche et filtrage */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={onStatusFilterChange}
        taskCount={filteredTasks.length}
      />

      {/* Message si aucune tâche du tout - SUPPRIMÉ, on affiche toujours les colonnes */}

      {/* Tableau Kanban - Toujours afficher, même sans tâches */}
      <KanbanBoard 
        tasks={filteredTasks}
        allTasks={tasks}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        onResetFilters={() => {
          onSearchChange('');
          onStatusFilterChange('all');
        }}
        onEdit={(task) => navigate(`/edit/${task.id}`)}
        onDelete={handleDelete}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        isDraggingOver={isDraggingOver}
      />
    </div>
  );
}

// Page nouvelle tâche
function NewPage({ onCreateTask }) {
  const navigate = useNavigate();

  const handleSubmit = async (taskData) => {
    try {
      await onCreateTask(taskData);
      navigate('/');
    } catch (error) {
      console.error('❌ Erreur NewPage.handleSubmit:', error);
    }
  };

  return (
    <div className="row">
      <div className="col-lg-8 col-xl-6 mx-auto">
        <div className="mb-3">
          <button onClick={() => navigate('/')} className="btn btn-link text-decoration-none p-0">
            <i className="bi bi-arrow-left me-2"></i>
            Retour au tableau
          </button>
        </div>
        <TaskForm onSubmit={handleSubmit} onCancel={() => navigate('/')} />
      </div>
    </div>
  );
}

// Page édition
function EditPage({ onUpdateTask }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        console.log('📥 Chargement tâche pour édition, ID:', id);
        const data = await taskService.getTaskById(id);
        setTask(data);
      } catch (error) {
        console.error('❌ Erreur chargement tâche pour édition:', error);
        alert('Tâche non trouvée : ' + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async (taskData) => {
    try {
      await onUpdateTask(id, taskData);
      navigate('/');
    } catch (error) {
      console.error('❌ Erreur EditPage.handleSubmit:', error);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
        <h2 className="mt-3">Tâche non trouvée</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary-action mt-3">
          Retour au tableau
        </button>
      </div>
    );
  }

  return (
    <div className="row">
      <div className="col-lg-8 col-xl-6 mx-auto">
        <div className="mb-3">
          <button onClick={() => navigate('/')} className="btn btn-link text-decoration-none p-0">
            <i className="bi bi-arrow-left me-2"></i>
            Retour au tableau
          </button>
        </div>
        <TaskForm initialData={task} onSubmit={handleSubmit} onCancel={() => navigate('/')} />
      </div>
    </div>
  );
}

// Page détail
function DetailPage({ tasks, onDelete }) {
  const { id } = useParams();
  const navigate = useNavigate();
  
  console.log('🔍 Recherche tâche ID:', id, 'dans', tasks.length, 'tâches');
  
  // Utiliser isSameId pour la comparaison flexible
  const task = tasks.find(t => isSameId(t.id, id));

  if (!task) {
    console.log('❌ Tâche non trouvée. IDs disponibles:', tasks.map(t => t.id));
  } else {
    console.log('✅ Tâche trouvée:', task);
  }

  const handleDelete = async () => {
    try {
      await onDelete(id);
      navigate('/');
    } catch (error) {
      console.error('❌ Erreur DetailPage.handleDelete:', error);
    }
  };

  if (!task) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
        <h2 className="mt-3">Tâche non trouvée</h2>
        <p className="text-muted">ID recherché : {id}</p>
        <button onClick={() => navigate('/')} className="btn btn-primary-action mt-3">
          Retour au tableau
        </button>
      </div>
    );
  }

  return (
    <TaskDetail 
      task={task}
      onEdit={() => navigate(`/edit/${task.id}`)}
      onDelete={handleDelete}
      onBack={() => navigate('/')}
    />
  );
}