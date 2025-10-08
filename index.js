const http = require('http');
const PORT = 3000;

// Replaced hardcoded key with an environment variable.
const API_KEY = process.env.API_KEY;

// Removed the duplicate function and refactored the HTML to eliminate duplication.
const demoCard = `
<section class="card">
    <h2>Demo Card</h2>
    <p>Line 1</p><p>Line 2</p><p>Line 3</p>
</section>`;

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(`<h1>Hello from Node.js on Capstone Project!</h1>
${demoCard}
`);
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
