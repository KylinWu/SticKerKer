const fs = require('mz/fs');
const path = require('path');

const clean = async (directory) => {
    await fs.readdir(directory)
    .then(async files => {
        console.log('Clean '+ directory + ' files');
        for (let file of files) {
            await fs.unlink(path.join(directory, file))
            .catch(console.log);
        }
        
    })
    .catch(console.log)
}

module.exports = clean;
