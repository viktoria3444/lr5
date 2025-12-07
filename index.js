// Отримуємо елементи
const newTaskInput = document.getElementById('newTaskInput');
const taskList = document.getElementById('taskList');
const allTasksBtn = document.getElementById('allTasks');
const activeTasksBtn = document.getElementById('activeTasks');
const completedTasksBtn = document.getElementById('completedTasks');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Функція для рендеру завдань
function renderTasks(filter = 'all') {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        if (filter === 'active' && task.completed) return;
        if (filter === 'completed' && !task.completed) return;

        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        
        const span = document.createElement('span');
        span.textContent = `${task.text} (${task.date})`;
        span.addEventListener('dblclick', () => editTask(index, span));
        
        if (!task.completed) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.addEventListener('change', () => completeTask(index));
            li.appendChild(checkbox);
        }
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✖';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteTask(index));
        
        li.appendChild(span);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

// Додавання нового завдання
newTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && newTaskInput.value.trim() !== '') {
        const date = new Date();
        const formattedDate = `${date.toLocaleDateString()}, ${date.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`;
        tasks.push({text: newTaskInput.value.trim(), date: formattedDate, completed: false});
        newTaskInput.value = '';
        saveTasks();
        renderTasks();
    }
});

// Редагування завдання
function editTask(index, span) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = tasks[index].text;
    span.replaceWith(input);
    input.focus();
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            tasks[index].text = input.value.trim();
            saveTasks();
            renderTasks();
        }
    });
}

// Позначити як виконане
function completeTask(index) {
    tasks[index].completed = true;
    saveTasks();
    renderTasks();
}

// Видалення завдання
function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

// Збереження у localStorage
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Фільтри
allTasksBtn.addEventListener('click', () => renderTasks('all'));
activeTasksBtn.addEventListener('click', () => renderTasks('active'));
completedTasksBtn.addEventListener('click', () => renderTasks('completed'));

// Перший рендер
renderTasks();
