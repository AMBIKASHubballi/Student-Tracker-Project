const form = document.querySelector('#project-form');
const nameInput = document.querySelector('#name');
const statusInput = document.querySelector('#status');
const projectList = document.querySelector('#project-list');
const emptyState = document.querySelector('#empty-state');
const saveButton = document.querySelector('#save-button');
const cancelButton = document.querySelector('#cancel-button');
const messageBox = document.querySelector('#message');

const API_URL = '/api/projects';
const UPDATE_METHOD = 'PUT'; // change to 'PATCH' if your app.js uses app.patch

let projects = [];
let editingId = null;

function showMessage(text) {
  if (messageBox) {
    messageBox.textContent = text;
  }
}

async function request(url, options) {
  const response = await fetch(url, options);

  if (!response.ok) {
    let detail = '';
    try {
      const data = await response.json();
      detail = data.error || data.message || '';
    } catch (error) {
      // response had no JSON body
    }
    throw new Error(detail || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return null;
  }

  try {
    return await response.json();
  } catch (error) {
    return null;
  }
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

    deleteButton.addEventListener('click', async () => {
      const confirmed = window.confirm(
        `Are you sure you want to delete "${project.name}"?`
      );

      if (!confirmed) {
        return;
      }

      try {
        await request(`${API_URL}/${project.id}`, { method: 'DELETE' });

        if (editingId === project.id) {
          resetForm();
        }

        await loadProjects();
        showMessage('Project deleted.');
      } catch (error) {
        showMessage(`Could not delete project: ${error.message}`);
      }
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

async function loadProjects() {
  showMessage('Loading projects...');

  try {
    const data = await request(API_URL);
    projects = Array.isArray(data) ? data : [];
    renderProjects();
    showMessage('');
  } catch (error) {
    projects = [];
    renderProjects();
    if (emptyState) {
      emptyState.hidden = true; // a failed load is not an empty database
    }
    showMessage(`Could not load projects: ${error.message}`);
  }
}

form.addEventListener('submit', async event => {
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

  const isEditing = editingId !== null;
  const url = isEditing ? `${API_URL}/${editingId}` : API_URL;
  const method = isEditing ? UPDATE_METHOD : 'POST';

  saveButton.disabled = true;

  try {
    await request(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, status })
    });

    resetForm();
    await loadProjects();
    showMessage(isEditing ? 'Project updated.' : 'Project added.');
  } catch (error) {
    showMessage(`Could not save project: ${error.message}`);
  } finally {
    saveButton.disabled = false;
  }
});

cancelButton.addEventListener('click', () => {
  resetForm();
});

loadProjects();