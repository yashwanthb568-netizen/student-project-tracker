
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#project-form');
    const nameInput = document.querySelector('#name');
    const statusInput = document.querySelector('#status');
    const list = document.querySelector('#project-list');
    const emptyState = document.querySelector('#empty-state');
    const saveButton = document.querySelector('#save-button');
    const cancelButton = document.querySelector('#cancel-button');

    // Projects stay in memory and clear when the page refreshes.
    const projects = [];

    let editingId = null;
    let counter = 0;

    const addLabel = saveButton.textContent;

    // Prepare the Cancel edit button.
    cancelButton.type = 'button';
    cancelButton.hidden = true;

    // Create a unique ID for each new project.
    function createId() {
        if (
            window.crypto &&
            typeof window.crypto.randomUUID === 'function'
        ) {
            return window.crypto.randomUUID();
        }

        counter += 1;
        return 'project-' + Date.now() + '-' + counter;
    }

    // Return the form to Add mode.
    function setAddMode() {
        editingId = null;
        form.reset();

        saveButton.textContent = addLabel;
        cancelButton.hidden = true;
    }

    // Load a project's values into the form for editing.
    function startEdit(id) {
        const project = projects.find((item) => item.id === id);

        if (!project) {
            return;
        }

        editingId = id;
        nameInput.value = project.name;
        statusInput.value = project.status;

        saveButton.textContent = 'Save changes';
        cancelButton.hidden = false;

        nameInput.focus();
    }

    // Display all projects.
    function render() {
        list.textContent = '';

        const itemTag =
            list.tagName === 'UL' || list.tagName === 'OL'
                ? 'li'
                : 'div';

        projects.forEach((project) => {
            const item = document.createElement(itemTag);
            item.dataset.id = project.id;

            const nameElement = document.createElement('strong');
            nameElement.textContent = project.name;

            const statusElement = document.createElement('span');
            statusElement.textContent = ' - ' + project.status + ' ';

            const editButton = document.createElement('button');
            editButton.type = 'button';
            editButton.textContent = 'Edit';

            editButton.addEventListener('click', () => {
                startEdit(project.id);
            });

            item.appendChild(nameElement);
            item.appendChild(statusElement);
            item.appendChild(editButton);

            list.appendChild(item);
        });

        if (emptyState) {
            emptyState.hidden = projects.length > 0;
        }
    }

    // One submit listener handles both adding and editing.
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = nameInput.value.trim();
        const status = statusInput.value;

        // Do not accept an empty project name.
        if (name === '') {
            nameInput.focus();
            nameInput.setCustomValidity(
                'Please enter a project name.'
            );
            nameInput.reportValidity();
            return;
        }

        nameInput.setCustomValidity('');

        if (editingId === null) {
            // Add a new project.
            projects.push({
                id: createId(),
                name: name,
                status: status
            });
        } else {
            // Update the selected project without changing its ID.
            const project = projects.find(
                (item) => item.id === editingId
            );

            if (project) {
                project.name = name;
                project.status = status;
            }
        }

        render();
        setAddMode();
        nameInput.focus();
    });

    // Cancel editing without changing the original project.
    cancelButton.addEventListener('click', () => {
        nameInput.setCustomValidity('');
        setAddMode();
    });

    // Clear validation feedback when the user changes the name.
    nameInput.addEventListener('input', () => {
        nameInput.setCustomValidity('');
    });

    // Show the initial empty project list.
    render();
});
