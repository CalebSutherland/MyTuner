import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/ping', (_req, res) => {
  res.send({ message: 'pong from the backend' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});