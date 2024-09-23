const pool = require('./config');

const getTasks = async () => {
    try {
        const result = await pool.query('SELECT * FROM tasks ORDER BY created_at ASC');
        return result.rows;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
};

const getCompletedTasks = async () => {
    try {
        const result = await pool.query('SELECT * FROM tasks WHERE completed = true');
        return result.rows;
    } catch (err) {
        throw new Error(`Database query failed: ${err.message}`);
    }
};


const addTask = async (data) => {
    const { title } = data;

    try {
        const result = await pool.query(
            'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
            [title]
        );
        return result.rows[0];
    } catch (err) {
        throw new Error('Error adding task: ' + err.message);
    }
};

const updateTask = async (id, data) => {
    const { title } = data;
    try {
        const result = await pool.query(
            'UPDATE tasks SET title = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [title, id]
        );
        return result.rows[0];
    } catch (err) {
        throw new Error('Error updating task: ' + err.message);
    }
};

const deleteCompletedTasks = async () => {
    try {
        await pool.query('DELETE FROM tasks WHERE completed = TRUE');
    } catch (err) {
        throw new Error('Error removing checked tasks: ' + err.message);
    }
};

const deleteTask = async (id) => {
    try {
        const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
        return result; // Trả về kết quả để kiểm tra rowCount
    } catch (err) {
        throw new Error('Lỗi khi xóa task: ' + err.message);
    }
};
// Cập nhật trạng thái hoàn thành của task
const toggleTaskComplete = async (id, completed) => {
    try {
        const result = await pool.query(
            'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
            [completed, id]
        );
        return result.rows[0];
    } catch (err) {
        throw new Error('Error toggling task complete status: ' + err.message);
    }
};

module.exports = {
    getTasks,
    addTask,
    updateTask,
    deleteCompletedTasks,
    getCompletedTasks,
    toggleTaskComplete,
    deleteTask,
};
