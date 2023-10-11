require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { PORT = 5000, BASE_PATH = 'localhost' } = process.env;
const cors = require('cors');

// защита приложения
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { requestLogger, errorLogger } = require('./middlewares/logger');

// const cors = require('./middlewares/cors');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();
const router = require('./routes/index');
const errorsHandler = require('./middlewares/errorsHandler');

// app.use(cors());

app.use(helmet());
app.use(limiter);

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'https://localhost:3000',
    'https://localhost:5000',
    'http://sv-rubik-diploma.nomoredomainsrocks.ru',
    'https://sv-rubik-diploma.nomoredomainsrocks.ru',
  ],
}));

// Добавляем middleware для разбора JSON
app.use(express.json());

// Логирование запросов - до всех обработчиков роутов
app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

// Основные роуты регистрации, логина и основных маршрутов из index.js
app.use(router);

// логгер ошибок - после обработчиков роутов и до обработчиков ошибок
app.use(errorLogger);

// важно ставить обработчик ошибок после остальных midllewares и маршрутов
app.use(errors());
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`App listening on ${BASE_PATH}:${PORT}`);
});
