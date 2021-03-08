import express from 'express';
import fetch from 'node-fetch';
import path from 'path';

const app = express();
const host = '127.0.0.1';
const port = 3000;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "..", "src", "views"));

app.get('/', function(req, res) {
  res.render('home');
});

const server = app.listen(port, function() {
  console.log(`server is running on port ${port}`);
});
