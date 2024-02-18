const express = require('express');
const axios = require('axios');
const cors = require('cors');
const querystring = require('querystring');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = 3000;

app.use(cors());

app.post('/token', (req, res, next) => {
  axios
    .post(
      'https://www.reddit.com/api/v1/access_token',
      querystring.stringify({
        grant_type: 'authorization_code',
        code: req.query.code,
        redirect_uri: process.env.REDIRECT_URI,
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
          ).toString('base64')}`,
          'content-type': 'application/x-www-form-urlencoded',
        },
      }
    )
    .then((data) => res.send(data.data))
    .catch(err => {
      console.log(err);
    });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
