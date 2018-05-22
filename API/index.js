const download = require('./download');
const clean = require('./clean');

function API () {
};

API.prototype.download = download;
API.prototype.clean = clean;

module.exports = API;
