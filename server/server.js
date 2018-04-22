const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const db = require('./db');

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const config = require('../webpack.config.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
// app.use(webpackDevMiddleware(compiler, {
//     publicPath: config.output.publicPath
// }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('static'));

app.get('/', function(req, res) {
    res.sendFile('./static/index.html');
});
app.get('/api/addresses', function(req, res) {
    res.send(db.read());
});
app.post('/api/addresses', function(req, res) {
    res.send(db.create(req.body));
});
app.put('/api/addresses/:id', function(req, res) {
    res.send(db.update(req.params.id, req.body));
});
app.delete('/api/addresses/:id', function(req, res) {
    res.send(db.delete(req.params.id));
});

webpack(config, function(err, stats) {
    if (err || stats.hasErrors()) {
        console.log(err);
        process.exit()
    }
    app.listen(8000, function() {
        console.log('App listening on port 8000!\n');
    });
});

// app.listen(8000, function() {
//     console.log('App listening on port 8000!\n');
// });