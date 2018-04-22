
const app = require('angular').module('app.services',[]);

app.factory("messageService", require('./message'));
app.factory("addressService", require('./address'));
