// A controller receives the request (req) and sends back a response (res).
// This one just says "the server is alive".
const getHealth = (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'medimind-backend',
    time: new Date().toISOString(),
  });
};

module.exports = { getHealth };