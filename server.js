const express = require('express');
const axios = require('axios');
const path = require('path'); // Add path module

const fs = require('fs'); // Add the fs module

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


const app = express();
const PORT = 5000;

app.use(express.static('public'));

// Serve 'app.js' with the correct MIME type
app.get('/app.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'app.js'), { type: 'application/javascript' });
  });

app.post('/uploadFile', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path;
        const fileType = req.file.mimetype;
        // console.log("hi123");
        if (fileType === 'application/json' || fileType === 'text/csv') {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const jsonData = fileType === 'application/json' ? JSON.parse(fileContent) : parseCsv(fileContent);
            res.json(jsonData);
        } else {
            console.error('Unsupported file type:', fileType);
            res.status(400).send('Unsupported file type');
        }
    } catch (error) {
        console.error('Error uploading file:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Add a function to parse CSV content
function parseCsv(csvContent) {
    const lines = csvContent.split('\n');
    const header = lines[0].split(',');
    const products = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const product = {};

        for (let j = 0; j < header.length; j++) {
            product[header[j].trim()] = values[j].trim();
        }

        products.push(product);
    }

    return { count: products.length, products };
}


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
