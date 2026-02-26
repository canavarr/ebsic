import fs from 'fs';
import https from 'https';

const download = (url, path) => {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        }, (res) => {
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

const domains = {
    'RHM': 'rheinmetall.com',
    'TVEAT': 'tallinnavesi.ee',
    'NTU1L': 'novaturas.lt',
    'SPOT': 'spotify.com',
    'ABT': 'airbaltic.com',
    'CPA1T': 'cooppank.ee',
    'MRNA': 'modernatx.com',
    'VOW3': 'volkswagen.de',
    'OR': 'loreal.com',
    'SFG1T': 'silvanofashion.com',
    'STR': 'starship.xyz',
    'PLTR': 'palantir.com',
    'NOKIA_NEW': 'nokia.com', // nokia already exists but we can overwrite or leave it
    'BRKB': 'berkshirehathaway.com',
    'URA': 'globalxetfs.com'
};

async function main() {
    for (const [ticker, domain] of Object.entries(domains)) {
        try {
            const isBrkb = ticker === 'BRKB';
            // I am just saving it as BRKB.png so there's no dot issue in the public folder
            const filename = `public/icons/${ticker}.png`;
            await download(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`, filename);
            console.log(`Downloaded ${filename}`);
        } catch (err) {
            console.error(err);
        }
    }
}

main();
