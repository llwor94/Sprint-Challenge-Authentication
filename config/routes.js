const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database/dbConfig');
const { authenticate } = require('./middlewares');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  let body = req.body;
  if (!(body.username && body.password)) return res.json({ code: 400 });

  const hash = bcrypt.hashSync(body.password, 10);
  body.password = hash;

  db('users')
    .insert(body)
    .then(response => {
      if (response) return res.status(200).send(response);
    })
    .catch(err => res.status(500).send(err));
}

function login(req, res) {
  // implement user login
}

function getJokes(req, res) {
  axios
    .get(
      'https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_ten',
    )
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
