document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('#project-form');
  const nameInput = document.querySelector('#name');
  const statusInput = document.querySelector('#status');
  const list = document.querySelector('#project-list');
  const emptyState = document.querySelector('#empty-state');

  // Starts empty on every page load (no persistence yet)
  const projects = [];
  let counter = 0;

  function createId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    counter += 1;
    return 'project-' + Date.now() + '-' + counter;
  }

  function render() {
    // Clear everything, then rebuild from the array
    list.textContent = '';

    const itemTag = list.tagName === 'UL' || list.tagName === 'OL' ? 'li' : 'div';

    projects.forEach((project) => {
      const item = document.createElement(itemTag);
      item.dataset.id = project.id;

      const nameEl = document.createElement('strong');
      nameEl.textContent = project.name;

      const statusEl = document.createElement('span');
      statusEl.textContent = ' - ' + project.status;

      item.appendChild(nameEl);
      item.appendChild(statusEl);
      list.appendChild(item);
    });

    if (emptyState) {
      emptyState.hidden = projects.length > 0;
    }
  }

  // The one and only submit listener
  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const status = statusInput.value;

    if (name === '') {
      nameInput.focus();
      return;
    }

    projects.push({ id: createId(), name: name, status: status });
    render();

    form.reset();
    nameInput.focus();
  });

  render();
});