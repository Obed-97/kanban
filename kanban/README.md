# Kanban App - React

Application Kanban développée avec React, Bootstrap et json-server.

## Étapes du projet

- [x] **Étape 1** : Initialisation - Affichage statique des tâches
- [x] **Étape 2** : Boutons Ajouter, Modifier, Supprimer avec Formik et Yup
- [x] **Étape 3** : Drag & Drop entre colonnes
- [x] **Étape 4** : Routage avec React Router
- [x] **Étape 5** : Communication avec json-server
- [ ] **Étape 6** : Filtrage et recherche

## Routes

- `/` → Tableau Kanban
- `/new` → Formulaire de création
- `/edit/:id` → Formulaire d'édition
- `/task/:id` → Détail d'une tâche

## Installation
```bash
npm install
```

## Lancement

### Option 1 : Deux terminaux séparés

Terminal 1 - Lancer json-server :
```bash
npm run server
```

Terminal 2 - Lancer l'application React :
```bash
npm run dev
```

### Option 2 : Lancer les deux en même temps (avec concurrently)
```bash
npm run dev:all
```

## API REST

json-server sera disponible sur `http://localhost:3001`

Endpoints disponibles :
- `GET /tasks` - Liste des tâches
- `GET /tasks/:id` - Détail d'une tâche
- `POST /tasks` - Créer une tâche
- `PUT /tasks/:id` - Modifier une tâche
- `DELETE /tasks/:id` - Supprimer une tâche

## Technologies utilisées

- React 18
- Vite
- Bootstrap 5
- Bootstrap Icons
- Formik
- Yup
- React Router DOM
- JSON Server
- HTML5 Drag & Drop API