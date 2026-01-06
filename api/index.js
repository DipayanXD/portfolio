const app = require('../backend/server');

// Vercel Serverless Function Handler
module.exports = (req, res) => {
    app(req, res);
};
