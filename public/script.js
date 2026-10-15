const form = document.querySelector('#project-form');
const nameInput = document.querySelector('#name');
const statusInput = document.querySelector('#status');
const projectList = document.querySelector('#project-list');
const emptyState = document.querySelector('#empty-state');
const saveButton = document.querySelector('#save-button');
const cancelButton = document.querySelector('#cancel-button');

const projects = [];
let editingId = null;

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

    listItem.append(
      projectName,
      projectStatus,
      document.createTextNode(' '),
      editButton
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

  nameInput.setCustomValidity('');

  if (editingId !== null) {
    const project = projects.find(item => item.id === editingId);

    if (project) {
      project.name = name;
      project.status = status;
    }
  } else {
    projects.push({
      id: crypto.randomUUID(),
      name: name,
      status: status
    });
  }

  renderProjects();
  resetForm();
});

cancelButton.addEventListener('click', () => {
  resetForm();
});