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

    const img = await sharp(sc)
        .extract({ left: 47, top: 33, height: 33 + 25, width: 221 })
        .toBuffer();

    writeFileSync(join(__dirname, '../data/PLYERNEW2222.png'), img);
})();
