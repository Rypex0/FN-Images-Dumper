const fs = require('fs');
const axios = require('axios');

async function FetchFortniteContent() {
    try {
        const response = await axios.get('https://api.nitestats.com/v1/epic/news');
        return response.data;
    } catch (error) {
        console.error('Error Fetching Fortnite Content:', error);
        return null;
    }
}

async function DumpFortniteImages() {
    const content = await FetchFortniteContent();
    if (content) {
        const httpsLinks = ExtractImages(content);
        if (httpsLinks.length > 0) {
            const jsonContent = JSON.stringify(httpsLinks, null, 2);
            fs.writeFile('fn_images.json', jsonContent, 'utf8', (err) => {
                if (err) {
                    console.error('Error Writing Images Links To File:', err);
                } else {
                    console.log('Fortnite Content Images Dumped In fn_images.json');
                }
            });
        } else {
            console.log('No Images Found In Fortnite Content.');
        }
    } else {
        console.log('Failed To Fetch Fortnite Content.');
    }
}

function ExtractImages(content) {
    const httpsLinks = [];
    FindImages(content, httpsLinks);
    return httpsLinks;
}

function FindImages(data, httpsLinks) {
    if (typeof data === 'object') {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                if (typeof data[key] === 'string' && data[key].startsWith('https://')) {
                    httpsLinks.push(data[key]);
                } else if (typeof data[key] === 'object') {
                    FindImages(data[key], httpsLinks);
                }
            }
        }
    }
}

DumpFortniteImages()