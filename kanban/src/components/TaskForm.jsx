import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const TaskSchema = Yup.object().shape({
  title: Yup.string()
    .min(15, 'Le titre doit contenir au moins 15 caractères')
    .max(30, 'Le titre ne peut pas dépasser 50 caractères')
    .required('Le titre est obligatoire'),
  description: Yup.string()
    .max(200, 'La description ne peut pas dépasser 200 caractères'),
  status: Yup.string()
    .oneOf(['todo', 'inProgress', 'done'], 'Statut invalide')
    .required('Le statut est obligatoire')
});

export default function TaskForm({ onSubmit, initialData = null, onCancel }) {
  const initialValues = {
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'todo'
  };

  const handleSubmit = (values, { resetForm }) => {
    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      status: values.status
    });

    if (!initialData) {
      resetForm();
    }
  };

  return (
    <div className="card form-card">
      <div className="card-body p-4">
        <h5 className="form-title d-flex align-items-center">
          <i className={`bi ${initialData ? 'bi-pencil-square' : 'bi-plus-circle'} me-2`}></i>
          {initialData ? 'Modifier la tâche' : 'Nouvelle tâche'}
        </h5>

        <Formik
          initialValues={initialValues}
          validationSchema={TaskSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ errors, touched, isValid, dirty }) => (
            <Form>
              {/* Champ Titre */}
              <div className="mb-3">
                <label htmlFor="title" className="form-label">
                  Titre <span className="text-danger">*</span>
                </label>
                <Field
                    id="title"
                    name="title"
                    type="text"
                    placeholder="Entrez le titre de la tâche"
                    className={`form-control ${
                      touched.title 
                        ? errors.title 
                          ? 'is-invalid' 
                          : 'is-valid' 
                        : ''
                    }`}
                  />
                <ErrorMessage name="title">
                  {msg => <div className="invalid-feedback">{msg}</div>}
                </ErrorMessage>
              </div>

              {/* Champ Description */}
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  placeholder="Ajoutez une description (optionnel)"
                  rows="3"
                  className={`form-control ${
                    touched.description 
                      ? errors.description 
                        ? 'is-invalid' 
                        : 'is-valid' 
                      : ''
                  }`}
                />
                <ErrorMessage name="description">
                  {msg => <div className="invalid-feedback">{msg}</div>}
                </ErrorMessage>
              </div>

              {/* Champ Statut */}
              <div className="mb-4">
                <label htmlFor="status" className="form-label">
                  Statut
                </label>
                <Field
                  as="select"
                  id="status"
                  name="status"
                  className="form-select"
                >
                  <option value="todo">À faire</option>
                  <option value="inProgress">En cours</option>
                  <option value="done">Terminé</option>
                </Field>
              </div>

              {/* Boutons avec btn-sm */}
             <div className="d-flex gap-2 pt-3 border-top">
                <button
                  type="submit"
                  disabled={initialData ? !isValid : (!isValid || !dirty)}
                  className="btn btn-outline-secondary btn-sm"
                  title={!isValid || !dirty ? 'Veuillez remplir le formulaire correctement' : ''}
                >
                  <i className={`bi ${initialData ? 'bi-check-lg' : 'bi-plus-lg'} me-1`}></i>
                  {initialData ? 'Enregistrer' : 'Ajouter'}
                </button>
                
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="btn btn-outline-secondary btn-sm"
                  >
                    <i className="bi bi-x-lg me-1"></i>
                    Annuler
                  </button>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}