import { snipe } from 'deckspyinator';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import screenshot from 'screenshot-desktop';
import sharp from 'sharp';
import { createWorker } from 'tesseract.js';

const key = readFileSync(join(__dirname, '../dev/key.txt')).toString();

(async () => {
    const sc = await screenshot({ format: 'png' });

    // writeFileSync(join(__dirname, '../data/captureNEW.png'), sc);
    // const sc = join(__dirname, '../data/capture.png');

    const img = await sharp(sc)
        .extract({ left: 47, top: 33, height: 33 + 25, width: 221 })
        .toBuffer();

    writeFileSync(join(__dirname, '../data/player.png'), img);

    const clanImg = await sharp(img)
        .extract({ left: 0, top: 34, width: 221, height: 24 })
        .grayscale()
        .normalise({ lower: 80, upper: 100 })
        .negate({ alpha: false })
        .resize({ height: 100 })
        .modulate({
            brightness: 0.5,
        })
        .toBuffer();

    const playerImg = await sharp(img)
        .extract({ top: 0, left: 2, width: 219, height: 33 })
        .resize({ height: 100 })
        .normalise({ lower: 60, upper: 90 })
        .modulate({
            brightness: 0.3,
        })
        .toBuffer();

    writeFileSync(join(__dirname, '../data/clanPP.png'), clanImg);
    writeFileSync(join(__dirname, '../data/playerPP.png'), playerImg);

    const worker = await createWorker('eng');

    const {
        data: { text: clan },
    } = await worker.recognize(clanImg);

    console.log('Clan: ' + clan);

    const {
        data: { text: player },
    } = await worker.recognize(playerImg);

    console.log('Player: ' + player);

    worker.terminate();

    snipe(key, player, clan, true);
})();
