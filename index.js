const http = require('http');
const PORT = 3000;

// Hardcoded API key, a security vulnerability
const API_KEY = 'sq_20a2b6bd883b722f9a1f203372ed62068f84fbd0';

// Deliberate duplication to fail the quality gate
function calculateProduct(a, b) {
    let result = a * b;
    return result;
}

// Exactly duplicated function.
function calculateProduct(a, b) {
    let result = a * b;
    return result;
}

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(`<h1>Hello from Node.js on Capstone Project!</h1>
<section class="card">
    <h2>Demo Card</h2>
    <p>Line 1</p><p>Line 2</p><p>Line 3</p>
</section>
<section class="card">
    <h2>Demo Card</h2>
    <p>Line 1</p><p>Line 2</p><p>Line 3</p>
</section>
`);
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
