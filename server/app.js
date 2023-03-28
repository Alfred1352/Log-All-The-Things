const express = require('express');
const fs = require('fs');
const app = express();
const csv = require('csvtojson')

app.use((req, res, next) => {
// write your logging code here
  const agent = req.get('User-Agent').replace(/,/g, '');
  const time = new Date().toISOString();
  const method = req.method;
  const resource = req.originalUrl;
  const version = `HTTP/${req.httpVersion}`;
  const status = res.statusCode;
  const logline = `${agent},${time},${method},${resource},${version},${status}\n`;
  console.log(logline);
  fs.appendFile('./server/log.csv', logline, (error) => {
    if (error) { 
      console.log('Error found while appending the file!')
    } else {
      console.log('File successfully appended!')
    }
  });
  next();
});

app.get('/', (req, res) => {
// write your code to respond "ok" here
  res.status(200).send('ok');
});

app.get('/logs', async (req, res) => {
  // write your code to return a json object containing the log data here
  const jsonLog = await csv().fromFile('./server/log.csv');
  res.json(jsonLog)
});

module.exports = app;
