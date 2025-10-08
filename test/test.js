const assert = require('assert');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

const serverFile = path.join(__dirname, '..', 'index.js');
let serverProcess;

describe('Node.js App', function() {
  this.timeout(5000); // Set a timeout for tests

  before(function(done) {
    // Start the Node.js server before running tests
    serverProcess = spawn('node', [serverFile]);
    serverProcess.stdout.on('data', (data) => {
      // Wait for the server to log that it's running
      if (data.toString().includes('Server running')) {
        done();
      }
    });
  });

  after(function() {
    // Stop the server after tests are done
    serverProcess.kill('SIGINT');
  });

  it('should return 200 OK for a GET request to /', function(done) {
    http.get('http://localhost:3000', (res) => {
      assert.strictEqual(res.statusCode, 200);
      done();
    });
  });

  it('should return the correct HTML content', function(done) {
    const expectedContent = `<h1>Hello from Node.js on Capstone Project!</h1>
<section class="card">
    <h2>Ramki Captone Project </h2>
    <p>Jenkins Pipeline</p><p>Quality Gate</p><p>Success Card</p>
</section>`;

    let data = '';
    http.get('http://localhost:3000', (res) => {
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        assert.strictEqual(data.trim(), expectedContent.trim());
        done();
      });
    });
  });
});
