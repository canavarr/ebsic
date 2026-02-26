import fs from 'fs';
import https from 'https';

const download = (url, path) => {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        }, (res) => {
            // Handle redirects
            if (res.statusCode === 301 || res.statusCode === 302) {
                return download(res.headers.location, path).then(resolve).catch(reject);
            }

            if (res.statusCode === 200) {
                const file = fs.createWriteStream(path);
                res.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            } else {
                reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
            }
        }).on('error', reject);
    });
};

async function main() {
    try {
        await download('https://www.google.com/s2/favicons?domain=nvidia.com&sz=128', 'public/icons/NVDA.png');
        console.log('Downloaded NVDA.png');

        await download('https://www.google.com/s2/favicons?domain=engie.com&sz=128', 'public/icons/ENGI.png');
        console.log('Downloaded ENGI.png');

        await download('https://www.google.com/s2/favicons?domain=spglobal.com&sz=128', 'public/icons/SPY.png');
        console.log('Downloaded SPY.png');
    } catch (err) {
        console.error(err);
    }
}

main();
