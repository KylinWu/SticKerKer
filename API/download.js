const request = require('request-promise');
const fs = require('fs');
const path = require('path');
const decompress = require('decompress');
const sharp = require('sharp');

async function getPack(id) {
    const packURL = 'http://dl.stickershop.line.naver.jp/products/0/0/1/' + id + '/iphone/stickers@2x.zip';
    console.log(packURL);
    return await new Promise(resolve =>
        request.get(packURL)
        .pipe(fs.createWriteStream('./StickerSets/pack.zip'))
        .on('finish', resolve)
    );
}

async function unzipPack() {
    return await decompress('./StickerSets/pack.zip', './StickerSets/pack', {
        filter: file => RegExp('[0-9]+@2x.png').test(path.basename(file.path))
    }).then(files => {
        console.log('Extrat Sticker Pack Done!');
    });
}

async function resizeSticker() {
    return await fs.readdir('./StickerSets/pack', (err, stickers) => {
        if (err) throw err;
        stickers.forEach((sticker) => {
            const stickerPath = path.resolve('./StickerSets/pack/', path.basename(sticker));
            sharp(stickerPath)
            .resize(512, 512)
            .background({r: 255, g: 255, b: 255, alpha: 0})
            .embed()
            .toFormat('png')
            .toBuffer((err, buffer) => {
                fs.writeFile(stickerPath, buffer, (err) => {
                    if (err) throw err;
                });
            })
        });
    });
}

const download = async function (id) {
    try {
        await getPack(id);
        await unzipPack();
        await resizeSticker();
    } catch (e) {
        console.log(e);
    }
}

module.exports = download;
