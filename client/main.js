const angular = require('angular');

require('./style.css');

require('./services');
require('./filters');
require('./directives');



angular.module("app", ['app.services', 'app.filters', 'app.directives']);


