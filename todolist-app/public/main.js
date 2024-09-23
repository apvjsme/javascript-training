const API_URL = 'http://localhost:3000/api/tasks';

// Lấy tất cả các task từ server
const fetchTasks = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch tasks');
        }
        const tasks = await response.json();
        return tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
};

// Update the progress bar color based on completion percentage
const updateProgressBarColor = (percentage) => {
    const progressFill = document.getElementById('progressFill');
    if (percentage < 50) {
        progressFill.style.backgroundColor = 'red';  // Less than 50% complete
    } else if (percentage <= 75) {
        progressFill.style.backgroundColor = 'orange';  // Between 50-75% complete
    } else {
        progressFill.style.backgroundColor = 'green';  // More than 75% complete
    }
};

const renderTasks = async () => {
    const tasks = await fetchTasks();
    const taskList = document.getElementById('taskList');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const removeCheckedBtn = document.getElementById('removeCheckedBtn');

    let completedCount = 0;
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskStatus(task.id, checkbox.checked));
    
        const taskTitle = document.createElement('span');
        taskTitle.textContent = task.title;
        taskTitle.classList.add('task-title');
        if (task.completed) {
            taskTitle.style.textDecoration = 'line-through';
            completedCount++;
        }
    
        // Nút Delete
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
    
        // Nút Edit
        const editBtn = document.createElement('button');
        editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
        editBtn.addEventListener('click', () => editTask(task.id, task.title));
    
        li.appendChild(checkbox);
        li.appendChild(taskTitle);
        li.appendChild(editBtn);  
        li.appendChild(deleteBtn);   
        taskList.appendChild(li);
    });
    

    // Cập nhật progress bar
    const totalTasks = tasks.length;
    const progressPercentage = totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0;
    progressFill.style.width = `${progressPercentage}%`;
    progressText.textContent = `${completedCount} of ${totalTasks} tasks done`;

    updateProgressBarColor(progressPercentage);  

    // Hiển thị nút Remove Checked nếu có task đã hoàn thành
    if (completedCount > 0) {
        removeCheckedBtn.classList.remove('hidden');
    } else {
        removeCheckedBtn.classList.add('hidden');
    }
};


// Thêm task mới
const addTask = async (title) => {
    if (!title.trim()) {
        console.error('Task title is empty');
        return;
    }

    const newTask = { title, completed: false }; // Thêm completed: false

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });
        if (!response.ok) {
            throw new Error('Failed to add task');
        }
        renderTasks();
    } catch (error) {
        console.error('Error adding task:', error);
    }
};

const editTask = async (id, currentTitle) => {
    const newTitle = prompt('Edit your task:', currentTitle);  // Hiển thị prompt để người dùng chỉnh sửa
    if (newTitle && newTitle.trim()) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: newTitle.trim() })
            });
            if (!response.ok) {
                throw new Error('Failed to edit task');
            }
            renderTasks();  // Tải lại danh sách sau khi chỉnh sửa thành công
        } catch (error) {
            console.error('Error editing task:', error);
        }
    }
};


// Xóa task
const deleteTask = async (id) => {
    try {
        console.log(`Deleting task with ID: ${id}`);  
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete task with ID ${id}: ${response.statusText}`);
        }
        renderTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
    }
};



// Cập nhật trạng thái task (hoàn thành/chưa hoàn thành)
const toggleTaskStatus = async (id, completed) => {
    try {
        const response = await fetch(`${API_URL}/${id}/completed`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed })
        });
        if (!response.ok) {
            throw new Error('Failed to update task');
        }
        renderTasks();
    } catch (error) {
        console.error('Error updating task:', error);
    }
};

// Xóa tất cả các task đã hoàn thành
const removeChecked = async () => {
    try {
        const response = await fetch(`${API_URL}/completed`, { method: 'DELETE' });
        if (!response.ok) {
            throw new Error('Failed to remove checked tasks');
        }
        renderTasks();
    } catch (error) {
        console.error('Error removing checked tasks:', error);
    }
};

// Khởi động khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addTaskBtn');
    const taskInput = document.getElementById('taskInput');

    addButton.addEventListener('click', () => {
        const title = taskInput.value.trim();  
        if (title) {
            addTask(title);   
            taskInput.value = '';  
        } else {
            console.error('Task title is empty');  
        }
    });

    renderTasks();
});
