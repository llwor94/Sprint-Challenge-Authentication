const axios = require('axios');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtKey = require('../_secrets/keys').jwtKey;
const db = require('../database/dbConfig');
const { authenticate } = require('./middlewares');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function generateToken(id) {
  const payload = {
    id,
  };
  const options = {
    expiresIn: '1h',
    jwtid: '12345',
    subject: `${id}`,
  };
  return jwt.sign(payload, jwtKey, options);
}

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
  let body = req.body;
  if (!(body.username && body.password)) return res.json({ code: 400 });
  db('users')
    .where({ username: body.username })
    .first()
    .then(response => {
      if (response && bcrypt.compareSync(body.password, response.password)) {
        const token = generateToken(response);
        if (token) return res.status(200).send(token);
        else res.send({ code: 400 });
      }
    })
    .catch(err => res.status(500).send(err));
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
