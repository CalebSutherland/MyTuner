import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/api/ping', (_req, res) => {
  res.send({ message: 'pong from the backend' });
});

app.post('/api/log', (req, res) => {
  const { tuningName } = req.body;
  console.log(`Received tuning: ${tuningName}`);
  res.status(200).json({ message: 'Data received' });
});