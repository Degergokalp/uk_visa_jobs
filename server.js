const express = require('express');
const path = require('path');
const app = express();

// Serve static files from the root directory
app.use(express.static('./'));

// Handle specific routes
app.get('/jobs', (req, res) => {
    res.sendFile(path.join(__dirname, 'jobs.html'));
});

// Handle all other routes by sending index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 