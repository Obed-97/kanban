const API_URL = 'http://localhost:3001/tasks';

// Récupérer toutes les tâches
export const getTasks = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des tâches');
    }
    const tasks = await response.json();
    
    return tasks.map(task => ({
      ...task,
      id: typeof task.id === 'string' ? parseInt(task.id, 10) || task.id : task.id
    }));
  } catch (error) {
    console.error('Erreur getTasks:', error);
    throw error;
  }
};

// Récupérer une tâche par ID
export const getTaskById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error('Tâche non trouvée');
    }
    const task = await response.json();
    
    return {
      ...task,
      id: typeof task.id === 'string' ? parseInt(task.id, 10) || task.id : task.id
    };
  } catch (error) {
    console.error('Erreur getTaskById:', error);
    throw error;
  }
};


export const createTask = async (taskData) => {
  try {
    
    const allTasks = await fetch(API_URL).then(res => res.json());
    
    
    const maxId = allTasks.reduce((max, task) => {
      const numId = typeof task.id === 'number' ? task.id : parseInt(task.id, 10);
      return !isNaN(numId) && numId > max ? numId : max;
    }, 0);
    
    const newId = maxId + 1;
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: newId, 
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        createdAt: new Date().toISOString()
      }),
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la création de la tâche');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur createTask:', error);
    throw error;
  }
};

// Mettre à jour une tâche
export const updateTask = async (id, taskData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...taskData,
        id: id 
      }),
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour de la tâche');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Erreur updateTask:', error);
    throw error;
  }
};

// Supprimer une tâche
export const deleteTask = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de la tâche');
    }
    
    return true;
  } catch (error) {
    console.error('Erreur deleteTask:', error);
    throw error;
  }
};