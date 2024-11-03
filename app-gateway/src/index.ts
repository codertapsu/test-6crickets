import * as cors from 'cors';
import * as express from 'express';

const app = express();
app.use(
  cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
  }),
);

const randomNumberInRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

const addSecondsToDate = (date: Date, seconds: number) => {
  return new Date(date.getTime() + seconds * 1000);
};

app.get('/api/deadline', (req, res) => {
  const now = new Date();
  const deadline = addSecondsToDate(now, randomNumberInRange(60, 300));
  const secondsLeft = Math.floor((deadline.getTime() - now.getTime()) / 1000);
  res.json({secondsLeft: secondsLeft});
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
