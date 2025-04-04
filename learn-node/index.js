//this is a simple server using node js with express and mysql
const express = require('express')
const mysql = require('mysql2')
const app = express()
const port = 3000
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'node_db'
})
app.use(express.json())
app.get('/', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            res.status(500).send({ message: err.message })
        }
        res.send(results)
    })
})
app.post('/user', async (req, res) => {
    const { name, password } = req.body;

    // Enhanced validation  
    if (!name?.trim() || !password?.trim()) {
        return res.status(400).json({
            error: 'Name and password are required',
            received: { name, password }
        });
    }

    try {
        const [result] = await db.promise().query(
            'INSERT INTO users (name, password) VALUES (?, ?)',
            [name, password]
        );

        res.status(201).json({
            message: 'User created successfully',
            userId: result.insertId
        });

    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({
            error: 'Failed to create user',
            details: err.message
        });
    }
});
app.delete('/users/:id', function (req, res) {
    const id = req.params.id;
    db.query('DELETE FROM users WHERE id = ?', [id], function (err, results) {
        if (err) {
            res.status(500).send({ message: err.message })
        }
        res.send({ message: 'User deleted successfully' })
    })

})
app.put('/users/:id', function (req, res) {
    const id = req.params.id;
    const { name, password } = req.body;
    db.query('UPDATE users SET name = ?, password = ? WHERE id = ?', [name, password, id], function (err, results) {
        if (err) {
            res.status(500).send({ message: err.message })
        }
        res.send({ message: 'User updated successfully' })
    })
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
