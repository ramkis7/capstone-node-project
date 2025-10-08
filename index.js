const http = require('http');
const PORT = 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type':'text/html'});
    res.end(`<h1>Hello from Node.js on Capstone Project!</h1>
<!-- SONAR DUPLICATION DEMO -->
<section class="card">
  <h2>Demo Card</h2>
  <p>Line 1</p><p>Line 2</p><p>Line 3</p>
</section>
<section class="card">
  <h2>Demo Card</h2>
  <p>Line 1</p><p>Line 2</p><p>Line 3</p>
</section>
<!-- END SONAR DUPLICATION DEMO -->
`);
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

