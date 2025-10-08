const http = require('http');
const PORT = 3000;

const demoCard = `
<section class="card">
    <h2>Ramki Captone Project </h2>
    <p>Jenkins Pipeline</p><p>Quality Gate</p><p>Success Card</p>
</section>`;

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(`<h1>Hello from Node.js on Capstone Project!</h1>
${demoCard}
`);
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
