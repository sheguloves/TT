const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const shortid = require('shortid');
const adapter = new FileSync('db.json');
const db = lowdb(adapter);

db.defaults({ addresses: [] }).write();

const validProperties = ["id", "name", "location", "office", "phone"];

function cleanData(address) {
    if (!address) {
        return;
    }
    for (let key of Object.keys(address)) {
        if (validProperties.indexOf(key) === -1) {
            delete address[key];
        }
    }
}

function create(address) {
    var addressTemp = { ...address, id: shortid.generate() };
    cleanData(addressTemp);
    db.get('addresses')
        .push(addressTemp)
        .write();
    return addressTemp;
}

function read() {
    return db.get('addresses').value();
}

function update(id, address) {
    var addressTemp = { ...address, id: id };
    cleanData(addressTemp);
    db.get('addresses')
      .remove({ id: id})
      .write();
    db.get('addresses')
      .push(addressTemp)
      .write();
    return addressTemp;
}

function remove(id) {
    return db.get('addresses')
        .remove({ id: id })
        .write();
}

module.exports = {
    create: create,
    read: read,
    update: update,
    delete: remove
}