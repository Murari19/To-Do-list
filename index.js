// Initialize tasks
function loadTasks() {
    const taskList = JSON.parse(localStorage.getItem('tasks') || '[]');
    taskList.forEach(task => addTaskToDOM(task));
}

function saveTasks() {
    const tasks = [];
    document.querySelectorAll('#tasks .task').forEach(task => {
        tasks.push({
            name: task.querySelector('.taskname').innerText,
            category: task.dataset.category,
            priority: task.dataset.priority,
            dueDate: task.dataset.dueDate,
            completed: task.classList.contains('completed'),
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTaskToDOM(task) {
    const taskHTML = `
        <div class="task ${task.priority}" 
             data-category="${task.category}" 
             data-priority="${task.priority}" 
             data-due-date="${task.dueDate}">
            <span class="taskname ${task.completed ? 'completed' : ''}">${task.name}</span>
            <span class="duedate">${task.dueDate || ''}</span>
            <button class="delete">X</button>
        </div>`;
    document.querySelector('#tasks').insertAdjacentHTML('beforeend', taskHTML);
    attachTaskEvents();
}

function attachTaskEvents() {
    document.querySelectorAll('.delete').forEach(btn => {
        btn.onclick = function () {
            this.parentElement.remove();
            saveTasks();
        };
    });
    document.querySelectorAll('.taskname').forEach(task => {
        task.onclick = function () {
            this.classList.toggle('completed');
            saveTasks();
        };
    });
}

// Dark/Light Mode Toggle
document.getElementById('toggleTheme').onclick = function () {
    const body = document.body;
    const isDarkMode = body.classList.contains('dark-mode');

    if (isDarkMode) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        this.textContent = 'Dark Mode';
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        this.textContent = 'Light Mode';
        localStorage.setItem('theme', 'dark');
    }
};

// Apply saved theme on page load
window.onload = function () {
    const savedTheme = localStorage.getItem('theme');
    const body = document.body;
    
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        document.getElementById('toggleTheme').textContent = 'Switch to Light Mode';
    } else {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
        document.getElementById('toggleTheme').textContent = 'Switch to Dark Mode';
    }
};

// Add task button click
document.querySelector('#addTask').onclick = function () {
    const taskName = document.querySelector('#taskInput').value;
    const category = document.querySelector('#category').value;
    const priority = document.querySelector('#priority').value;
    const dueDate = document.querySelector('#dueDate').value;

    if (!taskName) {
        alert("Please enter a task!");
        return;
    }

    const task = { name: taskName, category, priority, dueDate, completed: false };
    addTaskToDOM(task);
    saveTasks();
    document.querySelector('#taskInput').value = '';
};

// Filter tasks
document.querySelectorAll('#filters button').forEach(btn => {
    btn.onclick = function () {
        const filter = this.getAttribute('data-filter');
        document.querySelectorAll('#tasks .task').forEach(task => {
            task.style.display = filter === 'all' || task.dataset.category === filter ? 'block' : 'none';
        });
    };
});

// Load tasks on page load
loadTasks();
