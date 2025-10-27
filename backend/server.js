// server.js - Server entry point
const createApp = require('./app');

const app = createApp();
const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
