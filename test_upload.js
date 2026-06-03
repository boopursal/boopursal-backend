const fs = require('fs');
const path = require('path');

async function testUpload() {
    try {
        // Create a dummy file
        const filePath = path.join(__dirname, 'dummy.txt');
        fs.writeFileSync(filePath, 'Hello world');

        // Prepare form data
        const form = new FormData();
        const fileBuffer = fs.readFileSync(filePath);
        form.append('file', new Blob([fileBuffer]), 'dummy.txt');

        console.log('Sending upload request to production...');
        const response = await fetch('https://boopursal-backend.vercel.app/api/attachements', {
            method: 'POST',
            body: form
        });

        const data = await response.json().catch(() => response.text());
        console.log('Status:', response.status);
        console.log('Data:', data);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

testUpload();
