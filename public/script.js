const form = document.querySelector('#project-form');
const nameInput = document.querySelector('#name');
const statusInput = document.querySelector('#status');
const projectList = document.querySelector('#project-list');
const emptyState = document.querySelector('#empty-state');
const saveButton = document.querySelector('#save-button');
const cancelButton = document.querySelector('#cancel-button');

const STORAGE_KEY = 'workshop-projects-v1';

function loadProjects() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(item =>
      item && item.id !== undefined &&
      typeof item.name === 'string' &&
      typeof item.status === 'string'
    );
  } catch (error) {
    console.error('Could not read saved projects:', error);
    return [];
  }
}

function saveProjects() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Could not save projects:', error);
  }
}

const projects = loadProjects();
let editingId = null;

function createId() {
  if (window.crypto && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return String(Date.now()) + Math.random().toString(16).slice(2);
}

function resetForm() {
  form.reset();
  editingId = null;
  saveButton.textContent = 'Save Project';
  cancelButton.hidden = true;
  nameInput.setCustomValidity('');
}

function renderProjects() {
  projectList.replaceChildren();

  projects.forEach(project => {
    const listItem = document.createElement('li');
    const projectName = document.createElement('span');
    const projectStatus = document.createElement('span');
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');

    projectName.textContent = project.name;
    projectStatus.textContent = ` — ${project.status}`;

    editButton.type = 'button';
    editButton.textContent = 'Edit';

    editButton.addEventListener('click', () => {
      editingId = project.id;
      nameInput.value = project.name;
      statusInput.value = project.status;
      saveButton.textContent = 'Save changes';
      cancelButton.hidden = false;
      nameInput.setCustomValidity('');
      nameInput.focus();
    });

    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';

    deleteButton.addEventListener('click', () => {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${project.name}"?`
      );

      if (!confirmed) {
        return;
      }

      const projectIndex = projects.findIndex(
        item => item.id === project.id
      );

      if (projectIndex === -1) {
        return;
      }

      projects.splice(projectIndex, 1);

      if (editingId === project.id) {
        resetForm();
      }

      saveProjects();
      renderProjects();
    });

    listItem.append(
      projectName,
      projectStatus,
      document.createTextNode(' '),
      editButton,
      document.createTextNode(' '),
      deleteButton
    );

    projectList.appendChild(listItem);
  });

  if (emptyState) {
    emptyState.hidden = projects.length > 0;
  }
}

form.addEventListener('submit', event => {
  event.preventDefault();

  const name = nameInput.value.trim();
  const status = statusInput.value;

  if (!name) {
    nameInput.setCustomValidity('Please enter a project name.');
    nameInput.reportValidity();

    nameInput.addEventListener(
      'input',
      () => nameInput.setCustomValidity(''),
      { once: true }
    );

    return;
  }

  if (editingId) {
    const project = projects.find(item => item.id === editingId);

    if (project) {
      project.name = name;
      project.status = status;
    }
  } else {
    projects.push({
      id: createId(),
      name,
      status
    });
  }

  saveProjects();
  renderProjects();
  resetForm();
});

cancelButton.addEventListener('click', () => {
  resetForm();
});

renderProjects();