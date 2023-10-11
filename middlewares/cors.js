// module.exports = (req, res, next) => {
//   const { method } = req;
//   const requestHeaders = req.headers['access-control-request-headers'];
//   const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
//
//   res.header('Access-Control-Allow-Origin', '*');
//
//   if (method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     return res.end();
//   }
//
//   return next();
// };

module.exports = (req, res, next) => {
  const allowedCors = [
    'localhost:3000',
    'localhost:5000',
    'http://localhost:3000',
    'http://localhost:5000',
    'https://localhost:3000',
    'https://localhost:5000',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5000',
    'http://sv-rubik-diploma.nomoredomainsrocks.ru/',
    'https://sv-rubik-diploma.nomoredomainsrocks.ru/',
  ];

  const { origin } = req.headers;

  if (
    allowedCors.some((e) => e.test && e.test(origin))
    || allowedCors.includes(origin)
  ) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
  }
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  return next();
};
