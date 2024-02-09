import express from 'express';

const app = express();

app.listen(3000, () => {            // Start server
  console.log('Server started on port 3000!');
});