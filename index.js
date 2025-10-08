const http = require('http');

const PORT = 3000;

// This HTML block is a template for the web page content.
const demoCard = `
<section class="card">
    <h2>Ramki Capstone Project</h2>
    <p>Jenkins Pipeline</p>
    <p>Quality Gate</p>
    <p>Success Card</p>
</section>`;

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Capstone Project</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 2rem;
            text-align: center;
        }
        h1 {
            color: #5a5a5a;
        }
        .card {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 1.5rem;
            margin: 2rem auto;
            max-width: 400px;
        }
        h2 {
            color: #4CAF50;
        }
    </style>
</head>
<body>
    <h1>Hello from Node.js on Capstone Project!</h1>
    ${demoCard}
</body>
</html>
`);
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
