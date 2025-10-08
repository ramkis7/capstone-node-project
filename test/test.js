
const assert = require('assert');
const http = require('http');

describe('Node.js App', function() {
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
