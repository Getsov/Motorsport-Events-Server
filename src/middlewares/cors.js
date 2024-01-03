module.exports = () => (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'HEAD, OPTIONS, GET, POST, PUT, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, X-Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }

  // if (req.method === 'OPTIONS') {
  //     res.status(200).end();
  // }

  // next();
};
