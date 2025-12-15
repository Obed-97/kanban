import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import KanbanBoard from './components/KanbanBoard';
import TaskForm from './components/TaskForm';
import TaskDetail from './components/TaskDetail';
import * as taskService from './services/taskService';

// Composant principal App
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState(null);
  const [isDraggingOver, setIsDraggingOver] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
      return data; // Retourner les données
    } catch (error) {
      console.error('Erreur chargement:', error);
      alert('Erreur lors du chargement. Vérifiez que json-server est démarré.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      await taskService.createTask(taskData);
      await loadTasks();
    } catch (error) {
      console.error('Erreur création:', error);
      throw error;
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      console.log('Mise à jour de la tâche ID:', taskId);
      
      // Récupérer directement la tâche depuis l'API
      const currentTask = await taskService.getTaskById(taskId);
      
      if (!currentTask) {
        throw new Error('Tâche introuvable sur le serveur');
      }

      console.log('Tâche trouvée:', currentTask);

      // Créer l'objet complet à envoyer
      const updatedTaskData = {
        id: taskId,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        createdAt: currentTask.createdAt
      };

      console.log('Envoi de la mise à jour:', updatedTaskData);

      // Mettre à jour sur le serveur
      await taskService.updateTask(taskId, updatedTaskData);
      
      console.log('Mise à jour réussie');

      // Recharger toutes les tâches
      await loadTasks();
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      throw error;
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      return;
    }

    try {
      console.log('Suppression de la tâche ID:', taskId);
      await taskService.deleteTask(taskId);
      console.log('Suppression réussie');
      
      // Recharger toutes les tâches
      await loadTasks();
    } catch (error) {
      console.error('Erreur suppression:', error);
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
      
      // Mise à jour optimiste
      setTasks(tasks.map(task => task.id === draggedTask.id ? updatedTask : task));
      
      try {
        await taskService.updateTask(draggedTask.id, updatedTask);
        console.log('Drag & drop réussi');
      } catch (error) {
        console.error('Erreur drag & drop:', error);
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
          <h1 className="mb-2">
            <i className="bi bi-kanban me-2"></i>
            Kanban Board
          </h1>
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
function HomePage({ tasks, onDelete, onDragStart, onDragOver, onDrop, isDraggingOver }) {
  const navigate = useNavigate();

  const handleDelete = async (taskId) => {
    try {
      await onDelete(taskId);
    } catch (error) {
      alert('Erreur lors de la suppression');
    }
  };

  return (
    <div>
      <div className="text-center mb-4">
        <button onClick={() => navigate('/new')} className="btn btn-primary-action">
          <i className="bi bi-plus-circle me-2"></i>
          Nouvelle tâche
        </button>
      </div>
      <KanbanBoard 
        tasks={tasks}
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
      alert('Erreur lors de la création');
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

// Page édition - SIMPLIFIÉE
function EditPage({ onUpdateTask }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const data = await taskService.getTaskById(Number(id));
        setTask(data);
      } catch (error) {
        console.error('Erreur chargement tâche:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async (taskData) => {
    try {
      await onUpdateTask(Number(id), taskData);
      navigate('/');
    } catch (error) {
      console.error('Erreur dans EditPage:', error);
      alert('Erreur lors de la mise à jour');
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
  const task = tasks.find(t => t.id === Number(id));

  const handleDelete = async () => {
    try {
      await onDelete(Number(id));
      navigate('/');
    } catch (error) {
      console.error('Erreur dans DetailPage:', error);
      alert('Erreur lors de la suppression');
    }
  };

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
    <TaskDetail 
      task={task}
      onEdit={() => navigate(`/edit/${task.id}`)}
      onDelete={handleDelete}
      onBack={() => navigate('/')}
    />
  );
}