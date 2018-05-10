const API = require('./API');
const api = new API();

async function run () {
    await api.download('1427029');
}

run();
