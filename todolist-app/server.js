const express = require('express');
const cors = require('cors'); 
const db = require('./db/queries');  // Import các truy vấn database
const app = express();
const port = 3000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());  // Middleware để xử lý JSON payloads

// Lấy tất cả các tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await db.getTasks();  // Gọi hàm từ queries.js
        return res.json(tasks);  // Return để đảm bảo chỉ gửi phản hồi 1 lần
    } catch (error) {
        return res.status(500).json({ error: error.message });  // Xử lý lỗi và trả về cho client
    }
});

// Thêm một task mới
app.post('/api/tasks', async (req, res) => {
    try {
        const { title } = req.body;  // Lấy title từ request body
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });  // Trả về lỗi nếu title không có
        }
        const newTask = await db.addTask(req.body);  // Gọi hàm addTask từ queries
        return res.status(201).json(newTask);  // Return phản hồi task mới được thêm
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

// Cập nhật tiêu đề task
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const updatedTask = await db.updateTask(req.params.id, req.body);
        return res.json(updatedTask);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

//delete theo checked
app.delete('/api/tasks/completed', async (req, res) => {
    try {
        await db.deleteCompletedTasks();
        res.status(200).json({ message: 'Completed tasks removed successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Xóa task theo ID
app.delete('/api/tasks/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.deleteTask(id);
        if (result.rowCount === 0) {
            // Task không được tìm thấy
            return res.status(404).json({ error: 'Task không tồn tại' });
        }
        return res.status(200).json({ message: 'Task đã xóa thành công' });
    } catch (error) {
        console.error('Lỗi khi xóa task:', error);
        return res.status(500).json({ error: 'Lỗi khi xóa task' });
    }
});




app.put('/api/tasks/:id/completed', async (req, res) => {
    try {
        const updatedTask = await db.toggleTaskComplete(req.params.id, req.body.completed);
        return res.json(updatedTask);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server chạy trên cổng ${port}`);
});
