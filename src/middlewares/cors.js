module.exports = () => (req, res, next) => {
  
 // Replace with actual frontend origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  //Ionic default port
  // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'HEAD, OPTIONS, GET, POST, PUT, DELETE'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, X-Authorization'
  );
  // Allow credentials in CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
};
