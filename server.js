const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => {
  res.status(404).send(`
    <div style="background:#050811; color:#ff0055; font-family:monospace; padding:40px; height:100vh;">
      <h1>[404] ERROR: RESOURCE_NOT_FOUND</h1>
      <p>The requested system route does not exist on this mainframe.</p>
      <a href="/" style="color:#00e5ff;">&lt; RETURN_TO_NODE</a>
    </div>
  `);
});

app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`[NEO_ZERO CORE] Active on http://localhost:${PORT}`);
  console.log(`==================================================\n`);
});