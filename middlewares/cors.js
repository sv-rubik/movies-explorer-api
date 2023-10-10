const allowedCors = [
  'https://api.sv-rubik-diploma.nomoredomainsrocks.ru',
  'http://api.sv-rubik-diploma.nomoredomainsrocks.ru',
  'https://sv-rubik-diploma.nomoredomainsrocks.ru',
  'http://sv-rubik-diploma.nomoredomainsrocks.ru',
  'localhost:3000',
  'localhost:5000',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:3000',
  'http://158.160.120.107',
  '158.160.120.107',
  /(https|http)?:\/\/(?:www\.|(?!www))sv-rubik-diploma.nomoredomains.xyz\/[a-z]+\/|[a-z]+\/|[a-z]+(\/|)/,
];

module.exports = (req, res, next) => {
  const { origin } = req.headers;

  if (
    allowedCors.some((e) => e.test && e.test(origin)) || allowedCors.includes(origin)
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
// module.exports = (req, res, next) => {
//   const { method } = req;
//   const requestHeaders = req.headers['access-control-request-headers'];
//   const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
//
//   // Set the Access-Control-Allow-Origin header to allow all origins
//   res.header('Access-Control-Allow-Origin', '*');
//
//   if (method === 'OPTIONS') {
//     // Allow all types of cross-origin requests (by default)
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//     // Allow cross-origin requests with these headers
//     res.header('Access-Control-Allow-Headers', requestHeaders);
//     // End the request processing and return the result to the client
//     return res.end();
//   }
//
//   return next();
// };
